import React, { useEffect } from 'react';
import './voice-widget.css';

export default function VoiceWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/voice-widget.js';
    script.defer = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div id="voiceWidget" className="voice-widget">
      <div id="voicePanel" className="voice-panel">
        <button id="voicePanelClose" className="voice-panel-close">&times;</button>
        <div className="voice-panel-header">
          <div className="voice-panel-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </div>
          <div>
            <div className="voice-panel-title">AI-консультант</div>
            <div className="voice-panel-sub">СайтЧИСТ! · sitechist.ru</div>
          </div>
          <div id="voiceStatusBadge" className="voice-status-badge">
            <span className="voice-status-dot"></span>
            <span className="voice-status-text">Онлайн</span>
          </div>
        </div>
        <div id="voiceChatMessages" className="voice-chat-messages"></div>
        <div id="voiceOrbContainer" className="voice-orb-container" style={{display:'none'}}>
          <canvas id="voiceOrbCanvas" className="voice-orb-canvas" width={120} height={120}></canvas>
          <div id="voiceOrbLabel" className="voice-orb-label"></div>
        </div>
        <div className="voice-quick-actions">
          <button className="voice-chip" style={{borderColor:'rgba(249,115,22,0.3)',color:'#fb923c'}} data-text="Хочу бесплатный аудит сайта">🛡️ Бесплатный аудит</button>
          <button className="voice-chip" data-text="Какие риски есть у моего сайта?">Риски сайта</button>
          <button className="voice-chip" data-text="Какие штрафы грозят за нарушения?">Штрафы</button>
          <button className="voice-chip" data-text="Сколько стоит полный аудит?">Тарифы</button>
        </div>
        <div className="voice-input-row">
          <input id="voiceTextInput" className="voice-text-input" type="text" placeholder="Напишите вопрос..." autoComplete="off" />
          <button id="voiceSendBtn" className="voice-send-btn" title="Отправить">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
          <button id="voiceMicBtn" className="voice-mic-btn" title="Голосовой режим">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
          </button>
        </div>
        <div id="voiceActiveControls" className="voice-active-controls" style={{display:'none'}}>
          <button id="voiceStop" className="voice-btn-stop">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
            <span>Завершить</span>
          </button>
        </div>
      </div>
      <button id="voiceToggle" className="voice-toggle">
        <span className="voice-toggle-status-dot"></span>
        <svg className="voice-toggle-mic" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
        <svg className="voice-toggle-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <span className="voice-toggle-tooltip">AI-консультант</span>
      </button>
    </div>
  );
}
