<template>
<div class="tp-root" :style="{ fontFamily: font, background: surfPage }">

	<!-- TOOLBAR -->
	<div class="tp-toolbar" :style="{ background: surfPanel, borderBottom: '1px solid ' + alt('200') }">
		<div class="tp-toolbar-left">
			<h2 class="tp-title" :style="{ color: ink(9) }">Theme Preview</h2>
			<span v-if="previewSource === 'editor'" class="tp-badge-preview"
				:style="{ background: pri('100'), color: pri('700') }">
				Previewing from Editor (unsaved)
			</span>
			<span v-else class="tp-subtitle" :style="{ color: ink(5) }">
				{{ themeMode === 'default' ? 'Frappe Defaults' : 'Custom Theme' }}
			</span>
		</div>
		<div class="tp-toolbar-right">
			<button v-if="previewSource === 'editor'" class="tp-dismiss-btn" @click="dismissPreview"
				:style="{ borderColor: alt('300'), color: ink(7) }">
				Dismiss Preview
			</button>
			<select v-if="themes.length && previewSource !== 'editor'" v-model="selectedThemeName" class="tp-select"
				:style="{ borderColor: alt('300'), color: ink(7), background: surfPanel }">
				<option v-for="t in themes" :key="t.name" :value="t.name">{{ t.theme_name }}</option>
			</select>
			<button class="tp-toggle-btn" @click="toggleMode" :disabled="!customTokens"
				:style="{
					background: themeMode === 'custom' ? pri('600') : alt('200'),
					color: themeMode === 'custom' ? '#fff' : ink(7),
					fontWeight: btnWeight
				}">
				{{ themeMode === 'default' ? 'Apply Custom Theme' : 'Show Defaults' }}
			</button>
		</div>
	</div>

	<div v-if="loading" class="tp-loading" :style="{ color: ink(5) }">Loading themes…</div>

	<div v-else class="tp-content">

		<!-- 1. GRADIENT HEADER -->
		<div class="tp-header"
			:style="{ background: 'linear-gradient(135deg, ' + pri('600') + ', ' + pri('400') + ', ' + pri('700') + ')' }">
			<div class="tp-header-inner">
				<div>
					<h1 class="tp-h1">Business Dashboard</h1>
					<p class="tp-header-sub">Simulated layout showcasing all theme-controlled Tailwind styles</p>
				</div>
				<div class="tp-header-nav">
					<span class="tp-nav-item">Reports</span>
					<span class="tp-nav-item">Analytics</span>
					<span class="tp-nav-item tp-nav-active">Dashboard</span>
				</div>
			</div>
		</div>

		<!-- 2. KPI CARDS -->
		<div class="tp-kpi-row">
			<div v-for="(card, i) in kpiCards" :key="i" class="tp-kpi-card"
				:style="{ background: surfPanel, borderColor: alt('200'), boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)' }">
				<div class="tp-kpi-top">
					<div>
						<p class="tp-kpi-label" :style="{ color: ink(5) }">{{ card.label }}</p>
						<p class="tp-kpi-value" :style="{ color: ink(9) }">{{ card.value }}</p>
					</div>
					<div class="tp-kpi-icon" :style="{ background: pri('100') }">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
							:stroke="pri('600')" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path :d="ICONS[card.icon]" />
						</svg>
					</div>
				</div>
				<div class="tp-kpi-bottom">
					<span class="tp-kpi-change"
						:style="{ color: card.positive ? sem('success') : sem('danger') }">{{ card.change }}</span>
					<span class="tp-kpi-vs" :style="{ color: ink(4) }">vs last month</span>
				</div>
			</div>
		</div>

		<div class="tp-two-col">
			<!-- 3. DATA TABLE -->
			<div class="tp-table-wrapper" :style="{ background: surfPanel, borderColor: alt('200') }">
				<div class="tp-section-header">
					<h3 class="tp-section-title" :style="{ color: ink(8) }">Recent Accounts</h3>
					<button class="tp-sm-btn"
						:style="{ color: pri('600'), borderColor: pri('200'), background: pri('50') }">View All</button>
				</div>
				<div class="tp-table-scroll" :style="{ borderColor: alt('200') }">
					<table class="tp-table">
						<thead>
							<tr :style="{ background: alt('50') }">
								<th :style="{ color: ink(6), borderColor: alt('200') }">Company</th>
								<th :style="{ color: ink(6), borderColor: alt('200') }">Contact</th>
								<th :style="{ color: ink(6), borderColor: alt('200') }">Status</th>
								<th :style="{ color: ink(6), borderColor: alt('200') }" class="text-right">Revenue</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(row, idx) in tableData" :key="row.id"
								:style="{ background: idx % 2 === 1 ? alt('50') : 'transparent', borderColor: alt('100') }">
								<td class="tp-td-bold" :style="{ color: ink(9) }">{{ row.name }}</td>
								<td :style="{ color: ink(5) }">{{ row.contact }}</td>
								<td>
									<span class="tp-badge" :style="badgeStyle(row.status)">{{ row.status }}</span>
								</td>
								<td class="tp-td-bold text-right" :style="{ color: ink(8) }">{{ row.revenue }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- 4. FORM SECTION -->
			<div class="tp-form-wrapper" :style="{ background: surfPanel, borderColor: alt('200') }">
				<h3 class="tp-section-title" :style="{ color: ink(8) }">Quick Entry Form</h3>
				<div class="tp-form-group">
					<label class="tp-label" :style="{ color: ink(7) }">Company Name</label>
					<input type="text" placeholder="Enter company name…" class="tp-input"
						:style="inputStyle" />
				</div>
				<div class="tp-form-group">
					<label class="tp-label" :style="{ color: ink(7) }">Description</label>
					<textarea placeholder="Brief description…" rows="3" class="tp-input tp-textarea"
						:style="{ ...inputStyle, fontStyle: 'italic' }"></textarea>
				</div>
				<div class="tp-form-row">
					<label class="tp-checkbox-label" :style="{ color: ink(7) }">
						<input type="checkbox" checked :style="{ accentColor: pri('600') }" />
						<span>Active account</span>
					</label>
					<label class="tp-checkbox-label" :style="{ color: ink(7) }">
						<input type="radio" name="priority" checked :style="{ accentColor: pri('600') }" />
						<span>High priority</span>
					</label>
					<label class="tp-checkbox-label" :style="{ color: ink(7) }">
						<input type="radio" name="priority" :style="{ accentColor: pri('600') }" />
						<span>Normal</span>
					</label>
				</div>
				<div class="tp-btn-row">
					<button class="tp-btn-primary" :style="{ background: pri('600'), fontWeight: btnWeight }">Save Entry</button>
					<button class="tp-btn-outline" :style="{ borderColor: alt('300'), color: ink(7) }">Cancel</button>
				</div>
			</div>
		</div>

		<!-- 5. TYPOGRAPHY -->
		<div class="tp-card" :style="{ background: surfPanel, borderColor: alt('200') }">
			<h3 class="tp-section-title" :style="{ color: ink(8) }">Typography Scale</h3>
			<div class="tp-typo-grid">
				<div v-for="item in typoScale" :key="item.label" class="tp-typo-row">
					<span class="tp-typo-label" :style="{ color: ink(4) }">{{ item.label }}</span>
					<span :style="{ fontSize: item.size, fontWeight: item.weight, lineHeight: item.lh, color: ink(9) }">
						The quick brown fox jumps over the lazy dog
					</span>
				</div>
			</div>
			<div class="tp-typo-extras">
				<span :style="{ color: ink(7), letterSpacing: '-0.025em' }">Tight tracking</span>
				<span :style="{ color: ink(7), letterSpacing: '0.05em' }">Wide tracking</span>
				<span :style="{ color: ink(7), letterSpacing: '0.1em', textTransform: 'uppercase' }">Widest + uppercase</span>
				<a href="#" :style="{ color: pri('600'), textDecorationColor: pri('300') }" class="tp-decorated-link">Decorated link</a>
				<span :style="{ color: ink(5), opacity: 0.5 }">50% text opacity</span>
			</div>
		</div>

		<!-- 6. SVG ICONS -->
		<div class="tp-card" :style="{ background: surfPanel, borderColor: alt('200') }">
			<h3 class="tp-section-title" :style="{ color: ink(8) }">SVG Icons (fill &amp; stroke)</h3>
			<div class="tp-icons-row">
				<div v-for="(entry, i) in iconEntries" :key="i" class="tp-icon-item">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
						:stroke="pri(entry.shade)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path :d="ICONS[entry.icon]" />
					</svg>
					<span class="tp-icon-label" :style="{ color: ink(6) }">{{ entry.label }}</span>
				</div>
			</div>
			<div class="tp-filled-row">
				<span :style="{ color: ink(5) }">Filled variant:</span>
				<svg width="24" height="24" viewBox="0 0 24 24" :fill="pri('500')" stroke="none"><path :d="ICONS.star" /></svg>
				<svg width="24" height="24" viewBox="0 0 24 24" :fill="sem('success')" stroke="none"><path :d="ICONS.check" /></svg>
				<svg width="24" height="24" viewBox="0 0 24 24" :fill="sem('danger')" stroke="none"><path :d="ICONS.bell" /></svg>
			</div>
		</div>

		<!-- 7. GRADIENTS & OPACITY -->
		<div class="tp-card" :style="{ background: surfPanel, borderColor: alt('200') }">
			<h3 class="tp-section-title" :style="{ color: ink(8) }">Gradient &amp; Opacity</h3>
			<div class="tp-gradient-strips">
				<div class="tp-gradient-strip"
					:style="{ background: 'linear-gradient(to right, ' + pri('400') + ', ' + pri('600') + ', ' + pri('800') + ')' }">
					Primary gradient (from → via → to)
				</div>
				<div class="tp-gradient-strip"
					:style="{ background: 'linear-gradient(to right, ' + pri('500') + ', ' + alt('500') + ')' }">
					Primary → Alternate blend
				</div>
				<div class="tp-gradient-strip"
					:style="{ background: 'linear-gradient(135deg, ' + sem('success') + ', ' + sem('info') + ')' }">
					Semantic: Success → Info
				</div>
			</div>
			<div class="tp-opacity-row">
				<div v-for="o in [100, 75, 50, 25, 10]" :key="o" class="tp-opacity-swatch"
					:style="{ background: pri('600'), opacity: o / 100 }">{{ o }}%</div>
			</div>
		</div>

		<!-- 8. RESPONSIVE BREAKPOINTS -->
		<div class="tp-card" :style="{ background: surfPanel, borderColor: alt('200') }">
			<h3 class="tp-section-title" :style="{ color: ink(8) }">Responsive Breakpoints (Frappe UI)</h3>
			<div class="tp-breakpoints">
				<div v-for="bp in breakpoints" :key="bp.label" class="tp-bp-card"
					:style="{ borderColor: pri('200'), background: pri('50') }">
					<span class="tp-bp-label" :style="{ color: pri('700') }">{{ bp.label }}:</span>
					<span :style="{ color: ink(6) }">≥ {{ bp.px }}</span>
					<span :style="{ color: ink(4) }">{{ bp.desc }}</span>
				</div>
			</div>
			<p class="tp-note" :style="{ color: ink(4) }">
				Note: Frappe UI removes the 2xl (1536px) breakpoint. Mobile-first: base styles apply to all, add sm:/md:/lg:/xl: for larger screens.
			</p>
		</div>

		<!-- 9. DARK MODE PANEL -->
		<div class="tp-card" :style="{ background: surfPanel, borderColor: alt('200') }">
			<h3 class="tp-section-title" :style="{ color: ink(8) }">Dark Mode Preview</h3>
			<div class="tp-dark-panel" data-theme="dark"
				:style="{ background: alt('900'), borderColor: alt('700') }">
				<p class="tp-dark-title" :style="{ color: '#F9FAFB' }">Dark surface</p>
				<p class="tp-dark-desc" :style="{ color: alt('300') }">
					In Frappe UI, dark mode uses <code :style="{ color: pri('300') }">[data-theme="dark"]</code> selector instead of media query.
				</p>
				<div class="tp-btn-row">
					<button class="tp-btn-primary" :style="{ background: pri('500'), fontWeight: btnWeight }">Primary Action</button>
					<button class="tp-btn-dark-outline" :style="{ borderColor: alt('500'), color: alt('300') }">Secondary</button>
				</div>
				<div class="tp-semantic-row">
					<span :style="{ color: sem('success') }">● Success</span>
					<span :style="{ color: sem('warning') }">● Warning</span>
					<span :style="{ color: sem('danger') }">● Danger</span>
					<span :style="{ color: sem('info') }">● Info</span>
				</div>
			</div>
		</div>

		<!-- COLOR PALETTE REFERENCE -->
		<div class="tp-card" :style="{ background: surfPanel, borderColor: alt('200') }">
			<h3 class="tp-section-title" :style="{ color: ink(8) }">Active Color Palette</h3>
			<div class="tp-palette-section">
				<p class="tp-palette-label" :style="{ color: ink(6) }">Primary</p>
				<div class="tp-swatch-row">
					<div v-for="s in shades" :key="'p'+s" class="tp-swatch" :style="{ background: pri(s) }">
						<span :style="{ color: parseInt(s) >= 500 ? '#fff' : alt('900') }">{{ s }}</span>
					</div>
				</div>
			</div>
			<div class="tp-palette-section tp-mt-12">
				<p class="tp-palette-label" :style="{ color: ink(6) }">Alternate</p>
				<div class="tp-swatch-row">
					<div v-for="s in shades" :key="'a'+s" class="tp-swatch" :style="{ background: alt(s) }">
						<span :style="{ color: parseInt(s) >= 500 ? '#fff' : alt('900') }">{{ s }}</span>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

// Frappe UI native defaults — synced from frappe/frappe-ui colors.json
// Run: node scripts/sync_frappe_defaults.js to refresh after Frappe version updates
const FRAPPE_DEFAULTS = {
	primary: {
		'50': '#F2F9FF', '100': '#E6F4FF', '200': '#C8E6FF', '300': '#A7D7FD',
		'400': '#73BBF6', '500': '#0289F7', '600': '#007BE0', '700': '#0070CC',
		'800': '#005CA3', '900': '#004880'
	},
	alternate: {
		'50': '#F8F8F8', '100': '#F3F3F3', '200': '#EDEDED', '300': '#E2E2E2',
		'400': '#C7C7C7', '500': '#999999', '600': '#7C7C7C', '700': '#525252',
		'800': '#383838', '900': '#171717'
	},
	fontFamily: ['InterVar', 'Inter', 'sans-serif'],
	semantic: { success: '#46B37E', warning: '#E79913', danger: '#E03636', info: '#0289F7' },
	surface: { page: '#F8F8F8', panel: '#FFFFFF' },
	button: { defaultShade: 500 }
};

const ICONS = {
	users: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
	chart: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z',
	dollar: 'M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
	clock: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
	check: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
	star: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
	bell: 'M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0',
	cog: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.431.992a7.723 7.723 0 0 1 0 .255c-.007.378.138.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z',
	envelope: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
};

const themeMode = ref('default');
const themes = ref([]);
const selectedThemeName = ref('');
const customTokens = ref(null);
const loading = ref(true);
const previewSource = ref('db'); // 'db' | 'editor'

const shades = ['50','100','200','300','400','500','600','700','800','900'];

const palette = computed(() => {
	if (themeMode.value === 'custom' && customTokens.value) {
		const t = customTokens.value;
		const colors = t.theme?.extend?.colors || {};
		return {
			primary: colors.primary || FRAPPE_DEFAULTS.primary,
			alternate: colors.alternate || FRAPPE_DEFAULTS.alternate,
			fontFamily: t.theme?.extend?.fontFamily?.ui || FRAPPE_DEFAULTS.fontFamily,
			fontWeight: t.theme?.extend?.fontWeight || 400,
			semantic: t.semantic || FRAPPE_DEFAULTS.semantic,
			surface: t.surface || FRAPPE_DEFAULTS.surface,
			button: t.button || FRAPPE_DEFAULTS.button
		};
	}
	return { ...FRAPPE_DEFAULTS, fontWeight: 400 };
});

const pri = (shade) => palette.value.primary[shade] || '#888';
const alt = (shade) => palette.value.alternate[shade] || '#888';
const sem = (key) => palette.value.semantic[key] || '#888';
const font = computed(() => palette.value.fontFamily.join(', '));
const surfPage = computed(() => palette.value.surface.page);
const surfPanel = computed(() => palette.value.surface.panel);
const btnWeight = computed(() => palette.value.fontWeight || 400);

// Ink: text colors sourced from theme tokens, falling back to alternate palette
function ink(level) {
	if (themeMode.value === 'custom' && customTokens.value?.ink) {
		const val = customTokens.value.ink['gray-' + level];
		if (val) return val;
	}
	return alt(INK_TO_SHADE[level] || '500');
}
const INK_TO_SHADE = { 1:'200', 2:'300', 3:'400', 4:'500', 5:'600', 6:'700', 7:'700', 8:'800', 9:'900' };

const inputStyle = computed(() => ({
	borderColor: alt('300'),
	color: ink(9),
	caretColor: pri('500'),
	'--ring-color': pri('400'),
	'--placeholder-color': ink(4)
}));

function badgeStyle(status) {
	if (status === 'Active') return { background: sem('success') + '1a', color: sem('success') };
	if (status === 'Pending') return { background: sem('warning') + '1a', color: sem('warning') };
	return { background: alt('200'), color: ink(5) };
}

const kpiCards = [
	{ label: 'Total Revenue', value: '$892,400', change: '+12.5%', positive: true, icon: 'dollar' },
	{ label: 'Active Users', value: '2,847', change: '+5.2%', positive: true, icon: 'users' },
	{ label: 'Open Tasks', value: '142', change: '-3.1%', positive: false, icon: 'clock' },
	{ label: 'Completion Rate', value: '94.2%', change: '+1.8%', positive: true, icon: 'chart' }
];

const tableData = [
	{ id: 1, name: 'Acme Corp', contact: 'John Doe', status: 'Active', revenue: '$124,500' },
	{ id: 2, name: 'Globex Inc', contact: 'Jane Smith', status: 'Pending', revenue: '$89,200' },
	{ id: 3, name: 'Initech LLC', contact: 'Bob Wilson', status: 'Active', revenue: '$215,800' },
	{ id: 4, name: 'Umbrella Co', contact: 'Alice Brown', status: 'Inactive', revenue: '$67,300' },
	{ id: 5, name: 'Stark Ind', contact: 'Tony Rogers', status: 'Active', revenue: '$312,000' },
	{ id: 6, name: 'Wayne Ent', contact: 'Bruce Kent', status: 'Pending', revenue: '$178,400' }
];

const typoScale = [
	{ label: '3xl (24px)', size: '24px', weight: 700, lh: '1.15' },
	{ label: '2xl (20px)', size: '20px', weight: 600, lh: '1.2' },
	{ label: 'xl (18px)', size: '18px', weight: 600, lh: '1.25' },
	{ label: 'lg (16px)', size: '16px', weight: 500, lh: '1.3' },
	{ label: 'base (14px)', size: '14px', weight: 420, lh: '1.4' },
	{ label: 'sm (13px)', size: '13px', weight: 420, lh: '1.4' },
	{ label: 'xs (12px)', size: '12px', weight: 420, lh: '1.5' },
	{ label: '2xs (11px)', size: '11px', weight: 420, lh: '1.5' }
];

const iconEntries = [
	{ icon: 'users', label: 'Users', shade: '600' },
	{ icon: 'chart', label: 'Analytics', shade: '500' },
	{ icon: 'dollar', label: 'Revenue', shade: '700' },
	{ icon: 'clock', label: 'Time', shade: '400' },
	{ icon: 'check', label: 'Complete', shade: '600' },
	{ icon: 'star', label: 'Starred', shade: '500' },
	{ icon: 'bell', label: 'Alerts', shade: '600' },
	{ icon: 'cog', label: 'Settings', shade: '500' },
	{ icon: 'envelope', label: 'Mail', shade: '700' }
];

const breakpoints = [
	{ label: 'sm', px: '640px', desc: 'Small tablets' },
	{ label: 'md', px: '768px', desc: 'Tablets' },
	{ label: 'lg', px: '1024px', desc: 'Laptops' },
	{ label: 'xl', px: '1280px', desc: 'Desktops' }
];

function toggleMode() {
	themeMode.value = themeMode.value === 'default' ? 'custom' : 'default';
}

function loadFromLocalStorage() {
	try {
		const raw = localStorage.getItem('nce_theme_preview');
		if (raw) {
			customTokens.value = JSON.parse(raw);
			previewSource.value = 'editor';
			themeMode.value = 'custom';
			return true;
		}
	} catch (e) {
		console.error('Failed to parse preview tokens from localStorage:', e);
	}
	return false;
}

function dismissPreview() {
	localStorage.removeItem('nce_theme_preview');
	previewSource.value = 'db';
	if (selectedThemeName.value) {
		loadThemeTokens(selectedThemeName.value);
	} else {
		customTokens.value = null;
		themeMode.value = 'default';
	}
}

function onStorageChange(e) {
	if (e.key !== 'nce_theme_preview') return;
	if (e.newValue) {
		try {
			customTokens.value = JSON.parse(e.newValue);
			previewSource.value = 'editor';
			themeMode.value = 'custom';
		} catch (_) {}
	} else {
		dismissPreview();
	}
}

function onFocusCheck() {
	if (previewSource.value === 'editor') {
		loadFromLocalStorage();
	}
}

async function fetchThemes() {
	try {
		const r = await frappe.call({
			method: 'frappe_theme_editor.frappe_theme_editor.doctype.theme.theme.get_all_themes',
			async: true
		});
		themes.value = r.message || [];
		if (themes.value.length > 0) {
			selectedThemeName.value = themes.value[0].name;
			// Only load DB tokens if we're NOT showing an editor preview
			if (previewSource.value !== 'editor') {
				await loadThemeTokens(themes.value[0].name);
			}
		}
	} catch (e) {
		console.error('Failed to fetch themes:', e);
	} finally {
		loading.value = false;
	}
}

async function loadThemeTokens(name) {
	try {
		const r = await frappe.call({
			method: 'frappe_theme_editor.frappe_theme_editor.doctype.theme.theme.get_theme',
			args: { name },
			async: true
		});
		const doc = r.message;
		if (doc && doc.vue_tokens) {
			customTokens.value = JSON.parse(doc.vue_tokens);
		} else {
			customTokens.value = null;
		}
	} catch (e) {
		console.error('Failed to load theme tokens:', e);
		customTokens.value = null;
	}
}

watch(selectedThemeName, async (name) => {
	if (name && previewSource.value !== 'editor') await loadThemeTokens(name);
});

onMounted(() => {
	window.addEventListener('storage', onStorageChange);
	window.addEventListener('focus', onFocusCheck);

	if (!loadFromLocalStorage()) {
		fetchThemes();
	} else {
		fetchThemes();
	}
});

onBeforeUnmount(() => {
	window.removeEventListener('storage', onStorageChange);
	window.removeEventListener('focus', onFocusCheck);
});
</script>

<style>
.tp-root { min-height: 100vh; transition: background 0.3s, color 0.3s; }
.tp-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; position: sticky; top: 0; z-index: 10; }
.tp-toolbar-left { display: flex; align-items: baseline; gap: 12px; }
.tp-toolbar-right { display: flex; align-items: center; gap: 12px; }
.tp-title { font-size: 18px; font-weight: 600; }
.tp-subtitle { font-size: 13px; }
.tp-select { padding: 6px 12px; border: 1px solid; border-radius: 8px; font-size: 13px; outline: none; cursor: pointer; }
.tp-toggle-btn { padding: 8px 16px; border: none; border-radius: 8px; font-size: 13px; cursor: pointer; transition: all 0.2s; }
.tp-toggle-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.tp-badge-preview { font-size: 11px; padding: 3px 10px; border-radius: 999px; font-weight: 600; white-space: nowrap; }
.tp-dismiss-btn { padding: 6px 14px; border: 1px solid; border-radius: 8px; font-size: 12px; cursor: pointer; background: transparent; transition: all 0.2s; }
.tp-dismiss-btn:hover { opacity: 0.7; }
.tp-loading { text-align: center; padding: 48px; font-size: 14px; }
.tp-content { padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 1200px; margin: 0 auto; }

.tp-header { border-radius: 12px; overflow: hidden; }
.tp-header-inner { padding: 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.tp-h1 { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.01em; margin: 0; }
.tp-header-sub { color: rgba(255,255,255,0.8); margin-top: 4px; font-size: 13px; }
.tp-header-nav { display: flex; gap: 20px; }
.tp-nav-item { font-size: 14px; cursor: pointer; color: rgba(255,255,255,0.7); }
.tp-nav-active { color: #fff !important; font-weight: 600; }

.tp-kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.tp-kpi-card { padding: 20px; border-radius: 12px; border: 1px solid; }
.tp-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; }
.tp-kpi-label { font-size: 13px; margin: 0; }
.tp-kpi-value { font-size: 24px; font-weight: 700; margin: 4px 0 0; }
.tp-kpi-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.tp-kpi-bottom { margin-top: 12px; }
.tp-kpi-change { font-size: 13px; font-weight: 500; }
.tp-kpi-vs { font-size: 13px; margin-left: 4px; }

.tp-two-col { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; }
@media (max-width: 840px) { .tp-two-col { grid-template-columns: 1fr; } }

.tp-table-wrapper { border-radius: 12px; border: 1px solid; overflow: hidden; }
.tp-section-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; }
.tp-section-title { font-size: 14px; font-weight: 600; margin: 0 0 16px; }
.tp-table-scroll { max-height: 320px; overflow-y: auto; }
.tp-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.tp-table th, .tp-table td { padding: 10px 20px; text-align: left; border-bottom: 1px solid; }
.tp-table th { font-weight: 600; letter-spacing: 0.02em; position: sticky; top: 0; }
.tp-td-bold { font-weight: 500; }
.text-right { text-align: right; }
.tp-sm-btn { padding: 4px 12px; border: 1px solid; border-radius: 6px; font-size: 13px; cursor: pointer; background: transparent; }
.tp-badge { padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; display: inline-block; }

.tp-form-wrapper { border-radius: 12px; border: 1px solid; padding: 20px; }
.tp-form-group { margin-bottom: 14px; display: flex; flex-direction: column; gap: 6px; }
.tp-label { font-size: 13px; font-weight: 500; }
.tp-input { padding: 8px 12px; border: 1px solid; border-radius: 8px; font-size: 14px; outline: none; transition: box-shadow 0.2s, border-color 0.2s; background: transparent; }
.tp-input::placeholder { color: var(--placeholder-color, #9CA3AF); }
.tp-input:focus { box-shadow: 0 0 0 3px var(--ring-color, #60A5FA40); border-color: var(--ring-color, #60A5FA); }
.tp-textarea { resize: vertical; min-height: 60px; }
.tp-form-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.tp-checkbox-label { display: flex; align-items: center; gap: 6px; font-size: 14px; cursor: pointer; }
.tp-checkbox-label input { width: 16px; height: 16px; cursor: pointer; }
.tp-btn-row { margin-top: 16px; display: flex; gap: 8px; }
.tp-btn-primary { padding: 8px 20px; border: none; border-radius: 8px; color: #fff; font-size: 13px; cursor: pointer; transition: opacity 0.2s; }
.tp-btn-primary:hover { opacity: 0.9; }
.tp-btn-outline { padding: 8px 20px; border: 1px solid; border-radius: 8px; background: transparent; font-size: 13px; cursor: pointer; }
.tp-btn-dark-outline { padding: 8px 20px; border: 1px solid; border-radius: 8px; background: transparent; font-size: 13px; cursor: pointer; }

.tp-card { border-radius: 12px; border: 1px solid; padding: 20px; }
.tp-typo-grid { display: flex; flex-direction: column; gap: 8px; }
.tp-typo-row { display: flex; align-items: baseline; gap: 16px; }
.tp-typo-label { min-width: 100px; flex-shrink: 0; font-size: 13px; }
.tp-typo-extras { margin-top: 16px; display: flex; flex-wrap: wrap; gap: 16px; align-items: baseline; font-size: 13px; }
.tp-decorated-link { text-decoration: underline; text-underline-offset: 3px; }

.tp-icons-row { display: flex; flex-wrap: wrap; gap: 24px; }
.tp-icon-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.tp-icon-label { font-size: 13px; }
.tp-filled-row { margin-top: 12px; display: flex; gap: 16px; align-items: center; font-size: 13px; }

.tp-gradient-strips { display: flex; flex-direction: column; gap: 8px; }
.tp-gradient-strip { padding: 14px 20px; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 500; }
.tp-opacity-row { margin-top: 12px; display: flex; gap: 8px; }
.tp-opacity-swatch { width: 56px; height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 11px; font-weight: 600; }

.tp-breakpoints { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px; }
.tp-bp-card { padding: 12px 16px; border: 1px solid; border-radius: 8px; display: flex; flex-direction: column; gap: 2px; min-width: 140px; font-size: 13px; }
.tp-bp-label { font-weight: 600; }
.tp-note { font-size: 13px; margin-top: 8px; }

.tp-dark-panel { padding: 24px; border-radius: 10px; border: 1px solid; }
.tp-dark-title { font-weight: 600; margin: 0; }
.tp-dark-desc { font-size: 13px; margin-top: 4px; }
.tp-dark-desc code { font-family: monospace; padding: 1px 4px; }
.tp-semantic-row { margin-top: 12px; display: flex; gap: 12px; font-size: 13px; }

.tp-palette-section { }
.tp-palette-label { font-size: 13px; font-weight: 500; margin-bottom: 8px; }
.tp-swatch-row { display: flex; gap: 4px; flex-wrap: wrap; }
.tp-swatch { width: 52px; height: 40px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; }
.tp-mt-12 { margin-top: 12px; }
</style>
