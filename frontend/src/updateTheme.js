const fs = require('fs');
let css = fs.readFileSync('c:/Users/abhil/OneDrive/Desktop/ai-dashboard-generator/frontend/src/index.css', 'utf-8');

// Replace Root Tokens
css = css.replace(/--sidebar-bg:\s*#1a1d2e;/g, '--sidebar-bg: #fdfdfd;');
css = css.replace(/--sidebar-border:\s*rgba\(255,255,255,0\.06\);/g, '--sidebar-border: #eaeaea;');
css = css.replace(/--sidebar-active:\s*rgba\(99,102,241,0\.18\);/g, '--sidebar-active: #f1f1f1;');
css = css.replace(/--sidebar-hover:\s*rgba\(255,255,255,0\.06\);/g, '--sidebar-hover: #fafafa;');
css = css.replace(/--sidebar-active-text:\s*#e2e8f0;/g, '--sidebar-active-text: #0f172a;');
css = css.replace(/--main-bg:\s*#f1f4f9;/g, '--main-bg: #ffffff;');
css = css.replace(/--accent:\s*#4f46e5;/g, '--accent: #0f172a;');
css = css.replace(/--accent-light:\s*#eef2ff;/g, '--accent-light: #f8fafc;');
css = css.replace(/--accent-mid:\s*rgba\(79,70,229,0\.15\);/g, '--accent-mid: rgba(0,0,0,0.05);');

// Change Amber (Orange) to grayscale
css = css.replace(/--amber:\s*#f59e0b;/g, '--amber: #9ca3af;');
css = css.replace(/--amber-light:\s*#fffbeb;/g, '--amber-light: #f3f4f6;');
css = css.replace(/background:\s*#ffbd2e;/g, 'background: #9ca3af;');

// Fix Sidebar specific manual text colors
css = css.replace(/\.sidebar-logo-name {\s*font-size: 15px;\s*font-weight: 700;\s*color: #fff;/g, '.sidebar-logo-name {\n  font-size: 15px;\n  font-weight: 700;\n  color: #0f172a;');
css = css.replace(/color: #e2e8f0;/g, 'color: #0f172a;');

// LP Root and Nav replacing dark theme with light
css = css.replace(/\.lp-root {\n\s*min-height: 100vh;\n\s*background: #060b18;\n\s*color: #e2e8f0;/gi, '.lp-root {\n  min-height: 100vh;\n  background: #ffffff;\n  color: #0f172a;');
css = css.replace(/background: rgba\(6,11,24,0\.82\);/g, 'background: rgba(255,255,255,0.95);');
css = css.replace(/color: #fff;/g, 'color: #0f172a;');
css = css.replace(/background: linear-gradient\(135deg, #4f46e5 0%, #7c3aed 100%\);/g, 'background: #0f172a;');
css = css.replace(/background: linear-gradient\(135deg, #4f46e5, #7c3aed\);/g, 'background: #0f172a;');
css = css.replace(/linear-gradient\(90deg, #818cf8, #a78bfa, #38bdf8\)/g, 'linear-gradient(90deg, #334155, #0f172a)');
css = css.replace(/rgba\(15,23,42,0\.85\)/g, 'rgba(255,255,255,0.95)');
css = css.replace(/color: #f1f5f9;/g, 'color: #0f172a;');
css = css.replace(/rgba\(255,255,255,0\.03\)/g, 'rgba(0,0,0,0.02)');
css = css.replace(/rgba\(255,255,255,0\.06\)/g, 'rgba(0,0,0,0.06)');
css = css.replace(/rgba\(255,255,255,0\.08\)/g, 'rgba(0,0,0,0.08)');
css = css.replace(/background: rgba\(15,23,42,0\.9\);/g, 'background: rgba(255,255,255,0.95);');
css = css.replace(/background: rgba\(15,23,42,1\);/g, 'background: #ffffff;');
css = css.replace(/rgba\(99,102,241,0\.35\)/g, 'rgba(0,0,0,0.15)');
css = css.replace(/rgba\(99,102,241,0\.18\)/g, 'rgba(0,0,0,0.05)');
css = css.replace(/rgba\(99,102,241,0\.14\)/g, 'rgba(0,0,0,0.04)');
css = css.replace(/rgba\(99,102,241,0\.15\)/g, 'rgba(0,0,0,0.05)');
css = css.replace(/rgba\(99,102,241,0\.12\)/g, 'rgba(0,0,0,0.04)');
css = css.replace(/rgba\(99,102,241,0\.1\)/g, 'rgba(0,0,0,0.03)');
css = css.replace(/rgba\(16,185,129,0\.12\)/g, 'rgba(0,0,0,0.04)'); /* green to gray */
css = css.replace(/rgba\(59,130,246,0\.12\)/g, 'rgba(0,0,0,0.04)'); /* blue to gray */
css = css.replace(/rgba\(245,158,11,0\.12\)/g, 'rgba(0,0,0,0.04)'); /* orange to gray */
css = css.replace(/color: #818cf8;/g, 'color: #0f172a;');
css = css.replace(/color: #a5b4fc;/g, 'color: #475569;');
css = css.replace(/background: linear-gradient\(135deg, #818cf8, #38bdf8\);/g, 'background: #0f172a;');
css = css.replace(/background: linear-gradient\(180deg, #818cf8, #4f46e5\);/g, 'background: linear-gradient(180deg, #64748b, #0f172a);');
css = css.replace(/background: conic-gradient\(#4f46e5 0% 40%, #7c3aed 40% 65%, #38bdf8 65% 100%\);/g, 'background: conic-gradient(#0f172a 0% 40%, #475569 40% 65%, #94a3b8 65% 100%);');
css = css.replace(/rgba\(99,102,241,0\.2\)/g, 'rgba(0,0,0,0.1)');
css = css.replace(/rgba\(0,0,0,0\.6\)/g, 'rgba(0,0,0,0.15)');
css = css.replace(/linear-gradient\(90deg, #4f46e5, #38bdf8\)/g, 'linear-gradient(90deg, #475569, #0f172a)');
css = css.replace(/linear-gradient\(90deg, #4f46e5, #7c3aed\)/g, 'linear-gradient(90deg, #475569, #0f172a)');


fs.writeFileSync('c:/Users/abhil/OneDrive/Desktop/ai-dashboard-generator/frontend/src/index.css', css, 'utf-8');
console.log('Update finished');
