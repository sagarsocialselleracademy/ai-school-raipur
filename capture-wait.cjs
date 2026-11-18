const { exec } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const brainDir = 'C:\\Users\\My-hp\\.gemini\\antigravity\\brain\\1249e93c-4226-4508-834f-c2a87c30ed8d';
const url = 'https://aischoolraipur.com/?v=' + Date.now();

// We can use a node script that opens Edge or runs PowerShell with a small delay
const cmd = `powershell -Command "Start-Process '${edgePath}' -ArgumentList '--headless','--disable-gpu','--window-size=1280,3000','--screenshot=${brainDir}\\verify-awards-waited.png','${url}#gallery' -Wait"`;

exec(cmd, (err, stdout, stderr) => {
  console.log('Capture completed');
});
