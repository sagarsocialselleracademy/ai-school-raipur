const { execSync } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const cmd = `"${edgePath}" --headless --disable-gpu --user-data-dir="C:\\Users\\My-hp\\AppData\\Local\\Temp\\edge-eval-profile" --window-size=390,800 --dump-dom "http://localhost:5174/"`;
let html = '';
try {
  html = execSync(cmd).toString();
} catch (e) {
  html = e.stdout ? e.stdout.toString() : '';
}
const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
console.log('H1 HTML:\n', m ? m[0] : 'not found');

