/**
 * 生成站点静态资源（社交分享图 / 文章封面）。favicon 见 public/brand/。
 * 仅在需要调整视觉时手动运行：node scripts/gen-assets.mjs
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'public');

/* ---------------- 封面模板 ---------------- */
const covers = [
  { name: 'cover-1', a: '#6366f1', b: '#8b5cf6', c: '#22d3ee', bg: '#0b1220' },
  { name: 'cover-2', a: '#10b981', b: '#06b6d4', c: '#a3e635', bg: '#06231f' },
  { name: 'cover-3', a: '#f59e0b', b: '#f43f5e', c: '#d946ef', bg: '#2a0f1a' },
  { name: 'cover-4', a: '#60a5fa', b: '#6366f1', c: '#a78bfa', bg: '#0a1024' },
  { name: 'cover-5', a: '#f472b6', b: '#fb7185', c: '#fbbf24', bg: '#26101c' },
  { name: 'cover-6', a: '#2dd4bf', b: '#38bdf8', c: '#818cf8', bg: '#08202c' },
];

const coverSvg = ({ a, b, c, bg }) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg}"/>
      <stop offset="1" stop-color="#05070d"/>
    </linearGradient>
    <radialGradient id="b1" cx="0.16" cy="0.14" r="0.75">
      <stop offset="0" stop-color="${a}" stop-opacity="0.95"/>
      <stop offset="1" stop-color="${a}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b2" cx="0.88" cy="0.08" r="0.7">
      <stop offset="0" stop-color="${c}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${c}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b3" cx="0.62" cy="1.05" r="0.8">
      <stop offset="0" stop-color="${b}" stop-opacity="0.85"/>
      <stop offset="1" stop-color="${b}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="line" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.05"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="38"/></filter>
  </defs>

  <rect width="1200" height="675" fill="url(#base)"/>
  <g filter="url(#blur)">
    <rect x="-180" y="-160" width="760" height="620" fill="url(#b1)"/>
    <rect x="640" y="-200" width="820" height="620" fill="url(#b2)"/>
    <rect x="300" y="330" width="900" height="620" fill="url(#b3)"/>
  </g>

  <g stroke="#ffffff" stroke-opacity="0.08" stroke-width="1">
    ${Array.from({ length: 11 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="675"/>`).join('')}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 110}" x2="1200" y2="${i * 110}"/>`).join('')}
  </g>

  <g fill="none" stroke="url(#line)" stroke-width="2.5" stroke-linecap="round">
    <circle cx="905" cy="215" r="118" stroke-opacity="0.5"/>
    <circle cx="905" cy="215" r="72" stroke-opacity="0.3"/>
    <path d="M120 545 Q 330 430 520 512 T 900 470" stroke-opacity="0.55"/>
    <path d="M120 590 Q 350 480 540 556 T 930 520" stroke-opacity="0.28"/>
  </g>

  <g fill="#ffffff" fill-opacity="0.9">
    <circle cx="120" cy="545" r="7"/>
    <circle cx="520" cy="512" r="7"/>
    <circle cx="900" cy="470" r="7"/>
  </g>

  <g fill="none" stroke="#ffffff" stroke-opacity="0.55" stroke-width="2.5">
    <rect x="470" y="235" width="260" height="205" rx="26" stroke-opacity="0.35"/>
    <path d="M470 315 H730" stroke-opacity="0.22"/>
    <path d="M560 235 V440" stroke-opacity="0.22"/>
  </g>
  <g fill="#ffffff">
    <circle cx="600" cy="337" r="10" fill-opacity="0.95"/>
    <circle cx="470" cy="235" r="7" fill-opacity="0.7"/>
    <circle cx="730" cy="440" r="7" fill-opacity="0.7"/>
  </g>
</svg>`;

/* ---------------- 社交分享图（含文字，转成 PNG） ---------------- */
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0b1220"/>
      <stop offset="1" stop-color="#05070d"/>
    </linearGradient>
    <radialGradient id="g1" cx="0.12" cy="0.1" r="0.8">
      <stop offset="0" stop-color="#6366f1" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="0.9" cy="0.05" r="0.75">
      <stop offset="0" stop-color="#22d3ee" stop-opacity="0.8"/>
      <stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g3" cx="0.65" cy="1.08" r="0.8">
      <stop offset="0" stop-color="#8b5cf6" stop-opacity="0.85"/>
      <stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <filter id="b"><feGaussianBlur stdDeviation="46"/></filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <g filter="url(#b)">
    <ellipse cx="180" cy="120" rx="520" ry="380" fill="url(#g1)"/>
    <ellipse cx="1050" cy="80" rx="500" ry="360" fill="url(#g2)"/>
    <ellipse cx="820" cy="640" rx="560" ry="380" fill="url(#g3)"/>
  </g>
  <g stroke="#ffffff" stroke-opacity="0.07" stroke-width="1">
    ${Array.from({ length: 11 }, (_, i) => `<line x1="${i * 120}" y1="0" x2="${i * 120}" y2="630"/>`).join('')}
  </g>


  <text x="96" y="330" font-family="Helvetica, Arial, sans-serif" font-size="86" font-weight="700" fill="#ffffff" letter-spacing="-2">AI Bit</text>
  <text x="96" y="392" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#ffffff" fill-opacity="0.62">记录关于 AI、工程与产品的思考碎片</text>

  <rect x="96" y="446" width="300" height="6" rx="3" fill="#ffffff" fill-opacity="0.28"/>
</svg>`;

await mkdir(path.join(pub, 'images'), { recursive: true });
// favicon 现在由 public/brand/ 下的品牌 logo 生成，不再用脚本里的占位图形
await writeFile(path.join(pub, 'og-default.svg'), og);

for (const c of covers) {
  await writeFile(path.join(pub, 'images', `${c.name}.svg`), coverSvg(c));
}

// 社交平台不支持 SVG，导出一张 PNG 作为分享图
// 左上角的品牌标识用 public/brand/logo.png 合成，尺寸与位置和 SVG 里的留白区一致
const ogBase = await sharp(Buffer.from(og), { density: 144 })
  .resize(1200, 630)
  .png()
  .toBuffer();

const markSize = 76;
const markMask = Buffer.from(
  `<svg width="${markSize}" height="${markSize}"><rect width="${markSize}" height="${markSize}" rx="20" ry="20" fill="#fff"/></svg>`
);
const brandMark = await sharp(path.join(pub, 'brand', 'logo.png'))
  .resize(markSize, markSize, { fit: 'cover' })
  .composite([{ input: markMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

await sharp(ogBase)
  .composite([{ input: brandMark, left: 96, top: 150 }])
  .png({ compressionLevel: 9 })
  .toFile(path.join(pub, 'og-default.png'));

console.log('✅ assets generated');
