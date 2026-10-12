import fs from 'fs';
import path from 'path';

const newAssets = [
  { name: 'project-3-complex.png', hash: '22d460421a3fef48fbea8c01e903f59e0fc486ab.png' },
  { name: 'domain-card-2.png', hash: '98cee4f41687699c83ad43588965d49e840a0683.png' },
  { name: 'domain-card-4.png', hash: 'c87d1eafaabc2c4663e09db217bf3d49b119cf09.png' },
  { name: 'domain-card-5.png', hash: 'bc4fb80720e9ae19b9a1e1d7c1c79c967e3c39db.png' },
  { name: 'domain-left-arrow.svg', hash: '2a20e980410f42d4ce4e8d0d895b74f11b0849f5.svg' },
  { name: 'outside-card-1.png', hash: '70fa1ac9db2ed957b3d86a0f643dfa02037d70ff.png' },
  { name: 'outside-card-5.png', hash: 'beb76afc40a7db11220950726875409f7d04c236.png' },
  { name: 'outside-card-6.png', hash: 'ab65940269ed2871728bfc541ac91b23eeb04832.png' },
  { name: 'outside-card-7.png', hash: 'f2dd2acf62f36fceb26edd4a216491e1977c30fe.png' },
  { name: 'cursor-neha-badge.png', hash: '37d9759b8c6eb22bccfcb55063fb163b9fb91b1a.png' },
  { name: 'cursor-you-badge.png', hash: '553e67d3642dd218e0ce45448179efe5987c72cb.png' },
];

const targetDir = path.resolve('public/assets');

async function run() {
  for (const item of newAssets) {
    const url = `http://localhost:3845/assets/${item.hash}`;
    const filePath = path.join(targetDir, item.name);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`Failed to download ${item.name}: ${res.statusText}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      console.log(`Saved ${item.name} (${buffer.length} bytes)`);
    } catch (e) {
      console.error(`Error downloading ${item.name}:`, e.message);
    }
  }
}

run();
