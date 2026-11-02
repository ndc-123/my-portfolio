import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';

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

class SimpleCDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    const WebSocket = (await import('ws')).default;
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.on('open', resolve);
      this.ws.on('error', reject);
      this.ws.on('message', (msg) => {
        const parsed = JSON.parse(msg.toString());
        if (parsed.id && this.callbacks.has(parsed.id)) {
          const { res, rej } = this.callbacks.get(parsed.id);
          this.callbacks.delete(parsed.id);
          if (parsed.error) rej(parsed.error);
          else res(parsed.result);
        }
      });
    });
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = this.id++;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result?.value;
  }

  async captureScreenshot(path) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path, Buffer.from(res.data, 'base64'));
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = 'C:\\Users\\Neha\\AppData\\Local\\Temp\\chrome-inspect-' + Date.now();
  const port = 9288;

  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    'http://localhost:5173/'
  ]);

  let targets = null;
  for (let i = 0; i < 20; i++) {
    await sleep(300);
    try {
      targets = await getJson(`http://127.0.0.1:${port}/json`);
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  if (!targets || targets.length === 0) {
    console.error('Failed to connect to Chrome');
    chromeProc.kill();
    return;
  }

  const cdp = new SimpleCDP(targets[0].webSocketDebuggerUrl);
  await cdp.connect();
  await cdp.send('Page.enable');

  // Wait for React to render
  await sleep(1500);

  const info = await cdp.evaluate(`
    (() => {
      const about = document.getElementById('about');
      const connect = document.getElementById('connect');
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      
      const aboutRect = about ? about.getBoundingClientRect() : null;
      const connectRect = connect ? connect.getBoundingClientRect() : null;
      
      const aboutOffsetTop = about ? about.offsetTop : null;
      const connectOffsetTop = connect ? connect.offsetTop : null;
      
      return {
        docHeight,
        winHeight,
        about: {
          offsetTop: aboutOffsetTop,
          offsetHeight: about?.offsetHeight,
          rect: aboutRect
        },
        connect: {
          offsetTop: connectOffsetTop,
          offsetHeight: connect?.offsetHeight,
          rect: connectRect
        }
      };
    })()
  `);
  console.log('Initial layout info:', JSON.stringify(info, null, 2));

  // Let's scroll to `#about`
  await cdp.evaluate(`
    const about = document.getElementById('about');
    if (about) {
      window.scrollTo(0, about.offsetTop);
    }
  `);
  await sleep(500);

  const scrollAtAbout = await cdp.evaluate(`
    (() => {
      const about = document.getElementById('about');
      const connect = document.getElementById('connect');
      return {
        scrollY: window.scrollY,
        aboutRect: about.getBoundingClientRect(),
        connectRect: connect.getBoundingClientRect()
      };
    })()
  `);
  console.log('Scrolled to about.offsetTop:', JSON.stringify(scrollAtAbout, null, 2));
  await cdp.captureScreenshot('scratch/scroll_at_about.png');

  // Now let's scroll 200px down from about.offsetTop
  await cdp.evaluate(`window.scrollBy(0, 200);`);
  await sleep(300);
  const scrollPlus200 = await cdp.evaluate(`
    (() => {
      const about = document.getElementById('about');
      const connect = document.getElementById('connect');
      return {
        scrollY: window.scrollY,
        aboutRect: about.getBoundingClientRect(),
        connectRect: connect.getBoundingClientRect()
      };
    })()
  `);
  console.log('Scrolled +200px:', JSON.stringify(scrollPlus200, null, 2));
  await cdp.captureScreenshot('scratch/scroll_plus_200.png');

  // Now let's test a taller window (e.g. 1440x1200 or 1920x1080)
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sleep(300);
  await cdp.evaluate(`
    const about = document.getElementById('about');
    if (about) {
      window.scrollTo(0, about.offsetTop);
    }
  `);
  await sleep(300);
  const tallWindow = await cdp.evaluate(`
    (() => {
      const about = document.getElementById('about');
      const connect = document.getElementById('connect');
      return {
        scrollY: window.scrollY,
        windowHeight: window.innerHeight,
        aboutRect: about.getBoundingClientRect(),
        connectRect: connect.getBoundingClientRect()
      };
    })()
  `);
  console.log('Tall window (1200h) at about.offsetTop:', JSON.stringify(tallWindow, null, 2));
  await cdp.captureScreenshot('scratch/tall_window_at_about.png');

  cdp.close();
  chromeProc.kill();
}

run().catch(console.error);
