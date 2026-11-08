/**
 * Builds public/hyacinth-blabagno-resume.pdf from the same files the website uses:
 * site.json (name, role, contact), about.json (skills), experience.json, tools.json and resume.json.
 *
 * Run:  npm run resume
 * Needs Google Chrome installed (it prints the page to PDF). Set CHROME_PATH if Chrome lives elsewhere.
 *
 * If anything is still unconfirmed or a [PLACEHOLDER], the PDF is marked "DRAFT" in the footer
 * and the terminal lists what's left.
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => JSON.parse(readFileSync(join(root, 'src/data', f), 'utf8'));
const site = read('site.json');
const about = read('about.json');
const experience = read('experience.json');
const tools = read('tools.json');
const resume = read('resume.json');

const isPlaceholder = (v) => typeof v !== 'string' || v.trim() === '' || /^\[.*\]$/.test(v.trim());
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Collect anything that isn't ready yet
const pending = [];
if (!about.confirmed) pending.push('Skills/bio in about.json not confirmed');
if (!tools.confirmed) pending.push('Tools in tools.json not confirmed');
experience.roles.forEach((r) => {
  if (!r.confirmed) pending.push(`Role not confirmed: ${r.role}, ${r.company}`);
  if (isPlaceholder(r.dates)) pending.push(`Dates missing: ${r.company}`);
});
const draft = pending.length > 0;

const linkedin = site.socials.find((s) => s.label === 'LinkedIn' && !isPlaceholder(s.url));
const contact = [
  !isPlaceholder(site.email) && `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`,
  linkedin && `<a href="${esc(linkedin.url)}">${esc(linkedin.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a>`,
  `<a href="https://${esc(site.domain)}">${esc(site.domain)}</a>`,
  esc(site.location),
].filter(Boolean);

const toolName = (t) => (typeof t === 'string' ? t : t.name);

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(resume.fullName)} Resume</title>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Public+Sans:wght@400;600;700&display=block" rel="stylesheet">
<style>
  @page { size: Letter; margin: 0.55in 0.6in 0.6in; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 400 9.6pt/1.45 'Public Sans', Arial, sans-serif; color: #231815; }
  a { color: inherit; text-decoration: none; }
  header { border-bottom: 1.5px solid #6b2c2c; padding-bottom: 12pt; margin-bottom: 4pt; }
  h1 { font: 400 30pt/1 'Instrument Serif', Georgia, serif; margin: 0; letter-spacing: -0.01em; }
  h1 em { color: #6b2c2c; }
  .role { margin: 5pt 0 0; font-weight: 600; font-size: 8.6pt; letter-spacing: 0.1em; text-transform: uppercase; color: #8d4d3a; }
  .contact { margin: 7pt 0 0; display: flex; flex-wrap: wrap; gap: 2pt 14pt; color: #4a2e27; font-size: 8.8pt; }
  h2 { font: 400 15pt/1.1 'Instrument Serif', Georgia, serif; color: #6b2c2c; margin: 14pt 0 6pt; break-after: avoid; }
  p { margin: 0; }
  .skills { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3pt 14pt; margin: 0; padding: 0; list-style: none; }
  .skills li::before { content: ''; display: inline-block; width: 4pt; height: 4pt; border-radius: 50%; background: #79a3c3; margin-right: 6pt; vertical-align: 1.5pt; }
  .job { break-inside: avoid; padding: 6pt 0; border-top: 0.5pt solid #d8c3a5; display: grid; grid-template-columns: 1fr auto; column-gap: 12pt; }
  .job:first-of-type { border-top: 0; padding-top: 0; }
  .job h3 { margin: 0; font-size: 10pt; font-weight: 700; }
  .job .org { grid-column: 1; color: #4a2e27; }
  .job .dates { grid-column: 2; grid-row: 1; font-size: 8.4pt; font-weight: 600; color: #8d4d3a; white-space: nowrap; }
  .job ul { grid-column: 1 / -1; margin: 3pt 0 0; padding-left: 12pt; }
  .job li { margin-top: 1.5pt; }
  .missing { background: #fff3a8; padding: 0 3pt; color: #3d2b00; }
  .tools { display: grid; grid-template-columns: 12em 1fr; gap: 2pt 10pt; margin: 0; }
  .tools dt { font-weight: 600; }
  .tools dd { margin: 0; color: #4a2e27; }
  .edu { display: grid; grid-template-columns: 1fr auto; gap: 2pt 12pt; }
  .edu .d { font-size: 8.4pt; font-weight: 600; color: #8d4d3a; }
  .draft { margin: 0 0 10pt; padding: 5pt 8pt; background: #fff3a8; color: #3d2b00; font-weight: 600; font-size: 8.4pt; border: 1px dashed #8a6d00; }
</style></head>
<body>
${draft ? '<p class="draft">DRAFT: some details are still being confirmed. Not for sending yet.</p>' : ''}
<header>
  <h1>${esc(resume.fullName.split(' ').slice(0, -1).join(' '))} <em>${esc(resume.fullName.split(' ').slice(-1)[0])}</em></h1>
  <p class="role">${esc(site.role)}</p>
  <p class="contact">${contact.map((c) => `<span>${c}</span>`).join('')}</p>
</header>

<h2>Summary</h2>
<p>${esc(resume.summary)}</p>

<h2>Skills</h2>
<ul class="skills">${about.skills.map((s) => `<li>${esc(s.title.charAt(0).toUpperCase() + s.title.slice(1))}</li>`).join('')}</ul>

<h2>Experience</h2>
${experience.roles
  .map(
    (r) => `<section class="job">
  <h3>${esc(r.role)}</h3>
  <span class="dates">${isPlaceholder(r.dates) ? '<span class="missing">Dates to confirm</span>' : esc(r.dates)}</span>
  <p class="org">${esc(r.company)}${r.type ? ` · ${esc(r.type)}` : ''}</p>
  <ul>${r.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
</section>`,
  )
  .join('\n')}

<h2>Tools</h2>
<dl class="tools">${tools.groups.map((g) => `<dt>${esc(g.name)}</dt><dd>${g.tools.map(toolName).map(esc).join(', ')}</dd>`).join('')}</dl>

${
  resume.education?.length
    ? `<h2>Education</h2><div class="edu">${resume.education
        .map((e) => `<span><strong>${esc(e.school)}</strong>, ${esc(e.place)}</span><span class="d">${esc(e.dates)}</span>`)
        .join('')}</div>`
    : ''
}


</body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'resume-'));
const htmlPath = join(dir, 'resume.html');
writeFileSync(htmlPath, html);

const out = join(root, 'public', site.resumeFile.replace(/^\//, ''));
const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
execFileSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=8000',
  `--print-to-pdf=${out}`,
  pathToFileURL(htmlPath).href,
], { stdio: 'ignore' });

console.log(`Resume saved to ${out}`);
if (draft) {
  console.log(`\nMarked DRAFT. Still to confirm (${pending.length}):`);
  pending.forEach((p) => console.log(`  - ${p}`));
}
