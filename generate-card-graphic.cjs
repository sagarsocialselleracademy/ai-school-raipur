const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = 'd:/Lakshit Sethiya Website/ai-school-raipur';
const outHtmlPath = path.join(projectDir, 'temp-card.html');
const outPngPath = path.join(projectDir, 'public/media/what-will-you-learn-card.png');
const artifactPngPath = 'C:/Users/My-hp/.gemini/antigravity/brain/1249e93c-4226-4508-834f-c2a87c30ed8d/what-will-you-learn-card.png';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const topics = [
  { num: '01', title: 'Prompting', tag: 'Prompt Engineering & Frameworks' },
  { num: '02', title: 'Content Creation', tag: 'AI Copywriting & Viral Scripts' },
  { num: '03', title: 'Designing', tag: 'Creatives, Branding & Visual Assets' },
  { num: '04', title: 'Video Editing', tag: 'Fast Cuts, Captions & Auto B-Roll' },
  { num: '05', title: 'Video Making', tag: 'AI Avatars, Voice Cloning & Gen' },
  { num: '06', title: 'WhatsApp Automation', tag: '24/7 Chatbots & Auto Broadcasts' },
  { num: '07', title: 'AI Calling', tag: 'Human-like Hindi & English Callers' },
  { num: '08', title: 'AI Agents', tag: 'Autonomous Multi-Agent Systems' },
  { num: '09', title: 'Instagram Automation', tag: 'Auto DMs, Comment & Story Funnels' },
  { num: '10', title: 'Lead Generation', tag: 'High-Converting Client Funnels' },
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
    padding: 34px;
    position: relative;
    overflow: hidden;
  }
  
  /* Ambient glowing gradients */
  .glow-top {
    position: absolute;
    top: -140px;
    left: 50%;
    transform: translateX(-50%);
    width: 860px;
    height: 500px;
    background: radial-gradient(circle, rgba(250, 116, 44, 0.3) 0%, transparent 68%);
    filter: blur(80px);
    pointer-events: none;
  }
  .glow-bottom {
    position: absolute;
    bottom: -150px;
    right: -90px;
    width: 700px;
    height: 540px;
    background: radial-gradient(circle, rgba(234, 68, 44, 0.24) 0%, transparent 70%);
    filter: blur(85px);
    pointer-events: none;
  }
  
  .card-frame {
    width: 1012px;
    height: 1282px;
    background: linear-gradient(180deg, #140e0b 0%, #0a0705 100%);
    border: 1.5px solid rgba(250, 116, 44, 0.42);
    border-radius: 36px;
    padding: 52px 48px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 35px 95px rgba(0, 0, 0, 0.95), 0 0 50px rgba(250, 116, 44, 0.16);
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
    padding: 10px 28px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    margin-bottom: 18px;
  }
  .top-pill-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #fa742c;
    box-shadow: 0 0 10px #fa742c;
  }
  
  .main-title {
    font-family: 'Sora', sans-serif;
    font-size: 56px;
    font-weight: 800;
    letter-spacing: -0.025em;
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
    color: #b8ada4;
    font-weight: 500;
    max-width: 840px;
    margin: 0 auto;
    line-height: 1.45;
  }
  
  /* 2-Column Grid for 10 Topics - NO CHECK EMOJIS */
  .topics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px 22px;
    margin: 28px 0 24px;
  }
  
  .topic-card {
    display: flex;
    align-items: center;
    gap: 18px;
    background: rgba(24, 18, 14, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 20px 24px;
    position: relative;
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45);
  }
  
  /* Sleek index badge */
  .topic-index {
    width: 50px;
    height: 50px;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(250, 116, 44, 0.25) 0%, rgba(234, 68, 44, 0.12) 100%);
    border: 1.5px solid rgba(250, 116, 44, 0.55);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    font-size: 19px;
    font-weight: 800;
    color: #fa742c;
    flex-shrink: 0;
    box-shadow: inset 0 0 16px rgba(250, 116, 44, 0.25);
  }
  
  .topic-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  
  .topic-title {
    font-size: 23px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.015em;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .topic-tag {
    font-size: 13.5px;
    font-weight: 600;
    color: #cfc4ba;
    letter-spacing: 0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Footer details */
  .footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding-top: 24px;
  }
  
  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(250, 116, 44, 0.08);
    border: 1px solid rgba(250, 116, 44, 0.25);
    border-radius: 18px;
    padding: 14px 22px;
    margin-bottom: 20px;
  }
  
  .meta-item {
    font-size: 15.5px;
    font-weight: 600;
    color: #ded4cc;
    display: flex;
    align-items: center;
    gap: 9px;
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
    font-size: 23px;
    font-weight: 800;
    display: block;
    color: #ffffff;
    letter-spacing: -0.01em;
  }
  .instructor-box span {
    font-size: 13.5px;
    color: #fa742c;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  
  .badge-cta {
    background: linear-gradient(135deg, #fa742c 0%, #ea442c 100%);
    color: #ffffff;
    padding: 14px 28px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.03em;
    box-shadow: 0 8px 26px rgba(250, 116, 44, 0.45);
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
      <h1 class="main-title">TOPICS TO BE <span>COVERED</span></h1>
      <p class="sub-title">10 Practical AI & Automation Systems to Scale Your Business & Multi-fold Productivity</p>
    </div>

    <!-- 10 Topics Grid - NO CHECK EMOJIS -->
    <div class="topics-grid">
      ${topics
        .map(
          (t) => `
      <div class="topic-card">
        <div class="topic-index">${t.num}</div>
        <div class="topic-info">
          <div class="topic-title">${t.title}</div>
          <div class="topic-tag">${t.tag}</div>
        </div>
      </div>`
        )
        .join('')}
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="meta-row">
        <div class="meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span><strong>29th November 2026</strong></span>
        </div>
        <div class="meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
          </svg>
          <span><strong>10:00 AM – 3:00 PM</strong></span>
        </div>
        <div class="meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <span><strong>Vimtara Hall, Raipur</strong></span>
        </div>
        <div class="meta-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
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

console.log('Rendering high-res 10-topics PNG using Edge headless...');
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
