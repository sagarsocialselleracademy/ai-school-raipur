const { execSync } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targetUrl = 'https://aischoolraipur.com/';
const outPath = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d\\live-preview-full.png';

const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=1280,6000 "${targetUrl}"`;
console.log('Running screenshot...');
execSync(cmd, { stdio: 'inherit' });
console.log('Done!');
