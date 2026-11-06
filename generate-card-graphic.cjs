const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = 'd:/Lakshit Sethiya Website/ai-school-raipur';
const outHtmlPath = path.join(projectDir, 'temp-card.html');
const outPngPath = path.join(projectDir, 'public/media/what-will-you-learn-card.png');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Sora:wght@700;800&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    width: 1080px;
    height: 1350px;
    background: #090605;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    position: relative;
    overflow: hidden;
  }
  
  /* Ambient glow effects */
  .glow-top {
    position: absolute;
    top: -150px;
    left: 50%;
    transform: translateX(-50%);
    width: 800px;
    height: 500px;
    background: radial-gradient(circle, rgba(250, 116, 44, 0.35) 0%, transparent 70%);
    filter: blur(60px);
    pointer-events: none;
  }
  .glow-bottom {
    position: absolute;
    bottom: -150px;
    right: -100px;
    width: 600px;
    height: 500px;
    background: radial-gradient(circle, rgba(234, 68, 44, 0.25) 0%, transparent 70%);
    filter: blur(60px);
    pointer-events: none;
  }
  
  .card-frame {
    width: 1000px;
    height: 1270px;
    background: linear-gradient(180deg, #16100d 0%, #0d0907 100%);
    border: 2px solid rgba(250, 116, 44, 0.45);
    border-radius: 36px;
    padding: 55px 50px 45px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9), 0 0 60px rgba(250, 116, 44, 0.2);
    position: relative;
    z-index: 2;
  }
  
  /* Header */
  .header {
    text-align: center;
  }
  .top-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(250, 116, 44, 0.15);
    border: 1px solid rgba(250, 116, 44, 0.5);
    color: #fa742c;
    padding: 8px 24px;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 20px;
  }
  .main-title {
    font-family: 'Sora', sans-serif;
    font-size: 58px;
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: #ffffff;
    margin-bottom: 14px;
  }
  .main-title span {
    background: linear-gradient(135deg, #fa742c 0%, #ea442c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .sub-title {
    font-size: 20px;
    color: #c8beb6;
    font-weight: 500;
  }
  
  /* 9 Module Checklist Grid */
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
    margin: 25px 0;
  }
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(26, 19, 15, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 18px;
    padding: 16px 24px;
  }
  .item-left {
    display: flex;
    align-items: center;
    gap: 18px;
  }
  .check {
    font-size: 26px;
    line-height: 1;
  }
  .item-text {
    font-size: 24px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
  .item-num {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 800;
    color: #fa742c;
    background: rgba(250, 116, 44, 0.15);
    border: 1px solid rgba(250, 116, 44, 0.3);
    padding: 4px 12px;
    border-radius: 8px;
    letter-spacing: 0.05em;
  }
  
  /* Footer details */
  .footer {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    padding-top: 25px;
  }
  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-around;
    background: rgba(250, 116, 44, 0.08);
    border: 1px solid rgba(250, 116, 44, 0.25);
    border-radius: 16px;
    padding: 14px 20px;
    margin-bottom: 20px;
  }
  .meta-item {
    font-size: 17px;
    font-weight: 700;
    color: #e8ded7;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .meta-item strong {
    color: #ffffff;
  }
  
  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .brand-text strong {
    font-family: 'Sora', sans-serif;
    font-size: 24px;
    display: block;
    color: #ffffff;
  }
  .brand-text span {
    font-size: 14px;
    color: #fa742c;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  
  .cta-badge {
    background: linear-gradient(135deg, #fa742c 0%, #ea442c 100%);
    color: #ffffff;
    padding: 14px 32px;
    border-radius: 14px;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.02em;
    box-shadow: 0 8px 25px rgba(250, 116, 44, 0.45);
  }
</style>
</head>
<body>
  <div class="glow-top"></div>
  <div class="glow-bottom"></div>

  <div class="card-frame">
    <div class="header">
      <div class="top-pill">⚡ AI SCHOOL RAIPUR • PHYSICAL MASTERCLASS</div>
      <h1 class="main-title">🔥 WHAT WILL YOU <span>LEARN?</span></h1>
      <p class="sub-title">9 Autonomous AI Agent Systems to Automate, Scale & Multiply Revenue</p>
    </div>

    <div class="grid">
      <div class="item">
        <div class="item-left">
          <span class="check">✅</span>
          <span class="item-text">WhatsApp AI Agents</span>
        </div>
        <span class="item-num">AGENT 01</span>
      </div>
      <div class="item">
        <div class="item-left">
          <span class="check">✅</span>
          <span class="item-text">AI Lead Generation Agents</span>
        </div>
        <span class="item-num">AGENT 02</span>
      </div>
      <div class="item">
        <div class="item-left">
          <span class="check">✅</span>
          <span class="item-text">AI Voice Calling Agents</span>
        </div>
        <span class="item-num">AGENT 03</span>
      </div>
      <div class="item">
        <div class="item-left">
          <span class="check">✅</span>
          <span class="item-text">AI Sales & Follow-up Agents</span>
        </div>
        <span class="item-num">AGENT 04</span>
      </div>
      <div class="item">
        <div class="item-left">
          <span class="check">✅</span>
          <span class="item-text">AI Business Management Agents</span>
        </div>
        <span class="item-num">AGENT 05</span>
      </div>
      <div class="item">
        <div class="item-left">
          <span class="check">✅</span>
          <span class="item-text">AI Business Analysis Agents</span>
        </div>
        <span class="item-num">AGENT 06</span>
      </div>
      <div class="item">
        <div class="item-left">
          <span class="check">✅</span>
          <span class="item-text">AI Marketing Agents</span>
        </div>
        <span class="item-num">AGENT 07</span>
      </div>
      <div class="item">
        <div class="item-left">
          <span class="check">✅</span>
          <span class="item-text">AI website Agents</span>
        </div>
        <span class="item-num">AGENT 08</span>
      </div>
      <div class="item">
        <div class="item-left">
          <span class="check">✅</span>
          <span class="item-text">AI Agent Costing & Pricing</span>
        </div>
        <span class="item-num">AGENT 09</span>
      </div>
    </div>

    <div class="footer">
      <div class="meta-row">
        <div class="meta-item">📅 <strong>29th November 2026</strong></div>
        <div class="meta-item">⏰ <strong>10:00 AM – 3:00 PM</strong></div>
        <div class="meta-item">📍 <strong>Vimtara Hall, Raipur</strong></div>
        <div class="meta-item">🥗 <strong>Lunch Included</strong></div>
      </div>
      <div class="bottom-bar">
        <div class="brand-text">
          <strong>Lakshit Sethiya</strong>
          <span>AI & AUTOMATION STRATEGIST • AISCHOOLRAIPUR.COM</span>
        </div>
        <div class="cta-badge">ONLY 60 SEATS REMAINING →</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync(outHtmlPath, html, 'utf8');

console.log('Rendering PNG using Edge headless...');
try {
  const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPngPath}" --window-size=1080,1350 --hide-scrollbars "file:///${outHtmlPath.replace(/\\\\/g, '/')}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('Successfully generated graphic at:', outPngPath);
} catch (e) {
  console.error('Edge screenshot error:', e.message);
} finally {
  try { fs.unlinkSync(outHtmlPath); } catch {}
}
