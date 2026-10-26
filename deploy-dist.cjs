const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = 'd:/Lakshit Sethiya Website/ai-school-raipur';
const distDir = path.join(projectDir, 'dist');
const env = {
  ...process.env,
  PATH: `${process.env.LOCALAPPDATA}\\Programs\\gh\\bin;${process.env.LOCALAPPDATA}\\Programs\\MinGit\\cmd;${process.env.LOCALAPPDATA}\\Programs\\nodejs;${process.env.PATH}`
};

console.log('1. Building production dist...');
execSync('npm run build', { cwd: projectDir, env, stdio: 'inherit' });

// Copy index.html to 404.html and add .nojekyll for GitHub Pages SPA routing
fs.copyFileSync(path.join(distDir, 'index.html'), path.join(distDir, '404.html'));
fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

console.log('2. Pushing source code to main branch...');
try {
  execSync('git add -A', { cwd: projectDir, env, stdio: 'inherit' });
  execSync('git commit -m "Update texts, logo, proof, gallery alignment, and aischoolraipur.in domain"', { cwd: projectDir, env, stdio: 'inherit' });
} catch {}
execSync('git push origin main', { cwd: projectDir, env, stdio: 'inherit' });

console.log('3. Publishing dist to hostinger-deploy branch...');
execSync('git init -b hostinger-deploy', { cwd: distDir, env, stdio: 'inherit' });
execSync('git config user.name "Lakshit Sethiya"', { cwd: distDir, env, stdio: 'inherit' });
execSync('git config user.email "support@socialseller.in"', { cwd: distDir, env, stdio: 'inherit' });
try { execSync('git remote remove origin', { cwd: distDir, env, stdio: 'ignore' }); } catch {}
execSync('git remote add origin https://github.com/sagarsocialselleracademy/ai-school-raipur.git', { cwd: distDir, env, stdio: 'inherit' });
execSync('git add -A', { cwd: distDir, env, stdio: 'inherit' });
execSync('git commit -m "Deploy built static files for aischoolraipur.in"', { cwd: distDir, env, stdio: 'inherit' });
execSync('git push -f origin hostinger-deploy', { cwd: distDir, env, stdio: 'inherit' });

console.log('4. Configuring GitHub Pages on hostinger-deploy branch...');
try {
  execSync('gh api -X POST repos/sagarsocialselleracademy/ai-school-raipur/pages -f "source[branch]=hostinger-deploy" -f "source[path]=/"', { cwd: projectDir, env, stdio: 'inherit' });
} catch {
  try {
    execSync('gh api -X PUT repos/sagarsocialselleracademy/ai-school-raipur/pages -f "cname=aischoolraipur.com" -f "source[branch]=hostinger-deploy" -f "source[path]=/"', { cwd: projectDir, env, stdio: 'inherit' });
  } catch (e) {
    console.log('Pages note:', e.message);
  }
}

console.log('Done!');
