import { spawn } from 'child_process';
import http from 'http';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

const VIEWPORTS = [
  { name: 'Android Small', width: 360, height: 740, mobile: true },
  { name: 'iPhone SE', width: 375, height: 667, mobile: true },
  { name: 'iPhone 14', width: 390, height: 844, mobile: true },
  { name: 'iPhone Plus', width: 414, height: 896, mobile: true },
  { name: 'iPhone Pro Max', width: 430, height: 932, mobile: true },
  { name: 'iPad Portrait', width: 768, height: 1024, mobile: false },
  { name: 'iPad Landscape', width: 1024, height: 768, mobile: false }
];

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Neha\\AppData\\Local\\Temp\\chrome-test-multi-' + Date.now();
  const port = 9272;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    'http://localhost:5173/'
  ]);

  let connected = false;
  let targets = null;
  for (let i = 0; i < 20; i++) {
    await sleep(300);
    try {
      targets = await getJson(`http://127.0.0.1:${port}/json`);
      if (targets && targets.length > 0) {
        connected = true;
        break;
      }
    } catch (e) {}
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const callbacks = new Map();

  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(resolve => ws.onopen = resolve);

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await sendCommand('Page.enable');
  await sendCommand('Runtime.enable');

  for (const vp of VIEWPORTS) {
    await sendCommand('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.mobile
    });
    await sleep(300);

    const res = await sendCommand('Runtime.evaluate', {
      expression: `
        (() => {
          const sec = document.getElementById('cards');
          const parent = sec.querySelector('.relative.z-10');
          const container = sec.querySelector('.xl\\\\:hidden');

          // Apply candidate classes
          parent.classList.add('w-full');
          parent.classList.remove('items-start');
          
          container.className = "xl:hidden flex flex-nowrap gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 px-4 sm:px-6 md:px-12 lg:px-14 -mx-4 sm:-mx-6 md:-mx-12 lg:-mx-14 no-scrollbar snap-x snap-mandatory w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] md:w-[calc(100%+6rem)] lg:w-[calc(100%+7rem)] max-w-none";

          let endSpacer = container.querySelector('.carousel-end-spacer');
          if (!endSpacer) {
            endSpacer = document.createElement('div');
            endSpacer.className = 'carousel-end-spacer shrink-0 w-4 sm:w-6 md:w-12 lg:w-14';
            container.appendChild(endSpacer);
          }

          const maxScroll = container.scrollWidth - container.clientWidth;
          container.scrollLeft = maxScroll;

          const cards = Array.from(container.children).filter(c => c !== endSpacer);
          const lastCard = cards[cards.length - 1];
          const lastBox = lastCard.getBoundingClientRect();

          return {
            clientWidth: container.clientWidth,
            scrollWidth: container.scrollWidth,
            maxScroll,
            finalScrollLeft: container.scrollLeft,
            lastCard: {
              left: Math.round(lastBox.left),
              right: Math.round(lastBox.right),
              width: Math.round(lastBox.width),
              fullyVisible: lastBox.left >= 0 && lastBox.right <= window.innerWidth,
              rightMargin: Math.round(window.innerWidth - lastBox.right)
            }
          };
        })()
      `,
      returnByValue: true
    });

    console.log(`\nViewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(JSON.stringify(res.result.value, null, 2));
  }

  ws.close();
  chromeProc.kill();
}

run();
