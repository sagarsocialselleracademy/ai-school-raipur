const { exec } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d';
const url = 'https://aischoolraipur.com/#timeline';

function capture(cmd, name) {
  return new Promise((resolve) => {
    exec(cmd, (err, stdout, stderr) => {
      console.log(`Done ${name}`);
      resolve();
    });
  });
}

async function run() {
  console.log('Capturing timeline and awards at scroll position...');
  await capture(`"${edgePath}" --headless --disable-gpu --window-size=1280,2200 --screenshot="${brainDir}\\verify-timeline-awards.png" "${url}"`, 'timeline-awards');
  console.log('Done.');
}

run();
