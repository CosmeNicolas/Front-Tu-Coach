import sharp from 'sharp';

const input = 'public/sponsor/ATLASUP.png';
const output = 'public/sponsor/ATLASUP-white.png';

const { data, info } = await sharp(input)
  .trim({ threshold: 12 })
  .greyscale()
  .normalize()
  .linear(2.8, -60)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const channels = info.channels;
const out = Buffer.alloc(info.width * info.height * 4);

for (let i = 0; i < info.width * info.height; i += 1) {
  const lum = data[i * channels];

  if (lum < 18) {
    out[i * 4 + 3] = 0;
  } else {
    out[i * 4] = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] =
      lum > 220 ? 255 : Math.min(255, Math.round((lum - 18) * 3.5));
  }
}

await sharp(out, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toFile(output);

console.log(`Wrote ${output} (${info.width}x${info.height})`);
