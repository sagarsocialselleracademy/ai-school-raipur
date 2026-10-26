const { execSync } = require('child_process');
const path = require('path');

const projectDir = 'd:/Lakshit Sethiya Website/ai-school-raipur';
const distDir = path.join(projectDir, 'dist');
const env = {
  ...process.env,
  PATH: `${process.env.LOCALAPPDATA}\\Programs\\gh\\bin;${process.env.LOCALAPPDATA}\\Programs\\MinGit\\cmd;${process.env.LOCALAPPDATA}\\Programs\\nodejs;${process.env.PATH}`
};

console.log('1. Building production dist...');
execSync('npm run build', { cwd: projectDir, env, stdio: 'inherit' });

console.log('2. Publishing dist to hostinger-deploy branch...');
execSync('git init -b hostinger-deploy', { cwd: distDir, env, stdio: 'inherit' });
execSync('git config user.name "Lakshit Sethiya"', { cwd: distDir, env, stdio: 'inherit' });
execSync('git config user.email "support@socialseller.in"', { cwd: distDir, env, stdio: 'inherit' });
try { execSync('git remote remove origin', { cwd: distDir, env, stdio: 'ignore' }); } catch {}
execSync('git remote add origin https://github.com/sagarsocialselleracademy/ai-school-raipur.git', { cwd: distDir, env, stdio: 'inherit' });
execSync('git add -A', { cwd: distDir, env, stdio: 'inherit' });
execSync('git commit -m "Deploy built static files for Hostinger/GoDaddy"', { cwd: distDir, env, stdio: 'inherit' });
execSync('git push -f origin hostinger-deploy', { cwd: distDir, env, stdio: 'inherit' });
console.log('Done!');
