const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const port = 9522;
const tempProfile = 'C:\\Users\\Neha\\AppData\\Local\\Temp\\edge_scroll_test_' + Date.now();
const artifactDir = 'C:\\Users\\Neha\\.gemini\\antigravity\\brain\\97639a74-6059-411a-90dc-b35958cf4ae2';

async function main() {
  console.log('=== VERIFYING SCROLL BEHAVIOR: "WHAT I\'VE BEEN CREATING" & "CONNECT" ===');

  const browserProc = spawn(edgePath, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--window-size=1440,900',
    `--user-data-dir=${tempProfile}`
  ]);

  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      await new Promise((resolve, reject) => {
        http.get(`http://127.0.0.1:${port}/json/version`, res => resolve()).on('error', reject);
      });
      break;
    } catch (e) {}
  }

  const targetPage = await new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: '/json/new?http://localhost:5173/',
      method: 'PUT'
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.end();
  });

  const ws = new globalThis.WebSocket(targetPage.webSocketDebuggerUrl);
  let msgId = 1;
  const callbacks = new Map();
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  });
  if (ws.readyState !== 1) await new Promise(r => ws.addEventListener('open', r));

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, (res) => {
        if (res.error) reject(res.error);
        else resolve(res.result);
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evalJs(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    return res.result?.value;
  }

  async function takeScreenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    const fullPath = path.join(artifactDir, filename);
    fs.writeFileSync(fullPath, buf);
    console.log(`Saved screenshot: ${filename}`);
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await new Promise(r => setTimeout(r, 1500));

  console.log('\n--- Test 1: Desktop Viewport (1440x900) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  const layoutInfo = await evalJs(`
    (() => {
      const about = document.getElementById('about');
      const connect = document.getElementById('connect');
      return {
        aboutTop: about.offsetTop,
        aboutHeight: about.offsetHeight,
        connectTop: connect.offsetTop,
        connectHeight: connect.offsetHeight,
        winHeight: window.innerHeight
      };
    })()
  `);
  console.log('Layout Info:', layoutInfo);

  // 1. Scroll to top of "What I've Been Creating"
  await evalJs(`window.scrollTo({ top: document.getElementById('about').offsetTop, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 400));

  const stateStart = await evalJs(`
    (() => {
      const about = document.getElementById('about');
      const stickyBoard = about.querySelector('section');
      const connect = document.getElementById('connect');
      const bRect = stickyBoard.getBoundingClientRect();
      const cRect = connect.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        boardTop: bRect.top,
        boardBottom: bRect.bottom,
        connectTop: cRect.top,
        isConnectVisible: cRect.top < window.innerHeight && cRect.bottom > 0
      };
    })()
  `);
  console.log('1. At start of "What I\'ve Been Creating":', stateStart);
  await takeScreenshot('scroll_about_start.png');

  // 2. Scroll 50% through the scroll track (aboutTop + 350px)
  await evalJs(`window.scrollBy({ top: 350, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 300));

  const stateMid = await evalJs(`
    (() => {
      const about = document.getElementById('about');
      const stickyBoard = about.querySelector('section');
      const connect = document.getElementById('connect');
      const bRect = stickyBoard.getBoundingClientRect();
      const cRect = connect.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        boardTop: bRect.top,
        boardBottom: bRect.bottom,
        connectTop: cRect.top,
        isConnectVisible: cRect.top < window.innerHeight && cRect.bottom > 0
      };
    })()
  `);
  console.log('2. Midway through "What I\'ve Been Creating" (pinned):', stateMid);
  await takeScreenshot('scroll_about_mid.png');

  // 3. Scroll to the end of the track (when connect begins to appear)
  await evalJs(`
    const about = document.getElementById('about');
    window.scrollTo({ top: about.offsetTop + about.offsetHeight - window.innerHeight, behavior: 'instant' });
  `);
  await new Promise(r => setTimeout(r, 300));

  const stateEnd = await evalJs(`
    (() => {
      const about = document.getElementById('about');
      const stickyBoard = about.querySelector('section');
      const connect = document.getElementById('connect');
      const bRect = stickyBoard.getBoundingClientRect();
      const cRect = connect.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        boardTop: bRect.top,
        boardBottom: bRect.bottom,
        connectTop: cRect.top,
        isConnectVisible: cRect.top < window.innerHeight && cRect.bottom > 0
      };
    })()
  `);
  console.log('3. At the end of "What I\'ve Been Creating":', stateEnd);
  await takeScreenshot('scroll_about_end.png');

  // 4. Scroll into Connect section
  await evalJs(`window.scrollBy({ top: 450, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 300));

  const stateConnect = await evalJs(`
    (() => {
      const connect = document.getElementById('connect');
      const cRect = connect.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        connectTop: cRect.top,
        connectBottom: cRect.bottom,
        isConnectVisible: cRect.top < window.innerHeight && cRect.bottom > 0
      };
    })()
  `);
  console.log('4. Scrolled into Connect section:', stateConnect);
  await takeScreenshot('scroll_connect_visible.png');

  // 5. Tall Screen Test: 1440x1200
  console.log('\n--- Test 2: Tall Display (1440x1200) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });
  await evalJs(`window.scrollTo({ top: document.getElementById('about').offsetTop, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 400));

  const tallState = await evalJs(`
    (() => {
      const about = document.getElementById('about');
      const stickyBoard = about.querySelector('section');
      const connect = document.getElementById('connect');
      const bRect = stickyBoard.getBoundingClientRect();
      const cRect = connect.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        windowHeight: window.innerHeight,
        boardTop: bRect.top,
        boardHeight: bRect.height,
        connectTop: cRect.top,
        isConnectVisible: cRect.top < window.innerHeight && cRect.bottom > 0
      };
    })()
  `);
  console.log('Tall Screen at about.offsetTop:', tallState);
  await takeScreenshot('scroll_tall_screen.png');

  // 6. Mobile Test: 390x844
  console.log('\n--- Test 3: Mobile Viewport (390x844) ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await evalJs(`window.scrollTo({ top: document.getElementById('about').offsetTop, behavior: 'instant' });`);
  await new Promise(r => setTimeout(r, 400));

  const mobStart = await evalJs(`
    (() => {
      const about = document.getElementById('about');
      const stickyBoard = about.querySelector('section');
      const connect = document.getElementById('connect');
      const bRect = stickyBoard.getBoundingClientRect();
      const cRect = connect.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        boardTop: bRect.top,
        connectTop: cRect.top,
        isConnectVisible: cRect.top < window.innerHeight && cRect.bottom > 0
      };
    })()
  `);
  console.log('Mobile at about.offsetTop:', mobStart);
  await takeScreenshot('scroll_mobile_pinned.png');

  // Scroll to bottom on mobile
  const mobScrollRes = await evalJs(`
    (() => {
      const about = document.getElementById('about');
      const connect = document.getElementById('connect');
      const targetY = connect.offsetTop;
      window.scrollTo({ top: targetY, behavior: 'instant' });
      return {
        docHeight: document.documentElement.scrollHeight,
        winHeight: window.innerHeight,
        aboutTop: about.offsetTop,
        aboutHeight: about.offsetHeight,
        connectTopRaw: connect.offsetTop,
        scrollYNow: window.scrollY
      };
    })()
  `);
  console.log('Mobile scroll target details:', mobScrollRes);
  await new Promise(r => setTimeout(r, 400));

  const mobEnd = await evalJs(`
    (() => {
      const connect = document.getElementById('connect');
      const cRect = connect.getBoundingClientRect();
      return {
        scrollY: window.scrollY,
        connectTop: cRect.top,
        isConnectVisible: cRect.top < window.innerHeight && cRect.bottom > 0
      };
    })()
  `);
  console.log('Mobile at Connect section:', mobEnd);
  await takeScreenshot('scroll_mobile_connect.png');

  ws.close();
  browserProc.kill();
  console.log('\n=== ALL SCROLL VERIFICATIONS COMPLETED SUCCESSFULLY ===');
}

main().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
