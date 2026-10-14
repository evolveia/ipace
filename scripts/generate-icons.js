import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

// SVG string representing the IPACE runner badge
const svgContent = fs.readFileSync(path.join(publicDir, 'favicon.svg'));

async function generate() {
  console.log('Generating PNG icons for PWA compliance...');

  // 192x192 PNG
  await sharp(svgContent)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512 PNG
  await sharp(svgContent)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 180x180 Apple Touch Icon
  await sharp(svgContent)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Maskable 512x512 with safe padding (80% safe zone)
  const maskableSvg = Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
      <rect width="512" height="512" fill="#F7F5F2"/>
      <g transform="translate(51, 51) scale(0.8)">
        ${svgContent.toString().replace(/<\?xml.*?\?>/g, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
      </g>
    </svg>
  `);

  await sharp(maskableSvg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Also replace icons/icon-192.png and icons/icon-512.png with true PNGs
  const iconsDir = path.join(publicDir, 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  await sharp(svgContent)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));
  await sharp(svgContent)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));

  console.log('All icons generated successfully!');
}

generate().catch(console.error);
