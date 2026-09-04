import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import path from "path";
import fs from "fs";

const assistRoot = path.resolve("src/assist");
const tasks = [
  // bg images - keep max 1920 for hero
  { src: "bgImg/bg1.jpg", maxW: 1920, jpgQuality: 78, webpQuality: 75 },
  { src: "bgImg/bg2.jpg", maxW: 1920, jpgQuality: 78, webpQuality: 75 },
  { src: "bgImg/bg3.jpg", maxW: 1920, jpgQuality: 78, webpQuality: 75 },
  { src: "bgImg/bg4.jpg", maxW: 1920, jpgQuality: 78, webpQuality: 75 },
  { src: "bgImg/bg5.jpg", maxW: 1920, jpgQuality: 78, webpQuality: 75 },
  { src: "bgImg/profileBg.jpg", maxW: 1600, jpgQuality: 78, webpQuality: 75 },
  // auth pages
  { src: "image/login.jpg", maxW: 1280, jpgQuality: 78, webpQuality: 76 },
  { src: "image/register.jpg", maxW: 1280, jpgQuality: 78, webpQuality: 76 },
  // heavy pngs/universities - convert to webp, keep png but compress
  { src: "image/university4.png", maxW: 800, webpQuality: 76 },
  { src: "image/AboutUs/student4.png", maxW: 800, webpQuality: 75 },
  { src: "image/AboutUs/student1.jpg", maxW: 800, jpgQuality: 78, webpQuality: 76 },
  { src: "image/AboutUs/student2.jpg", maxW: 800, jpgQuality: 78, webpQuality: 76 },
  { src: "image/AboutUs/student3.jpg", maxW: 800, jpgQuality: 78, webpQuality: 76 },
];

async function optimize({ src, maxW, jpgQuality, webpQuality }) {
  const srcPath = path.join(assistRoot, src);
  if (!fs.existsSync(srcPath)) {
    console.log(`skip missing ${src}`);
    return;
  }
  const buf = await fs.promises.readFile(srcPath);
  const origSize = buf.length;
  const image = sharp(buf);
  const meta = await image.metadata();
  const width = Math.min(maxW, meta.width || maxW);
  // Generate webp
  const webpPath = srcPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  try {
    await sharp(buf)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: webpQuality, effort: 5 })
      .toFile(webpPath + ".tmp");
    const webpStat = await stat(webpPath + ".tmp");
    await fs.promises.rename(webpPath + ".tmp", webpPath);
    console.log(`${src} -> ${path.relative(assistRoot, webpPath)} ${Math.round(origSize/1024)}KB -> ${Math.round(webpStat.size/1024)}KB (${Math.round((1 - webpStat.size/origSize)*100)}% saved)`);
  } catch (e) {
    console.error(`webp fail ${src}`, e.message);
  }
  // Also recompress original jpg/png if quality specified and original is large
  if (jpgQuality && /\.(jpg|jpeg)$/i.test(src)) {
    try {
      const outTmp = srcPath + ".tmp";
      await sharp(buf)
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: jpgQuality, mozjpeg: true })
        .toFile(outTmp);
      const newStat = await stat(outTmp);
      if (newStat.size < origSize * 0.95) {
        await fs.promises.rename(outTmp, srcPath);
        console.log(`  jpg recompressed ${src} ${Math.round(origSize/1024)}KB -> ${Math.round(newStat.size/1024)}KB`);
      } else {
        await fs.promises.unlink(outTmp).catch(()=>{});
        console.log(`  jpg keep original (no worthwhile savings)`);
      }
    } catch (e) {
      console.error(`jpg recompress fail ${src}`, e.message);
    }
  }
  if (/\.(png)$/i.test(src)) {
    try {
      // compress png via webp already, also try to compress png lossy
      const outTmp = srcPath + ".tmp";
      await sharp(buf)
        .resize({ width, withoutEnlargement: true })
        .png({ compressionLevel: 9, palette: true, quality: 80 })
        .toFile(outTmp);
      const newStat = await stat(outTmp);
      if (newStat.size < origSize) {
        await fs.promises.rename(outTmp, srcPath);
        console.log(`  png recompressed ${src} ${Math.round(origSize/1024)}KB -> ${Math.round(newStat.size/1024)}KB`);
      } else await fs.promises.unlink(outTmp).catch(()=>{});
    } catch {}
  }
}

for (const t of tasks) {
  await optimize(t);
}
console.log("done");
