const { exec } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d';
const url = 'https://aischoolraipur.com/?v=' + Date.now();

function capture(cmd) {
  return new Promise((resolve) => {
    exec(cmd, () => resolve());
  });
}

async function run() {
  console.log('Capturing entire page 1280x9500...');
  await capture(`"${edgePath}" --headless --disable-gpu --window-size=1280,9500 --screenshot="${brainDir}\\verify-v42-all.png" "${url}"`);
  console.log('Done full page.');
}

run();
