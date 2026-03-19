import React, { useEffect } from 'react';

export default function VoiceWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/voice-widget.js';
    script.defer = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <>
      <style>{`
        .voice-widget {
          position: fixed; bottom: 5.5rem; right: 1rem;
          z-index: 9998; display: flex; flex-direction: column;
          align-items: flex-end; pointer-events: none;
        }
        .voice-toggle {
          pointer-events: auto; position: relative;
          width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer;
          background: linear-gradient(135deg, #f97316, #ea580c, #f97316);
          background-size: 200% 200%;
          animation: voiceBtnGradient 4s ease infinite;
          color: #fff; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(249,115,22,0.35), 0 0 40px rgba(249,115,22,0.1);
          transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s;
          opacity: 0; transform: scale(0.5); pointer-events: none;
        }
        .voice-toggle.visible { opacity: 1; transform: scale(1); pointer-events: auto; }
        .voice-toggle:hover { transform: scale(1.1); box-shadow: 0 6px 30px rgba(249,115,22,0.5); }
        .voice-toggle:active { transform: scale(0.95); }
        @keyframes voiceBtnGradient { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .voice-toggle::before {
          content: ''; position: absolute; inset: -4px; border-radius: 50%;
          background: linear-gradient(135deg, rgba(249,115,22,0.4), rgba(234,88,12,0.4));
          animation: voicePulseRing 2s ease-in-out infinite; z-index: -1;
        }
        @keyframes voicePulseRing { 0%,100%{transform:scale(1);opacity:0.5} 50%{transform:scale(1.2);opacity:0} }
        .voice-toggle.attention-pulse { animation: voiceAttentionPulse 1.2s ease-in-out; }
        @keyframes voiceAttentionPulse {
          0%{transform:scale(1)} 15%{transform:scale(1.15)} 30%{transform:scale(0.95)}
          45%{transform:scale(1.08)} 100%{transform:scale(1)}
        }
        .voice-widget.open .voice-toggle::before { display: none; }
        .voice-toggle-close { display: none; }
        .voice-widget.open .voice-toggle-mic { display: none; }
        .voice-widget.open .voice-toggle-close { display: block; }
        .voice-toggle-status-dot {
          position: absolute; top: 2px; right: 2px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #22c55e; border: 2px solid #020617;
          z-index: 1; transition: background 0.3s;
        }
        .voice-widget.listening .voice-toggle-status-dot { background: #f97316; }
        .voice-widget.speaking .voice-toggle-status-dot { background: #ea580c; }
        .voice-toggle-tooltip {
          position: absolute; right: calc(100% + 12px);
          background: rgba(15,23,42,0.95); border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px); color: #fff;
          padding: 6px 12px; border-radius: 8px;
          font-size: 0.75rem; font-weight: 600;
          white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.3s;
        }
        .voice-toggle:hover .voice-toggle-tooltip { opacity: 1; }
        .voice-widget.open .voice-toggle-tooltip { display: none; }
        .voice-panel {
          pointer-events: auto; width: 340px; max-height: 500px; margin-bottom: 12px;
          background: rgba(3,0,20,0.96); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; backdrop-filter: blur(30px);
          box-shadow: 0 12px 48px rgba(0,0,0,0.5);
          overflow: hidden; opacity: 0; transform: scale(0.9) translateY(16px);
          pointer-events: none; transition: opacity 0.4s cubic-bezier(0.4,0,0.2,1), transform 0.4s cubic-bezier(0.4,0,0.2,1);
          transform-origin: bottom right; padding: 1rem; display: flex; flex-direction: column;
        }
        .voice-widget.open .voice-panel { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
        @media (min-width: 769px) {
          .voice-widget { bottom: 1.5rem; right: 1.5rem; }
        }
        @media (max-width: 480px) {
          .voice-widget { bottom: 0; right: 0; left: 0; align-items: stretch; }
          .voice-chat-messages { max-height: none !important; flex: 1 !important; overflow-y: auto !important; }
          .voice-widget.open { top: 0; bottom: 0; right: 0; left: 0; flex-direction: column-reverse; justify-content: flex-start; }
          .voice-panel {
            width: 100% !important; max-height: none !important;
            height: 100dvh; border-radius: 0 !important;
            margin-bottom: 0 !important; transform: translateY(100%) !important;
            padding-bottom: max(1rem, env(safe-area-inset-bottom)) !important;
            display: flex !important; flex-direction: column !important;
          }
          .voice-orb-container { flex-shrink: 0; }
          .voice-quick-actions { flex-shrink: 0; }
          .voice-input-row { flex-shrink: 0; }
          .voice-active-controls { flex-shrink: 0; }
          .voice-widget.open .voice-panel { transform: translateY(0) !important; }
          .voice-toggle { position: fixed; bottom: 5.5rem; right: 1rem; }
          .voice-widget.open .voice-toggle { display: none; }
        }
        .voice-panel-close {
          position: absolute; top: 12px; right: 12px; width: 28px; height: 28px;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05); color: #94a3b8;
          font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .voice-panel-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .voice-panel-header { display: flex; align-items: center; gap: 10px; margin-bottom: 0.75rem; padding-right: 2rem; }
        .voice-panel-icon {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ea580c);
          display: flex; align-items: center; justify-content: center; color: #fff; flex-shrink: 0;
        }
        .voice-panel-title { font-size: 0.95rem; font-weight: 700; color: #fff; line-height: 1.2; }
        .voice-panel-sub { font-size: 0.65rem; color: #94a3b8; }
        .voice-status-badge {
          margin-left: auto; display: flex; align-items: center; gap: 5px;
          padding: 3px 8px; border-radius: 20px;
          background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2);
          font-size: 0.6rem; font-weight: 600; color: #22c55e;
          text-transform: uppercase; letter-spacing: 0.05em; white-space: nowrap;
        }
        .voice-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; transition: background 0.3s; }
        .voice-widget.listening .voice-status-badge { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.3); color: #f97316; }
        .voice-widget.listening .voice-status-dot { background: #f97316; }
        .voice-widget.speaking .voice-status-badge { background: rgba(234,88,12,0.1); border-color: rgba(234,88,12,0.3); color: #ea580c; }
        .voice-widget.speaking .voice-status-dot { background: #ea580c; }
        .voice-chat-messages {
          flex: 1; overflow-y: auto; padding: 0.5rem 0;
          display: flex; flex-direction: column; gap: 6px;
          min-height: 80px; max-height: 260px;
          scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
        }
        .voice-msg {
          max-width: 85%; padding: 10px 14px; border-radius: 16px;
          font-size: 0.82rem; line-height: 1.5; word-break: break-word; white-space: pre-wrap;
          animation: voiceMsgIn 0.3s ease;
        }
        @keyframes voiceMsgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .voice-msg.user {
          align-self: flex-end; background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.06); color: #fff; border-bottom-right-radius: 4px;
        }
        .voice-msg.ai {
          align-self: flex-start;
          background: linear-gradient(135deg, rgba(249,115,22,0.1), rgba(234,88,12,0.1));
          border: 1px solid rgba(249,115,22,0.15); color: #fff; border-bottom-left-radius: 4px;
        }
        .voice-typing { align-self: flex-start; display: flex; gap: 4px; padding: 12px 16px;
          background: linear-gradient(135deg, rgba(249,115,22,0.08), rgba(234,88,12,0.08));
          border: 1px solid rgba(249,115,22,0.12); border-radius: 16px; border-bottom-left-radius: 4px; }
        .voice-typing-dot { width: 6px; height: 6px; border-radius: 50%; background: #f97316; animation: voiceTypingBounce 1.4s ease-in-out infinite; }
        .voice-typing-dot:nth-child(2){animation-delay:0.2s} .voice-typing-dot:nth-child(3){animation-delay:0.4s}
        @keyframes voiceTypingBounce { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-6px);opacity:1} }
        .voice-orb-container { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 8px 0; }
        .voice-orb-canvas { width: 80px; height: 80px; }
        .voice-orb-label { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #f97316; }
        .voice-widget.speaking .voice-orb-label { color: #ea580c; }
        .voice-quick-actions { display: flex; gap: 6px; padding: 6px 0; flex-wrap: wrap; }
        .voice-chip {
          padding: 5px 10px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04); color: #94a3b8;
          font-size: 0.72rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap;
        }
        .voice-chip:hover { background: rgba(249,115,22,0.1); border-color: rgba(249,115,22,0.3); color: #f97316; }
        .voice-audit-cta { background: none !important; padding: 4px 0 !important; }
        .voice-audit-btn {
          width: 100%; padding: 10px 14px; border-radius: 10px; border: none; cursor: pointer;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff; font-size: 0.82rem; font-weight: 700; text-align: center; transition: opacity 0.2s;
        }
        .voice-audit-btn:hover { opacity: 0.88; }
        .voice-input-row { display: flex; align-items: center; gap: 6px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.07); }
        .voice-text-input {
          flex: 1; padding: 10px 14px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.3);
          color: #fff; font-size: 0.82rem; outline: none; transition: border-color 0.2s; min-width: 0;
        }
        .voice-text-input::placeholder { color: #64748b; }
        .voice-text-input:focus { border-color: rgba(249,115,22,0.4); }
        .voice-send-btn, .voice-mic-btn {
          width: 38px; height: 38px; border-radius: 50%; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s; flex-shrink: 0;
        }
        .voice-send-btn { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; }
        .voice-send-btn:hover { box-shadow: 0 2px 12px rgba(249,115,22,0.3); transform: scale(1.05); }
        .voice-send-btn:disabled { opacity: 0.4; cursor: default; transform: none; }
        .voice-mic-btn { background: rgba(255,255,255,0.06); color: #94a3b8; border: 1px solid rgba(255,255,255,0.08); }
        .voice-mic-btn:hover { background: rgba(249,115,22,0.15); color: #f97316; border-color: rgba(249,115,22,0.3); }
        .voice-mic-btn.active { background: linear-gradient(135deg, #f97316, #ea580c); color: #fff; border-color: transparent; animation: voiceMicPulse 2s ease-in-out infinite; }
        @keyframes voiceMicPulse { 0%,100%{box-shadow:0 0 0 0 rgba(249,115,22,0.3)} 50%{box-shadow:0 0 0 6px rgba(249,115,22,0)} }
        .voice-active-controls { display: flex; gap: 8px; padding-top: 6px; }
        .voice-btn-stop {
          flex: 1; padding: 8px; border: none; border-radius: 10px;
          font-size: 0.8rem; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          background: #ef4444; color: #fff; transition: opacity 0.2s;
        }
        .voice-btn-stop:hover { opacity: 0.85; }
      `}</style>

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
    </>
  );
}
