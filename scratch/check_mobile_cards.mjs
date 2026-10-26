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
  const userDataDir = 'C:\\Users\\Neha\\AppData\\Local\\Temp\\chrome-check-mobile-' + Date.now();
  const port = 9270;

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

  const evalRes = await sendCommand('Runtime.evaluate', {
    expression: `
      (() => {
        const sec = document.getElementById('cards');
        const container = sec.querySelector('.xl\\\\:hidden');
        const cards = Array.from(container.children);

        const secBox = sec.getBoundingClientRect();
        const cBox = container.getBoundingClientRect();

        const initialScrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        const cardBoxesBefore = cards.map((c, i) => {
          const r = c.getBoundingClientRect();
          return {
            index: i,
            id: c.getAttribute('aria-label') || c.id,
            left: r.left,
            right: r.right,
            width: r.width,
            visibleInWindow: r.left >= 0 && r.right <= window.innerWidth
          };
        });

        // Scroll to maximum right
        container.scrollLeft = maxScroll;
        const finalScrollLeft = container.scrollLeft;

        const cardBoxesAfter = cards.map((c, i) => {
          const r = c.getBoundingClientRect();
          return {
            index: i,
            id: c.getAttribute('aria-label') || c.id,
            left: r.left,
            right: r.right,
            width: r.width,
            visibleInWindow: r.left >= 0 && r.right <= window.innerWidth,
            clippedRight: r.right > window.innerWidth,
            clipAmount: Math.max(0, r.right - window.innerWidth)
          };
        });

        return {
          windowWidth: window.innerWidth,
          secWidth: secBox.width,
          container: {
            clientWidth: container.clientWidth,
            scrollWidth: container.scrollWidth,
            offsetWidth: container.offsetWidth,
            maxScroll,
            finalScrollLeft,
            overflowX: window.getComputedStyle(container).overflowX,
            overflowY: window.getComputedStyle(container).overflowY
          },
          cardsBefore: cardBoxesBefore,
          cardsAfter: cardBoxesAfter
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Mobile Cards Evaluation:\n', JSON.stringify(evalRes.result.value, null, 2));

  ws.close();
  chromeProc.kill();
}

run();
