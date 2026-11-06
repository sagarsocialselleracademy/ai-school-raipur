const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = 'd:/Lakshit Sethiya Website/ai-school-raipur';
const outHtmlPath = path.join(projectDir, 'temp-card.html');
const outPngPath = path.join(projectDir, 'public/media/what-will-you-learn-card.png');
const artifactPngPath = 'C:/Users/My-hp/.gemini/antigravity/brain/1249e93c-4226-4508-834f-c2a87c30ed8d/what-will-you-learn-card.png';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const modules = [
  { num: '01', title: 'WhatsApp AI Agents', tag: '24/7 Auto-Sales & Support' },
  { num: '02', title: 'AI Lead Generation Agents', tag: 'Automated Prospecting' },
  { num: '03', title: 'AI Voice Calling Agents', tag: 'Human-like Hindi & English' },
  { num: '04', title: 'AI Sales & Follow-up Agents', tag: 'Multi-touch Deal Closing' },
  { num: '05', title: 'AI Business Management Agents', tag: 'Operations & SOP Autopilot' },
  { num: '06', title: 'AI Business Analysis Agents', tag: 'Real-time Financial Insights' },
  { num: '07', title: 'AI Marketing Agents', tag: 'High-Converting Viral Ads' },
  { num: '08', title: 'AI Website Agents', tag: 'Instant Lead Conversion' },
  { num: '09', title: 'AI Agent Costing & Pricing', tag: 'Retainer & Monetization Blueprint' },
];

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Sora:wght@600;700;800&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  body {
    width: 1080px;
    height: 1350px;
    background: #080504;
    font-family: 'Plus Jakarta Sans', sans-serif;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 36px;
    position: relative;
    overflow: hidden;
  }
  
  /* Refined ambient glow */
  .glow-top {
    position: absolute;
    top: -120px;
    left: 50%;
    transform: translateX(-50%);
    width: 820px;
    height: 480px;
    background: radial-gradient(circle, rgba(250, 116, 44, 0.28) 0%, transparent 68%);
    filter: blur(70px);
    pointer-events: none;
  }
  .glow-bottom {
    position: absolute;
    bottom: -140px;
    right: -80px;
    width: 650px;
    height: 520px;
    background: radial-gradient(circle, rgba(234, 68, 44, 0.22) 0%, transparent 70%);
    filter: blur(80px);
    pointer-events: none;
  }
  
  .card-frame {
    width: 1008px;
    height: 1278px;
    background: linear-gradient(180deg, #130e0b 0%, #0a0705 100%);
    border: 1.5px solid rgba(250, 116, 44, 0.4);
    border-radius: 36px;
    padding: 50px 48px 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 35px 90px rgba(0, 0, 0, 0.95), 0 0 50px rgba(250, 116, 44, 0.16);
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
    gap: 10px;
    background: rgba(250, 116, 44, 0.12);
    border: 1px solid rgba(250, 116, 44, 0.45);
    color: #fa742c;
    padding: 8px 22px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }
  .top-pill-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fa742c;
    box-shadow: 0 0 10px #fa742c;
  }
  
  .main-title {
    font-family: 'Sora', sans-serif;
    font-size: 54px;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.1;
    color: #ffffff;
    margin-bottom: 12px;
  }
  .main-title span {
    background: linear-gradient(135deg, #fa742c 0%, #ea442c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .sub-title {
    font-size: 19px;
    color: #b5aba3;
    font-weight: 500;
    max-width: 820px;
    margin: 0 auto;
    line-height: 1.45;
  }
  
  /* 9 Module Rows - NO CHECK EMOJI */
  .grid {
    display: flex;
    flex-direction: column;
    gap: 11px;
    margin: 22px 0 20px;
  }
  
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(22, 17, 14, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 16px;
    padding: 13.5px 22px;
    transition: all 0.2s ease;
  }
  
  .item-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  /* Sleek index badge - NO CHECK EMOJI */
  .item-index {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, rgba(250, 116, 44, 0.22) 0%, rgba(234, 68, 44, 0.1) 100%);
    border: 1px solid rgba(250, 116, 44, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    font-size: 15px;
    font-weight: 800;
    color: #fa742c;
    flex-shrink: 0;
    box-shadow: inset 0 0 12px rgba(250, 116, 44, 0.15);
  }
  
  .item-title {
    font-size: 21.5px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: -0.015em;
  }
  
  .item-tag {
    font-size: 13px;
    font-weight: 700;
    color: #cfc4bb;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.09);
    padding: 6px 14px;
    border-radius: 8px;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }
  
  /* Footer details */
  .footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 22px;
  }
  
  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(250, 116, 44, 0.07);
    border: 1px solid rgba(250, 116, 44, 0.22);
    border-radius: 16px;
    padding: 13px 22px;
    margin-bottom: 18px;
  }
  
  .meta-item {
    font-size: 15.5px;
    font-weight: 600;
    color: #ded4cc;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .meta-item strong {
    color: #ffffff;
    font-weight: 700;
  }
  .meta-item svg {
    color: #fa742c;
    flex-shrink: 0;
  }
  
  .bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .instructor-box strong {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 800;
    display: block;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
  .instructor-box span {
    font-size: 13px;
    color: #fa742c;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  
  .badge-cta {
    background: linear-gradient(135deg, #fa742c 0%, #ea442c 100%);
    color: #ffffff;
    padding: 12px 28px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.03em;
    box-shadow: 0 8px 24px rgba(250, 116, 44, 0.42);
  }
</style>
</head>
<body>
  <div class="glow-top"></div>
  <div class="glow-bottom"></div>

  <div class="card-frame">
    <!-- Header -->
    <div class="header">
      <div class="top-pill">
        <span class="top-pill-dot"></span>
        <span>AI School Raipur • Physical Masterclass</span>
      </div>
      <h1 class="main-title">WHAT WILL YOU <span>LEARN?</span></h1>
      <p class="sub-title">9 Autonomous AI Agent Systems to Automate Operations, Drive Leads & Multiply Revenue</p>
    </div>

    <!-- 9 Modules List - NO CHECK EMOJI -->
    <div class="grid">
      ${modules
        .map(
          (m) => `
      <div class="item">
        <div class="item-left">
          <div class="item-index">${m.num}</div>
          <span class="item-title">${m.title}</span>
        </div>
        <span class="item-tag">${m.tag}</span>
      </div>`
        )
        .join('')}
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="meta-row">
        <div class="meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span><strong>29th November 2026</strong></span>
        </div>
        <div class="meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span><strong>10:00 AM – 3:00 PM</strong></span>
        </div>
        <div class="meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span><strong>Vimtara Hall, Raipur</strong></span>
        </div>
        <div class="meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2v8h-3a4 4 0 0 1-4-4V2" /><path d="M2 12h12" /><path d="M7 2v20" /><path d="M21 15a4 4 0 0 1-4 4h-2" />
          </svg>
          <span><strong>Lunch Included</strong></span>
        </div>
      </div>

      <div class="bottom-bar">
        <div class="instructor-box">
          <strong>Lakshit Sethiya</strong>
          <span>AI & Automation Strategist • aischoolraipur.com</span>
        </div>
        <div class="badge-cta">60 SEATS ONLY • REGISTER NOW →</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync(outHtmlPath, html, 'utf8');

console.log('Rendering high-res PNG using Edge headless...');
try {
  const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPngPath}" --window-size=1080,1350 --hide-scrollbars "file:///${outHtmlPath.replace(/\\\\/g, '/')}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log('Successfully generated graphic at:', outPngPath);
  
  // Also copy to artifact directory for instant viewing in assistant UI
  fs.copyFileSync(outPngPath, artifactPngPath);
  console.log('Copied to artifacts at:', artifactPngPath);
} catch (e) {
  console.error('Edge screenshot error:', e.message);
} finally {
  try { fs.unlinkSync(outHtmlPath); } catch {}
}
