const { exec } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d';
const url = 'https://aischoolraipur.com/?v=' + Date.now();

const cmd = `"${edgePath}" --headless --disable-gpu --virtual-time-budget=6000 --window-size=1280,4500 --screenshot="${brainDir}\\verify-awards-budget.png" "${url}"`;

exec(cmd, (err, stdout, stderr) => {
  console.log('Capture with virtual-time-budget completed');
});
