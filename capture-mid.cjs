const { exec } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d';
const url = 'https://aischoolraipur.com/?v=' + Date.now();

function capture(cmd, name) {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      console.log(`Done ${name}`);
      resolve();
    });
  });
}

async function run() {
  console.log('Capturing timeline and awards...');
  await capture(`"${edgePath}" --headless --disable-gpu --window-size=1280,3000 --screenshot="${brainDir}\\verify-v42-mid.png" "${url}"`, 'mid');
  console.log('Done.');
}

run();
