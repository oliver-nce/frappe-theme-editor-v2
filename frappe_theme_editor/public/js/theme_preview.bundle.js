import { createApp, ref, reactive, computed, watch, onMounted } from 'vue';

// ─── Frappe UI default color palette (blue primary, gray alternate) ────────
const FRAPPE_DEFAULTS = {
	primary: {
		'50': '#EFF6FF', '100': '#DBEAFE', '200': '#BFDBFE', '300': '#93C5FD',
		'400': '#60A5FA', '500': '#3B82F6', '600': '#2563EB', '700': '#1D4ED8',
		'800': '#1E40AF', '900': '#1E3A8A'
	},
	alternate: {
		'50': '#F9FAFB', '100': '#F3F4F6', '200': '#E5E7EB', '300': '#D1D5DB',
		'400': '#9CA3AF', '500': '#6B7280', '600': '#4B5563', '700': '#374151',
		'800': '#1F2937', '900': '#111827'
	},
	fontFamily: ['Inter', 'sans-serif'],
	semantic: {
		success: '#22C55E', warning: '#F59E0B', danger: '#EF4444', info: '#3B82F6'
	},
	surface: { page: '#F9FAFB', panel: '#FFFFFF' },
	button: { defaultShade: 500, fontWeight: 600 }
};

// SVG icon paths used in the dashboard
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

const PreviewApp = {
	setup() {
		const themeMode = ref('default');
		const themes = ref([]);
		const selectedThemeName = ref('');
		const customTokens = ref(null);
		const loading = ref(true);

		const palette = computed(() => {
			if (themeMode.value === 'custom' && customTokens.value) {
				const t = customTokens.value;
				const colors = t.theme?.extend?.colors || {};
				return {
					primary: colors.primary || FRAPPE_DEFAULTS.primary,
					alternate: colors.alternate || FRAPPE_DEFAULTS.alternate,
					fontFamily: t.theme?.extend?.fontFamily?.ui || FRAPPE_DEFAULTS.fontFamily,
					semantic: t.semantic || FRAPPE_DEFAULTS.semantic,
					surface: t.surface || FRAPPE_DEFAULTS.surface,
					button: t.button || FRAPPE_DEFAULTS.button
				};
			}
			return FRAPPE_DEFAULTS;
		});

		const p = (shade) => computed(() => palette.value.primary[shade] || '#888');
		const a = (shade) => computed(() => palette.value.alternate[shade] || '#888');
		const sem = (key) => computed(() => palette.value.semantic[key] || '#888');
		const font = computed(() => palette.value.fontFamily.join(', '));
		const surfPage = computed(() => palette.value.surface.page);
		const surfPanel = computed(() => palette.value.surface.panel);
		const btnWeight = computed(() => palette.value.button.fontWeight || 600);

		async function fetchThemes() {
			try {
				const r = await frappe.call({
					method: 'frappe_theme_editor.frappe_theme_editor.doctype.theme.theme.get_all_themes',
					async: true
				});
				themes.value = r.message || [];
				if (themes.value.length > 0) {
					selectedThemeName.value = themes.value[0].name;
					await loadThemeTokens(themes.value[0].name);
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
			if (name) await loadThemeTokens(name);
		});

		onMounted(fetchThemes);

		const TABLE_DATA = [
			{ id: 1, name: 'Acme Corp', contact: 'John Doe', status: 'Active', revenue: '$124,500', date: '2026-03-01' },
			{ id: 2, name: 'Globex Inc', contact: 'Jane Smith', status: 'Pending', revenue: '$89,200', date: '2026-02-28' },
			{ id: 3, name: 'Initech LLC', contact: 'Bob Wilson', status: 'Active', revenue: '$215,800', date: '2026-02-15' },
			{ id: 4, name: 'Umbrella Co', contact: 'Alice Brown', status: 'Inactive', revenue: '$67,300', date: '2026-01-30' },
			{ id: 5, name: 'Stark Ind', contact: 'Tony Rogers', status: 'Active', revenue: '$312,000', date: '2026-03-10' },
			{ id: 6, name: 'Wayne Ent', contact: 'Bruce Kent', status: 'Pending', revenue: '$178,400', date: '2026-03-05' }
		];

		return {
			themeMode, themes, selectedThemeName, customTokens, loading,
			palette, p, a, sem, font, surfPage, surfPanel, btnWeight,
			TABLE_DATA, ICONS,
			toggleMode() {
				themeMode.value = themeMode.value === 'default' ? 'custom' : 'default';
			}
		};
	},

	template: /* html */`
<div class="tp-root" :style="{ fontFamily: font, background: surfPage }">

	<!-- ═══ TOOLBAR ═══ -->
	<div class="tp-toolbar" :style="{ background: surfPanel, borderBottom: '1px solid ' + a('200').value }">
		<div class="tp-toolbar-left">
			<h2 class="text-xl font-semibold" :style="{ color: a('900').value }">Theme Preview</h2>
			<span class="text-sm" :style="{ color: a('500').value }">
				{{ themeMode === 'default' ? 'Frappe Defaults' : 'Custom Theme' }}
			</span>
		</div>
		<div class="tp-toolbar-right">
			<select
				v-if="themes.length"
				v-model="selectedThemeName"
				class="tp-select"
				:style="{
					borderColor: a('300').value,
					color: a('700').value,
					background: surfPanel
				}"
			>
				<option v-for="t in themes" :key="t.name" :value="t.name">{{ t.theme_name }}</option>
			</select>
			<button
				class="tp-toggle-btn"
				:style="{
					background: themeMode === 'custom' ? p('600').value : a('200').value,
					color: themeMode === 'custom' ? '#fff' : a('700').value,
					fontWeight: btnWeight
				}"
				@click="toggleMode"
				:disabled="!customTokens"
			>
				{{ themeMode === 'default' ? 'Apply Custom Theme' : 'Show Defaults' }}
			</button>
		</div>
	</div>

	<div v-if="loading" class="tp-loading" :style="{ color: a('500').value }">Loading themes…</div>

	<div v-else class="tp-content">

		<!-- ═══ 1. GRADIENT HEADER ═══ -->
		<!-- Demonstrates: bg-{color}, from/via/to gradient, text-{color}, font-{weight}, text-{size}, font-family -->
		<div
			class="tp-header"
			:style="{
				background: 'linear-gradient(135deg, ' + p('600').value + ', ' + p('400').value + ', ' + p('700').value + ')'
			}"
		>
			<div class="tp-header-inner">
				<div>
					<h1 class="text-2xl font-bold" style="color:#fff; letter-spacing: -0.01em;">
						Business Dashboard
					</h1>
					<p style="color: rgba(255,255,255,0.8); margin-top:4px;" class="text-sm">
						Simulated layout showcasing all theme-controlled Tailwind styles
					</p>
				</div>
				<div class="tp-header-nav">
					<span class="tp-nav-item" style="color:rgba(255,255,255,0.7)">Reports</span>
					<span class="tp-nav-item" style="color:rgba(255,255,255,0.7)">Analytics</span>
					<span class="tp-nav-item tp-nav-active" style="color:#fff; font-weight:600">Dashboard</span>
				</div>
			</div>
		</div>

		<!-- ═══ 2. KPI CARDS ═══ -->
		<!-- Demonstrates: shadow, shadow-{color}, rounded, rounded-{side}, p-{}, m-{}, border-{color}, space-x -->
		<div class="tp-kpi-row">
			<div v-for="(card, i) in [
				{ label: 'Total Revenue', value: '$892,400', change: '+12.5%', positive: true, icon: 'dollar' },
				{ label: 'Active Users', value: '2,847', change: '+5.2%', positive: true, icon: 'users' },
				{ label: 'Open Tasks', value: '142', change: '-3.1%', positive: false, icon: 'clock' },
				{ label: 'Completion Rate', value: '94.2%', change: '+1.8%', positive: true, icon: 'chart' }
			]" :key="i"
				class="tp-kpi-card"
				:style="{
					background: surfPanel,
					borderColor: a('200').value,
					boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)'
				}"
			>
				<div class="tp-kpi-top">
					<div>
						<p class="text-sm" :style="{ color: a('500').value }">{{ card.label }}</p>
						<p class="text-2xl font-bold" :style="{ color: a('900').value }" style="margin-top:4px">{{ card.value }}</p>
					</div>
					<div class="tp-kpi-icon" :style="{ background: p('100').value }">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
							:stroke="p('600').value" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
							<path :d="ICONS[card.icon]" />
						</svg>
					</div>
				</div>
				<div class="tp-kpi-bottom" style="margin-top:12px">
					<span class="text-sm font-medium"
						:style="{ color: card.positive ? sem('success').value : sem('danger').value }">
						{{ card.change }}
					</span>
					<span class="text-sm" :style="{ color: a('400').value }" style="margin-left:4px">vs last month</span>
				</div>
			</div>
		</div>

		<div class="tp-two-col">
			<!-- ═══ 3. DATA TABLE ═══ -->
			<!-- Demonstrates: divide-{color}, text-opacity, bg-opacity, leading-{}, tracking-{}, w-{}, h-{}, min-w-{}, max-h-{} -->
			<div class="tp-table-wrapper"
				:style="{ background: surfPanel, borderColor: a('200').value }">
				<div class="tp-section-header">
					<h3 class="text-base font-semibold" :style="{ color: a('800').value }">Recent Accounts</h3>
					<button class="tp-sm-btn"
						:style="{ color: p('600').value, borderColor: p('200').value, background: p('50').value }">
						View All
					</button>
				</div>
				<div class="tp-table-scroll" :style="{ borderColor: a('200').value }">
					<table class="tp-table">
						<thead>
							<tr :style="{ background: a('50').value }">
								<th :style="{ color: a('600').value, borderColor: a('200').value }" class="text-sm">Company</th>
								<th :style="{ color: a('600').value, borderColor: a('200').value }" class="text-sm">Contact</th>
								<th :style="{ color: a('600').value, borderColor: a('200').value }" class="text-sm">Status</th>
								<th :style="{ color: a('600').value, borderColor: a('200').value }" class="text-sm" style="text-align:right">Revenue</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(row, idx) in TABLE_DATA" :key="row.id"
								:style="{
									background: idx % 2 === 1 ? a('50').value : 'transparent',
									borderColor: a('100').value
								}">
								<td class="text-sm font-medium" :style="{ color: a('900').value }">{{ row.name }}</td>
								<td class="text-sm" :style="{ color: a('500').value }">{{ row.contact }}</td>
								<td>
									<span class="tp-badge"
										:style="{
											background: row.status === 'Active' ? sem('success').value + '1a' : row.status === 'Pending' ? sem('warning').value + '1a' : a('200').value,
											color: row.status === 'Active' ? sem('success').value : row.status === 'Pending' ? sem('warning').value : a('500').value
										}">
										{{ row.status }}
									</span>
								</td>
								<td class="text-sm font-medium" :style="{ color: a('800').value }" style="text-align:right">{{ row.revenue }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<!-- ═══ 4. FORM SECTION ═══ -->
			<!-- Demonstrates: ring-{color}, outline-{color}, accent-{color}, caret-{color}, placeholder, italic -->
			<div class="tp-form-wrapper"
				:style="{ background: surfPanel, borderColor: a('200').value }">
				<h3 class="text-base font-semibold" :style="{ color: a('800').value }" style="margin-bottom:16px">
					Quick Entry Form
				</h3>
				<div class="tp-form-group">
					<label class="text-sm font-medium" :style="{ color: a('700').value }">Company Name</label>
					<input type="text" placeholder="Enter company name…"
						class="tp-input"
						:style="{
							borderColor: a('300').value,
							color: a('900').value,
							caretColor: p('500').value,
							'--ring-color': p('400').value,
							'--placeholder-color': a('400').value
						}" />
				</div>
				<div class="tp-form-group">
					<label class="text-sm font-medium" :style="{ color: a('700').value }">Description</label>
					<textarea placeholder="Brief description…" rows="3"
						class="tp-input tp-textarea"
						:style="{
							borderColor: a('300').value,
							color: a('900').value,
							caretColor: p('500').value,
							fontStyle: 'italic',
							'--ring-color': p('400').value,
							'--placeholder-color': a('400').value
						}"></textarea>
				</div>
				<div class="tp-form-row">
					<label class="tp-checkbox-label" :style="{ color: a('700').value }">
						<input type="checkbox" checked :style="{ accentColor: p('600').value }" />
						<span class="text-sm">Active account</span>
					</label>
					<label class="tp-checkbox-label" :style="{ color: a('700').value }">
						<input type="radio" name="priority" :style="{ accentColor: p('600').value }" checked />
						<span class="text-sm">High priority</span>
					</label>
					<label class="tp-checkbox-label" :style="{ color: a('700').value }">
						<input type="radio" name="priority" :style="{ accentColor: p('600').value }" />
						<span class="text-sm">Normal</span>
					</label>
				</div>
				<div style="margin-top:16px; display:flex; gap:8px">
					<button class="tp-btn-primary"
						:style="{ background: p('600').value, fontWeight: btnWeight }">
						Save Entry
					</button>
					<button class="tp-btn-outline"
						:style="{ borderColor: a('300').value, color: a('700').value }">
						Cancel
					</button>
				</div>
			</div>
		</div>

		<!-- ═══ 5. TYPOGRAPHY BLOCK ═══ -->
		<!-- Demonstrates: text-{size}, font-{weight}, leading-{}, tracking-{}, decoration-{color}, text-opacity -->
		<div class="tp-typo-block"
			:style="{ background: surfPanel, borderColor: a('200').value }">
			<h3 class="text-base font-semibold" :style="{ color: a('800').value }" style="margin-bottom:16px">
				Typography Scale
			</h3>
			<div class="tp-typo-grid">
				<div v-for="item in [
					{ label: '3xl (24px)', size: '24px', weight: 700, lh: '1.15' },
					{ label: '2xl (20px)', size: '20px', weight: 600, lh: '1.2' },
					{ label: 'xl (18px)', size: '18px', weight: 600, lh: '1.25' },
					{ label: 'lg (16px)', size: '16px', weight: 500, lh: '1.3' },
					{ label: 'base (14px)', size: '14px', weight: 420, lh: '1.4' },
					{ label: 'sm (13px)', size: '13px', weight: 420, lh: '1.4' },
					{ label: 'xs (12px)', size: '12px', weight: 420, lh: '1.5' },
					{ label: '2xs (11px)', size: '11px', weight: 420, lh: '1.5' }
				]" :key="item.label" class="tp-typo-row">
					<span class="tp-typo-label text-sm" :style="{ color: a('400').value }">{{ item.label }}</span>
					<span :style="{
						fontSize: item.size,
						fontWeight: item.weight,
						lineHeight: item.lh,
						color: a('900').value
					}">
						The quick brown fox jumps over the lazy dog
					</span>
				</div>
			</div>
			<div style="margin-top:16px; display:flex; flex-wrap:wrap; gap:16px; align-items:baseline">
				<span :style="{ color: a('700').value, letterSpacing: '-0.025em' }" class="text-sm">Tight tracking</span>
				<span :style="{ color: a('700').value, letterSpacing: '0.05em' }" class="text-sm">Wide tracking</span>
				<span :style="{ color: a('700').value, letterSpacing: '0.1em', textTransform: 'uppercase' }" class="text-sm">Widest + uppercase</span>
				<a href="#" :style="{ color: p('600').value, textDecorationColor: p('300').value }" style="text-decoration:underline; text-underline-offset:3px" class="text-sm">
					Decorated link
				</a>
				<span :style="{ color: a('500').value, opacity: 0.5 }" class="text-sm">50% text opacity</span>
			</div>
		</div>

		<!-- ═══ 6. SVG ICONS ROW ═══ -->
		<!-- Demonstrates: fill-current, fill-{color}, stroke-current, stroke-{color} -->
		<div class="tp-icons-block"
			:style="{ background: surfPanel, borderColor: a('200').value }">
			<h3 class="text-base font-semibold" :style="{ color: a('800').value }" style="margin-bottom:16px">
				SVG Icons (fill &amp; stroke)
			</h3>
			<div class="tp-icons-row">
				<div v-for="(entry, i) in [
					{ icon: 'users', label: 'Users', shade: '600' },
					{ icon: 'chart', label: 'Analytics', shade: '500' },
					{ icon: 'dollar', label: 'Revenue', shade: '700' },
					{ icon: 'clock', label: 'Time', shade: '400' },
					{ icon: 'check', label: 'Complete', shade: '600' },
					{ icon: 'star', label: 'Starred', shade: '500' },
					{ icon: 'bell', label: 'Alerts', shade: '600' },
					{ icon: 'cog', label: 'Settings', shade: '500' },
					{ icon: 'envelope', label: 'Mail', shade: '700' }
				]" :key="i" class="tp-icon-item">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
						:stroke="p(entry.shade).value" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
						<path :d="ICONS[entry.icon]" />
					</svg>
					<span class="text-sm" :style="{ color: a('600').value }">{{ entry.label }}</span>
				</div>
			</div>
			<div style="margin-top:12px; display:flex; gap:16px; align-items:center">
				<span class="text-sm" :style="{ color: a('500').value }">Filled variant:</span>
				<svg width="24" height="24" viewBox="0 0 24 24" :fill="p('500').value" stroke="none">
					<path :d="ICONS.star" />
				</svg>
				<svg width="24" height="24" viewBox="0 0 24 24" :fill="sem('success').value" stroke="none">
					<path :d="ICONS.check" />
				</svg>
				<svg width="24" height="24" viewBox="0 0 24 24" :fill="sem('danger').value" stroke="none">
					<path :d="ICONS.bell" />
				</svg>
			</div>
		</div>

		<!-- ═══ 7. GRADIENT SHOWCASE ═══ -->
		<!-- Demonstrates: from-{color}, via-{color}, to-{color}, bg-opacity -->
		<div class="tp-gradient-block"
			:style="{ background: surfPanel, borderColor: a('200').value }">
			<h3 class="text-base font-semibold" :style="{ color: a('800').value }" style="margin-bottom:16px">
				Gradient &amp; Opacity
			</h3>
			<div class="tp-gradient-strips">
				<div class="tp-gradient-strip"
					:style="{ background: 'linear-gradient(to right, ' + p('400').value + ', ' + p('600').value + ', ' + p('800').value + ')' }">
					<span>Primary gradient (from → via → to)</span>
				</div>
				<div class="tp-gradient-strip"
					:style="{ background: 'linear-gradient(to right, ' + p('500').value + ', ' + a('500').value + ')' }">
					<span>Primary → Alternate blend</span>
				</div>
				<div class="tp-gradient-strip"
					:style="{ background: 'linear-gradient(135deg, ' + sem('success').value + ', ' + sem('info').value + ')' }">
					<span>Semantic: Success → Info</span>
				</div>
			</div>
			<div style="margin-top:12px; display:flex; gap:8px">
				<div v-for="opacity in [100, 75, 50, 25, 10]" :key="opacity"
					class="tp-opacity-swatch"
					:style="{ background: p('600').value, opacity: opacity / 100 }">
					{{ opacity }}%
				</div>
			</div>
		</div>

		<!-- ═══ 8. RESPONSIVE BREAKPOINTS ═══ -->
		<!-- Demonstrates: sm:/md:/lg:/xl: modifiers -->
		<div class="tp-responsive-block"
			:style="{ background: surfPanel, borderColor: a('200').value }">
			<h3 class="text-base font-semibold" :style="{ color: a('800').value }" style="margin-bottom:12px">
				Responsive Breakpoints (Frappe UI)
			</h3>
			<div class="tp-breakpoints">
				<div v-for="bp in [
					{ label: 'sm', px: '640px', desc: 'Small tablets' },
					{ label: 'md', px: '768px', desc: 'Tablets' },
					{ label: 'lg', px: '1024px', desc: 'Laptops' },
					{ label: 'xl', px: '1280px', desc: 'Desktops' }
				]" :key="bp.label" class="tp-bp-card"
					:style="{ borderColor: p('200').value, background: p('50').value }">
					<span class="font-semibold" :style="{ color: p('700').value }">{{ bp.label }}:</span>
					<span class="text-sm" :style="{ color: a('600').value }">≥ {{ bp.px }}</span>
					<span class="text-sm" :style="{ color: a('400').value }">{{ bp.desc }}</span>
				</div>
			</div>
			<p class="text-sm" :style="{ color: a('400').value }" style="margin-top:8px">
				Note: Frappe UI removes the 2xl (1536px) breakpoint. Mobile-first design: base styles apply to all, add sm:/md:/lg:/xl: prefixes for larger screens.
			</p>
		</div>

		<!-- ═══ 9. DARK MODE PANEL ═══ -->
		<!-- Demonstrates: dark: modifier, data-theme="dark" -->
		<div class="tp-dark-block"
			:style="{ background: surfPanel, borderColor: a('200').value }">
			<h3 class="text-base font-semibold" :style="{ color: a('800').value }" style="margin-bottom:12px">
				Dark Mode Preview
			</h3>
			<div class="tp-dark-panel" data-theme="dark"
				:style="{ background: a('900').value, borderColor: a('700').value }">
				<p :style="{ color: '#F9FAFB' }" class="font-semibold">Dark surface</p>
				<p :style="{ color: a('300').value }" class="text-sm" style="margin-top:4px">
					In Frappe UI, dark mode uses <code :style="{ color: p('300').value }">[data-theme="dark"]</code> selector instead of media query.
				</p>
				<div style="margin-top:12px; display:flex; gap:8px">
					<button class="tp-btn-primary" :style="{ background: p('500').value, fontWeight: btnWeight }">
						Primary Action
					</button>
					<button class="tp-btn-dark-outline" :style="{ borderColor: a('500').value, color: a('300').value }">
						Secondary
					</button>
				</div>
				<div style="margin-top:12px; display:flex; gap:12px">
					<span :style="{ color: sem('success').value }" class="text-sm">● Success</span>
					<span :style="{ color: sem('warning').value }" class="text-sm">● Warning</span>
					<span :style="{ color: sem('danger').value }" class="text-sm">● Danger</span>
					<span :style="{ color: sem('info').value }" class="text-sm">● Info</span>
				</div>
			</div>
		</div>

		<!-- ═══ COLOR PALETTE REFERENCE ═══ -->
		<div class="tp-palette-block"
			:style="{ background: surfPanel, borderColor: a('200').value }">
			<h3 class="text-base font-semibold" :style="{ color: a('800').value }" style="margin-bottom:16px">
				Active Color Palette
			</h3>
			<div class="tp-palette-section">
				<p class="text-sm font-medium" :style="{ color: a('600').value }" style="margin-bottom:8px">Primary</p>
				<div class="tp-swatch-row">
					<div v-for="shade in ['50','100','200','300','400','500','600','700','800','900']" :key="'p'+shade"
						class="tp-swatch"
						:style="{ background: p(shade).value }">
						<span :style="{ color: parseInt(shade) >= 500 ? '#fff' : a('900').value }">{{ shade }}</span>
					</div>
				</div>
			</div>
			<div class="tp-palette-section" style="margin-top:12px">
				<p class="text-sm font-medium" :style="{ color: a('600').value }" style="margin-bottom:8px">Alternate</p>
				<div class="tp-swatch-row">
					<div v-for="shade in ['50','100','200','300','400','500','600','700','800','900']" :key="'a'+shade"
						class="tp-swatch"
						:style="{ background: a(shade).value }">
						<span :style="{ color: parseInt(shade) >= 500 ? '#fff' : a('900').value }">{{ shade }}</span>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>
`
};

// ─── Scoped styles (injected once) ──────────────────────────────────────────
const STYLES = `
.tp-root {
	min-height: 100vh;
	transition: background 0.3s, color 0.3s;
}
.tp-toolbar {
	display: flex; align-items: center; justify-content: space-between;
	padding: 12px 24px; position: sticky; top: 0; z-index: 10;
}
.tp-toolbar-left { display: flex; align-items: baseline; gap: 12px; }
.tp-toolbar-right { display: flex; align-items: center; gap: 12px; }
.tp-select {
	padding: 6px 12px; border: 1px solid; border-radius: 8px;
	font-size: 13px; outline: none; cursor: pointer;
}
.tp-toggle-btn {
	padding: 8px 16px; border: none; border-radius: 8px;
	font-size: 13px; cursor: pointer; transition: all 0.2s;
}
.tp-toggle-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.tp-loading { text-align: center; padding: 48px; font-size: 14px; }
.tp-content { padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 1200px; margin: 0 auto; }

/* Header */
.tp-header { border-radius: 12px; overflow: hidden; }
.tp-header-inner { padding: 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.tp-header-nav { display: flex; gap: 20px; }
.tp-nav-item { font-size: 14px; cursor: pointer; }

/* KPI cards */
.tp-kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
.tp-kpi-card { padding: 20px; border-radius: 12px; border: 1px solid; }
.tp-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; }
.tp-kpi-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }

/* Two-col layout */
.tp-two-col { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; }
@media (max-width: 840px) { .tp-two-col { grid-template-columns: 1fr; } }

/* Table */
.tp-table-wrapper { border-radius: 12px; border: 1px solid; overflow: hidden; }
.tp-section-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; }
.tp-table-scroll { max-height: 320px; overflow-y: auto; }
.tp-table { width: 100%; border-collapse: collapse; }
.tp-table th, .tp-table td { padding: 10px 20px; text-align: left; border-bottom: 1px solid; }
.tp-table th { font-weight: 600; letter-spacing: 0.02em; position: sticky; top: 0; }
.tp-sm-btn { padding: 4px 12px; border: 1px solid; border-radius: 6px; font-size: 13px; cursor: pointer; }
.tp-badge { padding: 2px 10px; border-radius: 9999px; font-size: 12px; font-weight: 500; }

/* Form */
.tp-form-wrapper { border-radius: 12px; border: 1px solid; padding: 20px; }
.tp-form-group { margin-bottom: 14px; display: flex; flex-direction: column; gap: 6px; }
.tp-input {
	padding: 8px 12px; border: 1px solid; border-radius: 8px; font-size: 14px; outline: none;
	transition: box-shadow 0.2s, border-color 0.2s;
}
.tp-input::placeholder { color: var(--placeholder-color, #9CA3AF); }
.tp-input:focus { box-shadow: 0 0 0 3px var(--ring-color, #60A5FA40); border-color: var(--ring-color, #60A5FA); }
.tp-textarea { resize: vertical; min-height: 60px; }
.tp-form-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; }
.tp-checkbox-label { display: flex; align-items: center; gap: 6px; font-size: 14px; cursor: pointer; }
.tp-checkbox-label input { width: 16px; height: 16px; cursor: pointer; }
.tp-btn-primary {
	padding: 8px 20px; border: none; border-radius: 8px; color: #fff;
	font-size: 13px; cursor: pointer; transition: opacity 0.2s;
}
.tp-btn-primary:hover { opacity: 0.9; }
.tp-btn-outline {
	padding: 8px 20px; border: 1px solid; border-radius: 8px; background: transparent;
	font-size: 13px; cursor: pointer;
}
.tp-btn-dark-outline {
	padding: 8px 20px; border: 1px solid; border-radius: 8px; background: transparent;
	font-size: 13px; cursor: pointer;
}

/* Typography */
.tp-typo-block { border-radius: 12px; border: 1px solid; padding: 20px; }
.tp-typo-grid { display: flex; flex-direction: column; gap: 8px; }
.tp-typo-row { display: flex; align-items: baseline; gap: 16px; }
.tp-typo-label { min-width: 100px; flex-shrink: 0; }

/* Icons */
.tp-icons-block { border-radius: 12px; border: 1px solid; padding: 20px; }
.tp-icons-row { display: flex; flex-wrap: wrap; gap: 24px; }
.tp-icon-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }

/* Gradients */
.tp-gradient-block { border-radius: 12px; border: 1px solid; padding: 20px; }
.tp-gradient-strips { display: flex; flex-direction: column; gap: 8px; }
.tp-gradient-strip {
	padding: 14px 20px; border-radius: 8px; color: #fff; font-size: 13px; font-weight: 500;
}
.tp-opacity-swatch {
	width: 56px; height: 36px; border-radius: 6px; display: flex; align-items: center;
	justify-content: center; color: #fff; font-size: 11px; font-weight: 600;
}

/* Responsive */
.tp-responsive-block { border-radius: 12px; border: 1px solid; padding: 20px; }
.tp-breakpoints { display: flex; flex-wrap: wrap; gap: 12px; }
.tp-bp-card {
	padding: 12px 16px; border: 1px solid; border-radius: 8px;
	display: flex; flex-direction: column; gap: 2px; min-width: 140px;
}

/* Dark mode */
.tp-dark-block { border-radius: 12px; border: 1px solid; padding: 20px; }
.tp-dark-panel { padding: 24px; border-radius: 10px; border: 1px solid; }

/* Palette */
.tp-palette-block { border-radius: 12px; border: 1px solid; padding: 20px; }
.tp-swatch-row { display: flex; gap: 4px; flex-wrap: wrap; }
.tp-swatch {
	width: 52px; height: 40px; border-radius: 6px; display: flex; align-items: center;
	justify-content: center; font-size: 11px; font-weight: 500;
}
`;

// ─── Mount logic (called by page loader via frappe.require callback) ────────
frappe.theme_preview = {
	mount(page) {
		const style = document.createElement('style');
		style.textContent = STYLES;
		document.head.appendChild(style);

		const mountEl = document.createElement('div');
		mountEl.id = 'theme-preview-app';
		page.main.html('').append(mountEl);

		createApp(PreviewApp).mount(mountEl);
	}
};
