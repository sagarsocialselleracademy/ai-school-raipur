const { exec } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d';
const url = 'https://aischoolraipur.com/?v=' + Date.now();

const cmd = `"${edgePath}" --headless --disable-gpu --virtual-time-budget=8000 --window-size=1280,9500 --screenshot="${brainDir}\\verify-v42-all-budget.png" "${url}"`;

exec(cmd, () => {
  console.log('Capture all with budget complete');
});
