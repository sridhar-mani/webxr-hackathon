// Generates PWA icons with zero dependencies (pure Node + zlib).
// Produces public/icons/{icon-192,icon-512,icon-512-maskable}.png
//
//   node scripts/generate-icons.mjs
//
// The glyph is a simple VR-goggles mark on a dark gradient. Swap in your own
// brand art any time — these are just placeholders that pass installability.

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons");

// ---- tiny PNG encoder ----------------------------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // rows prefixed with filter byte 0
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---- drawing -------------------------------------------------------------
const lerp = (a, b, t) => a + (b - a) * t;

function inRoundRect(px, py, x0, y0, x1, y1, r) {
  const cx = Math.min(Math.max(px, x0 + r), x1 - r);
  const cy = Math.min(Math.max(py, y0 + r), y1 - r);
  if (px >= x0 && px <= x1 && py >= y0 && py <= y1) {
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= r * r || (px >= x0 + r && px <= x1 - r) || (py >= y0 + r && py <= y1 - r);
  }
  return false;
}

function renderIcon(size, pad) {
  const ss = 4; // supersample for smooth edges
  const S = size * ss;
  const hi = Buffer.alloc(S * S * 4);

  const m = S * pad; // content margin
  const cw = S - m * 2;
  // goggle body
  const bx0 = m;
  const bx1 = S - m;
  const bh = cw * 0.46;
  const by0 = (S - bh) / 2;
  const by1 = by0 + bh;
  const bodyR = bh * 0.42;
  // lenses
  const gap = cw * 0.06;
  const lensW = (cw - gap * 3) / 2;
  const lensH = bh * 0.6;
  const lensR = lensH * 0.42;
  const lyTop = by0 + (bh - lensH) / 2;
  const lyBot = lyTop + lensH;
  const l1x0 = bx0 + gap;
  const l1x1 = l1x0 + lensW;
  const l2x1 = bx1 - gap;
  const l2x0 = l2x1 - lensW;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const i = (y * S + x) * 4;
      // background vertical gradient
      const t = y / S;
      let r = lerp(0x24, 0x14, t);
      let g = lerp(0x22, 0x14, t);
      let b = lerp(0x3c, 0x1f, t);

      if (inRoundRect(x, y, bx0, by0, bx1, by1, bodyR)) {
        // violet goggle body
        r = 0x7c;
        g = 0x6c;
        b = 0xff;
        const inLens =
          inRoundRect(x, y, l1x0, lyTop, l1x1, lyBot, lensR) ||
          inRoundRect(x, y, l2x0, lyTop, l2x1, lyBot, lensR);
        if (inLens) {
          r = 0x12;
          g = 0x12;
          b = 0x1c;
        }
      }
      hi[i] = r;
      hi[i + 1] = g;
      hi[i + 2] = b;
      hi[i + 3] = 0xff;
    }
  }

  // downsample ss×ss → size
  const out = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let dy = 0; dy < ss; dy++) {
        for (let dx = 0; dx < ss; dx++) {
          const si = ((y * ss + dy) * S + (x * ss + dx)) * 4;
          r += hi[si]; g += hi[si + 1]; b += hi[si + 2]; a += hi[si + 3];
        }
      }
      const n = ss * ss;
      const oi = (y * size + x) * 4;
      out[oi] = Math.round(r / n);
      out[oi + 1] = Math.round(g / n);
      out[oi + 2] = Math.round(b / n);
      out[oi + 3] = Math.round(a / n);
    }
  }
  return out;
}

mkdirSync(OUT_DIR, { recursive: true });
const jobs = [
  { name: "icon-192.png", size: 192, pad: 0.12 },
  { name: "icon-512.png", size: 512, pad: 0.12 },
  // maskable needs the glyph inside the safe zone → more padding
  { name: "icon-512-maskable.png", size: 512, pad: 0.2 },
];
for (const { name, size, pad } of jobs) {
  const png = encodePng(size, size, renderIcon(size, pad));
  writeFileSync(join(OUT_DIR, name), png);
  console.log(`wrote ${name} (${png.length} bytes)`);
}
