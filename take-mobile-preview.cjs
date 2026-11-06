const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targetUrl = 'http://localhost:5174/';
const outPath = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d\\preview-mobile.png';

const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=390,2600 "${targetUrl}"`;
console.log('Running:', cmd);
execSync(cmd, { stdio: 'inherit' });
console.log('Mobile preview saved to:', outPath);
