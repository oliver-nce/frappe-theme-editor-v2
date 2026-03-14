#!/usr/bin/env node
/**
 * Fetches Frappe UI's native color palette from GitHub and outputs the
 * FRAPPE_DEFAULTS block for App.vue. Run after Frappe UI version updates:
 *
 *   node scripts/sync_frappe_defaults.js          # print block to stdout
 *   node scripts/sync_frappe_defaults.js --write   # patch App.vue in-place
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const COLORS_URL =
  'https://raw.githubusercontent.com/frappe/frappe-ui/main/tailwind/colors.json';

const APP_VUE_PATH = path.resolve(
  __dirname,
  '../frappe_theme_editor/public/js/theme_preview/App.vue'
);

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(JSON.parse(data)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

function pick10(obj) {
  const shades = ['50','100','200','300','400','500','600','700','800','900'];
  const out = {};
  for (const s of shades) {
    if (obj[s]) out[s] = obj[s];
  }
  return out;
}

function formatShades(obj) {
  return Object.entries(obj)
    .map(function (e) { return "'" + e[0] + "': '" + e[1] + "'"; })
    .join(', ');
}

async function main() {
  const autoWrite = process.argv.includes('--write');

  console.log('Fetching Frappe UI colors.json from GitHub...');
  const data = await fetchJSON(COLORS_URL);

  const blue = pick10(data.lightMode.blue);
  const gray = pick10(data.lightMode.gray);
  const green = data.lightMode.green;
  const red = data.lightMode.red;
  const amber = data.lightMode.amber;

  const block = [
    '// Frappe UI native defaults — synced from frappe/frappe-ui colors.json',
    '// Run: node scripts/sync_frappe_defaults.js to refresh after Frappe version updates',
    'const FRAPPE_DEFAULTS = {',
    '\tprimary: {',
    '\t\t' + formatShades(blue),
    '\t},',
    '\talternate: {',
    '\t\t' + formatShades(gray),
    '\t},',
    "\tfontFamily: ['InterVar', 'Inter', 'sans-serif'],",
    "\tsemantic: { success: '" + green['500'] + "', warning: '" + amber['500'] + "', danger: '" + red['500'] + "', info: '" + blue['500'] + "' },",
    "\tsurface: { page: '" + gray['50'] + "', panel: '#FFFFFF' },",
    '\tbutton: { defaultShade: 500, fontWeight: 600 }',
    '};',
  ].join('\n');

  console.log('\n--- Updated FRAPPE_DEFAULTS block ---\n');
  console.log(block);
  console.log('\n--- end ---\n');

  if (autoWrite) {
    console.log('Patching ' + APP_VUE_PATH + '...');
    var src = fs.readFileSync(APP_VUE_PATH, 'utf-8');

    var startMarker = '// Frappe UI native defaults';
    var endMarker = '};';
    var startIdx = src.indexOf(startMarker);
    if (startIdx === -1) {
      console.error('Could not find FRAPPE_DEFAULTS marker in App.vue');
      process.exit(1);
    }
    var searchFrom = src.indexOf('const FRAPPE_DEFAULTS', startIdx);
    var endIdx = src.indexOf(endMarker, searchFrom) + endMarker.length;

    src = src.slice(0, startIdx) + block + src.slice(endIdx);
    fs.writeFileSync(APP_VUE_PATH, src, 'utf-8');
    console.log('Done! Rebuild: cd frappe_theme_editor/public/js/theme_preview && npm run build');
  } else {
    console.log('Tip: run with --write to auto-patch App.vue');
  }
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
