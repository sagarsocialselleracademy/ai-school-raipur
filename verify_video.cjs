const { spawn } = require('child_process');
const http = require('http');

async function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

function sendCDP(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const edge = spawn(edgePath, [
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9228',
    '--user-data-dir=C:\\Users\\My-hp\\AppData\\Local\\Temp\\edge-test-video',
    '--window-size=1280,1000',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 2000));
  try {
    const list = await getJson('http://127.0.0.1:9228/json/list');
    const ws = new WebSocket(list.find(p => p.type === 'page').webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    console.log('Navigating...');
    await sendCDP(ws, 'Page.navigate', { url: 'https://aischoolraipur.com/?v=' + Date.now() });
    await new Promise(r => setTimeout(r, 4000));

    const videoState = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const v = document.querySelector(".hero-video video");
        if (!v) return "no video";
        return JSON.stringify({
          paused: v.paused,
          muted: v.muted,
          volume: v.volume,
          currentTime: v.currentTime,
          duration: v.duration,
          hasUnmuteBadge: !!document.querySelector(".unmute-badge-btn")
        });
      })()`
    });
    console.log('Initial Video State:', videoState.result.value);

    // Simulate user gesture (pointerdown)
    console.log('Simulating user interaction...');
    await sendCDP(ws, 'Runtime.evaluate', {
      expression: 'window.dispatchEvent(new MouseEvent("pointerdown", { bubbles: true }))'
    });
    await new Promise(r => setTimeout(r, 500));

    const afterGesture = await sendCDP(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const v = document.querySelector(".hero-video video");
        return JSON.stringify({
          paused: v.paused,
          muted: v.muted,
          volume: v.volume,
          currentTime: v.currentTime,
          hasUnmuteBadge: !!document.querySelector(".unmute-badge-btn")
        });
      })()`
    });
    console.log('After Gesture State:', afterGesture.result.value);

  } finally {
    edge.kill();
  }
}
main().catch(console.error);
