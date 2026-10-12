import fs from 'fs';
import path from 'path';

const assets = [
  { name: 'push-pin.svg', hash: '3cbeb5fab2a2238ff78e24955f718f1917c082bd.svg' },
  { name: 'shuffle.svg', hash: 'e97eddd09266c485a748f4bce6e67ea2e530e0cb.svg' },
  { name: 'hero-portrait.png', hash: 'abfa18d8833d208eb8c61e65ddb8bcb242ec35d5.png' },
  { name: 'dust-bg.png', hash: '0e607c746b30b27cab7c9900893ffc3643e48cbd.png' },
  { name: 'joker-symbol.svg', hash: 'e2903066de75763dc62aea8df3d17422196f412c.svg' },
  { name: 'paper-highlights.svg', hash: 'ce3d63e251772966ffe99f9cb95e892bc59c7988.svg' },
  { name: 'paper-fibers.svg', hash: 'a445926735a6397358cc2495877296aa47df2eb9.svg' },
  { name: 'eight-pointed-star.svg', hash: 'dab0eb645b7ad569de25a1df8b36210305ed214a.svg' },
  { name: 'club-suit.svg', hash: '41471c05bbef365c101e30b7caf9a41e7aec086f.svg' },
  { name: 'diamond-suit.svg', hash: 'be005aafb9dcc87a1dadc874988b5e516952126a.svg' },
  { name: 'spade-suit.svg', hash: 'b501efbddbdfbcdfd1ebef988e7580667c37021c.svg' },
  { name: 'heart-suit.svg', hash: 'c95a15b68e7508d3a6660fdac1730c7eb1867aee.svg' },
  { name: 'project-1-zoo.png', hash: '59f898302a8a8a428cfe986faef9830c9ac8737f.png' },
  { name: 'project-2-sustainability.png', hash: 'd097c12a643a4161ef0387723cbc74a93109f871.png' },
  { name: 'project-3-strava.png', hash: 'fd28a5714f717923045921c3edb02beb73e69168.png' },
  { name: 'project-4-complex.png', hash: 'e0ca9f4ee7337fb33e4d352c44d80bf574069e08.png' },
  { name: 'project-indicator-1.svg', hash: '23c5f9fcd5451b820be642a3fe75b69b97f16ca1.svg' },
  { name: 'project-indicator-2.svg', hash: '72adab62b4f5b67aeff6a0dbb3baf4ac6f995e32.svg' },
  { name: 'project-indicator-3.svg', hash: '8798079b7fa90968ebf5cbf31d78a2c9366ae4f4.svg' },
  { name: 'project-indicator-4.svg', hash: '4ebffb689f06369dad1114e6d52866ad6dd62db0.svg' },
  { name: 'domain-1.png', hash: '6a0df3ef4c81e76d4429d227d542c04eceab48f0.png' },
  { name: 'domain-2.png', hash: '7e67a8e78111ccdddd90ac7c8734281fcae3d9ec.png' },
  { name: 'domain-arrow.svg', hash: 'e6db35b6210c59949c0432af9ed509a54db447a5.svg' },
  { name: 'testimonial-hopkins.png', hash: '3b51154f4101969e6cae3fc962809a419250134b.png' },
  { name: 'outside-bg.png', hash: '63580cad60ee0d0ad4d6c7d1536d4cf326ebf5ef.png' },
  { name: 'outside-photo-1.png', hash: '68026d5c6a9a57215fe04e9af0d4cc34f7a39f2c.png' },
  { name: 'outside-photo-2.png', hash: '5b86d4a068e1282f321f93aa08c6025caa543c1b.png' },
  { name: 'outside-photo-3.png', hash: 'ff9c3d6d9a7b593e93bcbc6a7a4a4b8589886e0f.png' },
  { name: 'outside-photo-4.png', hash: '76ba0e774589f398bc7a2f40c810bbbb998b0245.png' },
  { name: 'outside-photo-5.png', hash: 'dce144487dfb5adf75a2c528558311fb899f106a.png' },
  { name: 'outside-photo-6.png', hash: '757fd44fc1fd32217ae9137b6b63a46d63d1f12f.png' },
  { name: 'outside-photo-7.png', hash: '415c4974fb8429487f3c8054daa19b8868a63188.png' },
  { name: 'ace-emblem.svg', hash: 'fd235a40e07b3c94bc4cef27083a0adc492cbe58.svg' },
  { name: 'instagram.svg', hash: '26faf7bde39db965069741231009c35fde1d5d89.svg' },
  { name: 'aged-edges.svg', hash: 'cc460d9d012506dd72f4d8f5a2ff9edcf26325c1.svg' },
  { name: 'copy-icon-email.svg', hash: 'a88ff780d2338a6a13999f09d8c3f7e9ba9076a1.svg' },
  { name: 'copy-icon-phone.svg', hash: '415c9a29e6354a8f9d4a09e3f9e7e5e6ee4f0781.svg' },
  { name: 'arrow-behance.svg', hash: 'b80842df0c325ec8ebca3749af43f1264e10417a.svg' },
  { name: 'arrow-linkedin.svg', hash: '6a187f9841e0418f8a221fc4bd99bf4fde31432a.svg' },
  { name: 'cursor-neha.svg', hash: '6d32161cb92244dc5133c7e93b050a030c6ebf7a.svg' },
  { name: 'cursor-you.svg', hash: 'f64dcb99387ebdf1e2d3a549e17402dafb19d987.svg' },
];

const targetDir = path.resolve('public/assets');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function run() {
  for (const item of assets) {
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
