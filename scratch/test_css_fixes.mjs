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

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Neha\\AppData\\Local\\Temp\\chrome-test-css-' + Date.now();
  const port = 9271;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=390,844',
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
  await sendCommand('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await sleep(1000);

  const testResults = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const sec = document.getElementById('cards');
        const parent = sec.querySelector('.relative.z-10');
        const container = sec.querySelector('.xl\\\\:hidden');

        // Let's test setting:
        // parent.style.width = '100%';
        // container.style.width = '100vw'; or container.style.maxWidth = '100%';
        
        // Test Option 1:
        parent.style.width = '100%';
        parent.style.alignItems = 'stretch';
        container.style.width = 'auto';
        container.style.maxWidth = 'none';

        // Add spacer at end if needed
        let endSpacer = container.querySelector('.carousel-end-spacer');
        if (!endSpacer) {
          endSpacer = document.createElement('div');
          endSpacer.className = 'carousel-end-spacer shrink-0 w-4 sm:w-6 md:w-16';
          container.appendChild(endSpacer);
        }

        const maxScroll = container.scrollWidth - container.clientWidth;
        container.scrollLeft = maxScroll;

        const cards = Array.from(container.children).filter(c => c !== endSpacer);
        const lastCard = cards[cards.length - 1];
        const lastBox = lastCard.getBoundingClientRect();

        return {
          containerClientWidth: container.clientWidth,
          containerScrollWidth: container.scrollWidth,
          maxScroll,
          finalScrollLeft: container.scrollLeft,
          lastCard: {
            left: lastBox.left,
            right: lastBox.right,
            width: lastBox.width,
            fullyVisible: lastBox.left >= 0 && lastBox.right <= window.innerWidth,
            clipAmount: Math.max(0, lastBox.right - window.innerWidth)
          }
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Test CSS option result:\n', JSON.stringify(testResults.result.value, null, 2));

  ws.close();
  chromeProc.kill();
}

run();
