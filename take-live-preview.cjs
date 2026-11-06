const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targetUrl = 'https://aischoolraipur.com/';
const outPath = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d\\live-preview.png';

const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=1280,2200 "${targetUrl}"`;
console.log('Running:', cmd);
execSync(cmd, { stdio: 'inherit' });
console.log('Live preview saved to:', outPath);
