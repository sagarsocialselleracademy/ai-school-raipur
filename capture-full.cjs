const { execSync } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d';
const url = 'https://aischoolraipur.com/?v=' + Date.now();

console.log('Capturing full page long desktop screenshot...');
execSync(`"${edgePath}" --headless --disable-gpu --window-size=1280,4500 --screenshot="${brainDir}\\verify-v41-desktop-full.png" "${url}"`, { stdio: 'inherit' });

console.log('Capturing full page mobile screenshot...');
execSync(`"${edgePath}" --headless --disable-gpu --window-size=390,4500 --screenshot="${brainDir}\\verify-v41-mobile-full.png" "${url}"`, { stdio: 'inherit' });

console.log('Done full page screenshots.');
