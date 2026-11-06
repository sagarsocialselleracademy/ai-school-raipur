const { execSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const targetUrl = 'http://localhost:5174/#passes';
const outPath = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d\\preview-modal.png';

const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=1280,1100 "${targetUrl}"`;
console.log('Running:', cmd);
execSync(cmd, { stdio: 'inherit' });
console.log('Modal preview saved to:', outPath);
