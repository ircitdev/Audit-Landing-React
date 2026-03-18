/* ==========================================
   Voice AI Consultant — СайтЧИСТ! sitechist.ru
   Hybrid Chat + Voice with Gemini Live
   ========================================== */

(function () {
  'use strict';

  // ─── Config ──────────────────────────────
  var PROXY_BASE = 'https://sitechist.ru/gemini-api';
  var PROXY_WS_URL = 'wss://sitechist.ru/ws-gemini';
  // Telegram notifications go through server API (token is server-side only)

  // ─── System Prompt ────────────────────────
  var SYSTEM_INSTRUCTION = [
    'Ты — AI-консультант сервиса «СайтЧИСТ!» (sitechist.ru). Говори по-русски. Будь дружелюбным, профессиональным и кратким.',
    'ВАЖНО: произноси название как «Сайт Чист».',
    '',
    '=== О СЕРВИСЕ ===',
    'Название: СайтЧИСТ! Сайт: sitechist.ru. Телефон: +7 925 148 5560.',
    'Основатель: Денис Солдатов — юрист + senior developer.',
    'Уникальный тандем юриста и разработчика. Ликвидируем 32 уязвимости, за которые силовики блокируют бизнес и арестовывают владельцев.',
    '',
    '=== КЛЮЧЕВЫЕ РИСКИ ===',
    '152-ФЗ — до 18 000 000 ₽ штраф (с 2025)',
    'ч. 1 ст. 20.3 КоАП — арест до 15 суток за экстремистскую символику на сайте',
    'ФЗ №41 — до 6 000 000 ₽ за передачу ПДн на иностранные ресурсы',
    '149-ФЗ — до 1 000 000 ₽',
    '436-ФЗ — до 200 000 ₽ за отсутствие возрастной маркировки',
    '',
    '=== БЕСПЛАТНЫЙ АУДИТ ===',
    'Мы предлагаем БЕСПЛАТНЫЙ экспресс-аудит сайта в Telegram-боте.',
    'Проверяем 32 пункта: 152-ФЗ, КоАП, SSL, SEO, скорость, маркировка рекламы и др.',
    'Результат — персональный отчёт с нарушениями и рисками за 24 часа.',
    'Это полностью бесплатно и ни к чему не обязывает.',
    '',
    '=== ТВОЯ ЕДИНСТВЕННАЯ ЦЕЛЬ ===',
    'Направить посетителя пройти БЕСПЛАТНЫЙ аудит в Telegram-боте — вызови redirectToBot().',
    '',
    'ВОРОНКА РАЗГОВОРА:',
    'Шаг 1. Поздоровайся. Спроси: есть ли у них сайт.',
    'Шаг 2. Если есть — расскажи про риски (штрафы до 18 млн ₽, арест владельца).',
    'Шаг 3. Предложи: "Давайте прямо сейчас бесплатно проверим ваш сайт — это займёт 2 минуты в боте. Хотите?"',
    'Шаг 4. При любом согласии — НЕМЕДЛЕННО вызови redirectToBot().',
    '',
    'ФРАЗА ДЛЯ ПРЕДЛОЖЕНИЯ АУДИТА:',
    '"У нас есть бесплатный аудит сайта — проверяем 32 пункта прямо в Telegram за 2 минуты. Многие владельцы сайтов не знают, что им грозит штраф до 18 миллионов или даже арест. Хотите проверить свой сайт прямо сейчас?"',
    '',
    'ПРАВИЛА:',
    '— Отвечай кратко — максимум 2-3 предложения за раз.',
    '— Говори "назовите", "скажите", а НЕ "введите", "напишите" — это может быть голосовой режим.',
    '— Каждый ответ заканчивай вопросом или предложением пройти аудит.',
    '— НИКОГДА не называй ссылки, адреса ботов, URL в тексте. Только вызывай redirectToBot() и говори "Открываю бота".',
    '— Если человек говорит "да", "хочу", "давайте", "интересно" или любое согласие — СРАЗУ вызови redirectToBot() без лишних слов.',
    '— Если спрашивают о платных тарифах — коротко расскажи, но всё равно предложи начать с бесплатного аудита.',
    '— Если нет сайта — скажи что аудит пока не нужен, но предложи обратиться когда сайт появится.',
  ].join('\n');

  // ─── DOM Elements ─────────────────────────
  var widget = document.getElementById('voiceWidget');
  var toggle = document.getElementById('voiceToggle');
  var panel = document.getElementById('voicePanel');
  var panelClose = document.getElementById('voicePanelClose');
  var chatContainer = document.getElementById('voiceChatMessages');
  var orbContainer = document.getElementById('voiceOrbContainer');
  var orbCanvas = document.getElementById('voiceOrbCanvas');
  var orbLabel = document.getElementById('voiceOrbLabel');
  var textInput = document.getElementById('voiceTextInput');
  var sendBtn = document.getElementById('voiceSendBtn');
  var micBtn = document.getElementById('voiceMicBtn');
  var activeControls = document.getElementById('voiceActiveControls');
  var btnStop = document.getElementById('voiceStop');
  var statusBadge = document.getElementById('voiceStatusBadge');
  var statusText = statusBadge ? statusBadge.querySelector('.voice-status-text') : null;
  var chipBtns = document.querySelectorAll('.voice-chip');

  if (!widget || !toggle) return;

  // ─── State ────────────────────────────────
  var isOpen = false;
  var isActive = false;
  var status = 'idle';
  var audioCtx = null;
  var inputCtx = null;
  var processor = null;
  var micStream = null;
  var session = null;
  var sessionPromise = null;
  var activeConnId = null;
  var shouldReconnect = false;
  var reconnectAttempts = 0;
  var reconnectTimeout = null;
  var nextStartTime = 0;
  var activeSources = [];
  var isSpeaking = false;
  var orbAnimFrame = null;
  var analyserNode = null;
  var firstOpen = true;

  // ─── Chat State ───────────────────────────
  var chatMessages = [];
  var hasGreeted = false;
  var genaiModule = null;
  var aiInstance = null;
  var isTextProcessing = false;
  var CHAT_STORAGE_KEY = 'sitechistAiChatHistory';

  // ─── Lead Data ────────────────────────────
  var leadData = { name: null, phone: null, site: null };
  var voiceLeadSent = false;

  // ─── Audio Utilities ──────────────────────
  function floatTo16BitPCM(input) {
    var output = new Int16Array(input.length);
    for (var i = 0; i < input.length; i++) {
      var s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return new Uint8Array(output.buffer);
  }

  function base64Encode(bytes) {
    var binary = '';
    for (var i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function base64Decode(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  function decodeAudioData(data, ctx, sampleRate, channels) {
    sampleRate = sampleRate || 24000;
    channels = channels || 1;
    var int16 = new Int16Array(data.buffer);
    var frames = int16.length / channels;
    var buf = ctx.createBuffer(channels, frames, sampleRate);
    for (var ch = 0; ch < channels; ch++) {
      var chData = buf.getChannelData(ch);
      for (var i = 0; i < frames; i++) chData[i] = int16[i * channels + ch] / 32768.0;
    }
    return buf;
  }

  // ─── Server API (no tokens on client) ─────
  function sendBotNotification(mode) {
    return fetch('/api/ai-notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: mode }),
    }).catch(function(e) { console.error('[AI notify] error:', e); });
  }

  function sendLeadToTelegram(data) {
    return fetch('/api/ai-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: data.name, phone: data.phone, site: data.site }),
    }).then(function(r) { return r.json(); }).catch(function(e) { console.error('[AI lead] error:', e); });
  }

  // ─── Bot CTA ──────────────────────────────
  var botCtaShown = false;
  function showBotCta() {
    if (botCtaShown) return;
    botCtaShown = true;
    var wrap = document.createElement('div');
    wrap.className = 'voice-msg ai voice-audit-cta';
    var btn = document.createElement('button');
    btn.className = 'voice-audit-btn';
    btn.textContent = '✅ Пройти бесплатный аудит →';
    btn.onclick = function () {
      wrap.remove();
      sendBotNotification('text');
      addMessage('ai', '✅ Открываю бота...', 'text');
      setTimeout(function () { window.open('https://t.me/WebAuditRuBot?start=ai_consultant', '_blank'); }, 400);
    };
    wrap.appendChild(btn);
    chatContainer.appendChild(wrap);
    autoScrollChat();
  }

  // ─── Sanitize AI text ─────────────────────
  function sanitizeAiText(text) {
    return text.replace(/https?:\/\/\S+/gi, '').replace(/t\.me\/\S*/gi, '').replace(/telegram\.me\/\S*/gi, '').replace(/\s{2,}/g, ' ').trim();
  }

  // ─── Chat Messages ────────────────────────
  function addMessage(role, text, source) {
    if (role === 'ai') text = sanitizeAiText(text);
    chatMessages.push({ role: role, text: text, source: source || 'text' });
    saveChatToSession();
    renderMessage(role, text);
    autoScrollChat();
  }

  function renderMessage(role, text) {
    var bubble = document.createElement('div');
    bubble.className = 'voice-msg ' + role;
    bubble.textContent = text;
    chatContainer.appendChild(bubble);
  }

  function showTypingIndicator() {
    var el = document.createElement('div');
    el.className = 'voice-typing'; el.id = 'voiceTypingIndicator';
    el.innerHTML = '<div class="voice-typing-dot"></div><div class="voice-typing-dot"></div><div class="voice-typing-dot"></div>';
    chatContainer.appendChild(el); autoScrollChat();
  }

  function hideTypingIndicator() {
    var el = document.getElementById('voiceTypingIndicator');
    if (el) el.remove();
  }

  function autoScrollChat() {
    requestAnimationFrame(function () { chatContainer.scrollTop = chatContainer.scrollHeight; });
  }

  // ─── Persistence ──────────────────────────
  function saveChatToSession() {
    try { sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatMessages.slice(-50))); } catch (e) {}
  }

  function loadChatFromSession() {
    try {
      var stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        chatMessages = JSON.parse(stored);
        chatMessages.forEach(function (m) { renderMessage(m.role, m.text); });
        autoScrollChat();
        if (chatMessages.length > 0) hasGreeted = true;
      }
    } catch (e) {}
  }
  loadChatFromSession();

  // ─── Status ───────────────────────────────
  function updateStatus(state) {
    widget.classList.remove('listening', 'speaking');
    if (!statusText) return;
    var labels = { online: 'Онлайн', listening: 'Слушаю...', speaking: 'Говорит...', connecting: 'Подключение...', error: 'Ошибка' };
    statusText.textContent = labels[state] || 'Онлайн';
    if (state === 'listening') widget.classList.add('listening');
    if (state === 'speaking') widget.classList.add('speaking');
  }

  // ─── Open Sound ───────────────────────────
  function playOpenSound() {
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator(); var gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
      setTimeout(function () { ctx.close(); }, 300);
    } catch (e) {}
  }

  // ─── Toggle Panel ─────────────────────────
  function syncBodyScroll() {
    if (isOpen && window.innerWidth <= 480) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    isOpen = !isOpen;
    widget.classList.toggle('open', isOpen);
    syncBodyScroll();
    if (isOpen && firstOpen) {
      firstOpen = false; playOpenSound(); hasGreeted = true;
      if (!isActive) connect();
    }
    if (!isOpen && isActive) stopConnection();
  });

  panelClose.addEventListener('click', function () {
    isOpen = false; widget.classList.remove('open'); syncBodyScroll();
    if (isActive) stopConnection();
  });

  // ─── Text Chat ────────────────────────────
  async function sendTextMessage(text) {
    if (!text || !text.trim() || isTextProcessing) return;
    text = text.trim();
    addMessage('user', text, 'text');
    textInput.value = '';
    isTextProcessing = true; sendBtn.disabled = true;
    showTypingIndicator();

    try {
      var context = chatMessages.slice(-10).map(function (m) {
        return (m.role === 'user' ? 'Клиент' : 'Консультант') + ': ' + m.text;
      }).join('\n');

      var reqBody = {
        system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: 'user', parts: [{ text: 'История диалога:\n' + context + '\n\nКлиент: ' + text }] }],
        tools: [{ function_declarations: [
          {
            name: 'submitLead',
            description: 'Отправить заявку клиента. Вызывай только после подтверждения данных.',
            parameters: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING', description: 'Имя клиента' },
                phone: { type: 'STRING', description: 'Телефон клиента' },
                site: { type: 'STRING', description: 'Адрес сайта клиента' },
              },
              required: ['name', 'phone'],
            },
          },
          {
            name: 'redirectToBot',
            description: 'Перенаправить клиента в Telegram-бота @WebAuditRuBot.',
            parameters: { type: 'OBJECT', properties: {} },
          },
        ]}],
      };

      var resp = await fetch(PROXY_BASE + '/v1beta/models/gemini-2.5-flash:generateContent', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqBody),
      });
      var data = await resp.json();
      hideTypingIndicator();

      var parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
      var hasText = false;

      if (parts) {
        for (var i = 0; i < parts.length; i++) {
          var part = parts[i];
          if (part.functionCall && part.functionCall.name === 'redirectToBot') {
            hasText = true; showBotCta();
          }
          if (part.functionCall && part.functionCall.name === 'submitLead') {
            var args = part.functionCall.args || {};
            leadData.name = args.name || leadData.name;
            leadData.phone = args.phone || leadData.phone;
            leadData.site = args.site || leadData.site;
            sendLeadToTelegram(leadData);
            var msg = '✅ Заявка принята!\n👤 ' + (leadData.name || '') + '\n📞 ' + (leadData.phone || '');
            if (leadData.site) msg += '\n🌐 ' + leadData.site;
            msg += '\n\nДенис свяжется с вами в ближайшее время.';
            addMessage('ai', msg, 'text'); hasText = true;
          }
          if (part.text) { addMessage('ai', sanitizeAiText(part.text), 'text'); hasText = true; }
        }
      }
      if (!hasText) {
        var ft = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text;
        if (ft) addMessage('ai', sanitizeAiText(ft), 'text');
      }
    } catch (err) {
      hideTypingIndicator();
      addMessage('ai', 'Извините, произошла ошибка. Попробуйте ещё раз или позвоните: +7 925 148 5560', 'text');
    } finally {
      isTextProcessing = false; sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener('click', function () { sendTextMessage(textInput.value); });
  textInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTextMessage(textInput.value); }
  });
  chipBtns.forEach(function (chip) {
    chip.addEventListener('click', function () { sendTextMessage(chip.getAttribute('data-text')); });
  });

  // ─── Orb Visualizer ───────────────────────
  function startOrbAnimation() {
    var ctx2d = orbCanvas.getContext('2d');
    var w = orbCanvas.width, h = orbCanvas.height;
    var cx = w / 2, cy = h / 2, baseRadius = 25, phase = 0;
    function drawOrb() {
      ctx2d.clearRect(0, 0, w, h); phase += 0.03;
      var level = 0;
      if (analyserNode) {
        var data = new Uint8Array(analyserNode.fftSize);
        analyserNode.getByteTimeDomainData(data);
        var sum = 0;
        for (var i = 0; i < data.length; i++) { var v = (data[i] - 128) / 128; sum += v * v; }
        level = Math.sqrt(sum / data.length);
      }
      var eff = isSpeaking ? 0.3 + Math.sin(phase * 3) * 0.2 : level;
      var radius = baseRadius + eff * 20;
      var glow = ctx2d.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 2);
      glow.addColorStop(0, isSpeaking ? 'rgba(249,115,22,0.15)' : 'rgba(249,115,22,0.1)');
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx2d.fillStyle = glow; ctx2d.fillRect(0, 0, w, h);
      ctx2d.beginPath();
      for (var a = 0; a < Math.PI * 2; a += 0.05) {
        var wave = Math.sin(a * 6 + phase * 2) * eff * 8;
        var r = radius + wave;
        var x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
        if (a === 0) ctx2d.moveTo(x, y); else ctx2d.lineTo(x, y);
      }
      ctx2d.closePath();
      var grad = ctx2d.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, 'rgba(249,115,22,0.8)');
      grad.addColorStop(1, 'rgba(234,88,12,0.4)');
      ctx2d.fillStyle = grad; ctx2d.fill();
      orbAnimFrame = requestAnimationFrame(drawOrb);
    }
    drawOrb();
  }

  function stopOrbAnimation() {
    if (orbAnimFrame) { cancelAnimationFrame(orbAnimFrame); orbAnimFrame = null; }
  }

  // ─── Cleanup ──────────────────────────────
  function cleanupResources() {
    activeConnId = null;
    if (processor) { try { processor.disconnect(); processor.onaudioprocess = null; } catch (e) {} processor = null; }
    if (micStream) { micStream.getTracks().forEach(function (t) { t.stop(); }); micStream = null; }
    if (inputCtx) { try { inputCtx.close(); } catch (e) {} inputCtx = null; }
    if (audioCtx) { try { audioCtx.close(); } catch (e) {} audioCtx = null; }
    if (session) { try { session.close(); } catch (e) {} session = null; }
    activeSources.forEach(function (s) { try { s.stop(); } catch (e) {} });
    activeSources = []; isSpeaking = false; nextStartTime = 0; sessionPromise = null; analyserNode = null;
  }

  function stopConnection() {
    shouldReconnect = false; reconnectAttempts = 0;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    cleanupResources();
    isActive = false; status = 'idle';
    micBtn.classList.remove('active');
    activeControls.style.display = 'none';
    orbContainer.style.display = 'none';
    stopOrbAnimation(); updateStatus('online');
  }

  // ─── Voice Connect ────────────────────────
  async function connect() {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    var connId = Date.now().toString();
    activeConnId = connId;
    status = 'connecting'; isActive = true; shouldReconnect = true;
    leadData = { name: null, phone: null, site: null }; voiceLeadSent = false;

    micBtn.classList.add('active');
    activeControls.style.display = '';
    orbContainer.style.display = '';
    orbLabel.textContent = 'Подключение...';
    updateStatus('connecting');

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      addMessage('ai', 'Нет доступа к микрофону. Используйте текстовый чат или позвоните: +7 925 148 5560', 'voice');
      cleanupResources(); isActive = false; status = 'idle';
      micBtn.classList.remove('active'); activeControls.style.display = 'none';
      orbContainer.style.display = 'none'; updateStatus('online');
      return;
    }
    if (activeConnId !== connId) return;

    var ACClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new ACClass({ sampleRate: 24000 });
    inputCtx = new ACClass({ sampleRate: 16000 });

    session = new WebSocket(PROXY_WS_URL);
    session.binaryType = 'arraybuffer';

    var setupTimer = setTimeout(function () {
      if (activeConnId !== connId) return;
      if (status === 'connecting') session.close();
    }, 12000);

    session.onopen = function () {
      if (activeConnId !== connId) { session.close(); return; }
      var setup = {
        setup: {
          model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
          generation_config: {
            response_modalities: ['AUDIO'],
            speech_config: { voice_config: { prebuilt_voice_config: { voice_name: 'Zephyr' } } },
          },
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          tools: [{ function_declarations: [
            {
              name: 'submitLead',
              description: 'Отправить заявку клиента.',
              parameters: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING', description: 'Имя клиента' },
                  phone: { type: 'STRING', description: 'Телефон клиента' },
                  site: { type: 'STRING', description: 'Адрес сайта клиента' },
                },
                required: ['name', 'phone'],
              },
            },
            {
              name: 'redirectToBot',
              description: 'Перенаправить клиента в Telegram-бота.',
              parameters: { type: 'OBJECT', properties: {} },
            },
          ]}],
        },
      };
      try { session.send(JSON.stringify(setup)); } catch (e) {}
    };

    session.onmessage = function (event) {
      if (activeConnId !== connId) return;
      var msg;
      try { msg = JSON.parse(typeof event.data === 'string' ? event.data : new TextDecoder().decode(event.data)); } catch (e) { return; }

      if (msg.setupComplete) {
        clearTimeout(setupTimer);
        reconnectAttempts = 0;
        orbLabel.textContent = 'Слушаю...'; updateStatus('listening'); startOrbAnimation();
        addMessage('ai', '🎙 Голосовой режим активен. Говорите...', 'voice');

        var source = inputCtx.createMediaStreamSource(micStream);
        analyserNode = inputCtx.createAnalyser(); analyserNode.fftSize = 256;
        source.connect(analyserNode);
        processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = function (e) {
          if (!session || session.readyState !== WebSocket.OPEN) return;
          var pcm = floatTo16BitPCM(e.inputBuffer.getChannelData(0));
          var payload = { realtime_input: { media_chunks: [{ mime_type: 'audio/pcm;rate=16000', data: base64Encode(pcm) }] } };
          try { session.send(JSON.stringify(payload)); } catch (err) {}
        };
        source.connect(processor); processor.connect(inputCtx.destination);

        var greet = { client_content: { turns: [{ role: 'user', parts: [{ text: 'Поприветствуй клиента кратко. Скажи что ты AI-консультант сервиса СайтЧИСТ и спроси, чем можешь помочь.' }] }], turn_complete: true } };
        try { session.send(JSON.stringify(greet)); } catch (e) {}
        return;
      }

      if (msg.serverContent && msg.serverContent.interrupted) {
        activeSources.forEach(function (s) { try { s.stop(); } catch (e) {} });
        activeSources = []; nextStartTime = 0; isSpeaking = false;
        orbLabel.textContent = 'Слушаю...'; updateStatus('listening');
        return;
      }

      // Tool calls
      if (msg.toolCall) {
        var fcs = msg.toolCall.functionCalls;
        if (fcs) {
          for (var j = 0; j < fcs.length; j++) {
            if (fcs[j].name === 'redirectToBot') {
              var toolResp0 = { tool_response: { function_responses: [{ id: fcs[j].id, name: fcs[j].name, response: { result: { status: 'ok' } } }] } };
              try { session.send(JSON.stringify(toolResp0)); } catch (e) {}
              addMessage('ai', '✅ Открываю бота...', 'voice');
              sendBotNotification('voice');
              setTimeout(function () { window.open('https://t.me/WebAuditRuBot?start=ai_consultant', '_blank'); }, 800);
              return;
            }
            if (fcs[j].name === 'submitLead' && !voiceLeadSent) {
              voiceLeadSent = true;
              var fc = fcs[j]; var args = fc.args || {};
              leadData.name = args.name || leadData.name;
              leadData.phone = args.phone || leadData.phone;
              leadData.site = args.site || leadData.site;
              var confirmMsg = '✅ Заявка принята!\n👤 ' + (leadData.name || '') + '\n📞 ' + (leadData.phone || '');
              if (leadData.site) confirmMsg += '\n🌐 ' + leadData.site;
              confirmMsg += '\n\nДенис свяжется с вами в ближайшее время.';
              addMessage('ai', confirmMsg, 'voice');
              sendLeadToTelegram(leadData);
              var toolResp = { tool_response: { function_responses: [{ id: fc.id, name: fc.name, response: { result: { status: 'success' } } }] } };
              try { session.send(JSON.stringify(toolResp)); } catch (e) {}
              return;
            }
          }
        }
      }

      // Audio output
      var parts = msg.serverContent && msg.serverContent.modelTurn && msg.serverContent.modelTurn.parts;
      if (parts) {
        for (var i = 0; i < parts.length; i++) {
          var b64Audio = parts[i].inlineData && parts[i].inlineData.data;
          if (b64Audio && audioCtx) {
            if (!isSpeaking) { isSpeaking = true; orbLabel.textContent = 'Говорит...'; updateStatus('speaking'); }
            var startTime = Math.max(nextStartTime, audioCtx.currentTime);
            var pcmData = base64Decode(b64Audio);
            var audioBuf = decodeAudioData(pcmData, audioCtx, 24000, 1);
            var srcNode = audioCtx.createBufferSource();
            srcNode.buffer = audioBuf; srcNode.connect(audioCtx.destination);
            srcNode.start(startTime); nextStartTime = startTime + audioBuf.duration; activeSources.push(srcNode);
            srcNode.onended = (function (n) {
              return function () {
                var idx = activeSources.indexOf(n); if (idx >= 0) activeSources.splice(idx, 1);
                if (activeSources.length === 0) { isSpeaking = false; orbLabel.textContent = 'Слушаю...'; updateStatus('listening'); }
              };
            })(srcNode);
          }
        }
      }
    };

    session.onclose = function (e) {
      if (!shouldReconnect || e.code === 1000) return;
      cleanupResources();
      if (reconnectAttempts < 3) {
        var delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 5000);
        reconnectAttempts++;
        orbLabel.textContent = 'Переподключение (' + reconnectAttempts + ')...';
        updateStatus('connecting');
        reconnectTimeout = setTimeout(function () { connect(); }, delay);
      } else {
        shouldReconnect = false; isActive = false;
        micBtn.classList.remove('active');
        activeControls.style.display = 'none'; orbContainer.style.display = 'none';
        stopOrbAnimation(); updateStatus('online');
        addMessage('ai', 'Не удалось подключиться. Используйте текстовый чат или позвоните: +7 925 148 5560', 'voice');
      }
    };

    session.onerror = function (e) { console.error('Voice WS error:', e); };
  }

  micBtn.addEventListener('click', function () { if (isActive) stopConnection(); else connect(); });
  btnStop.addEventListener('click', function () { stopConnection(); });

  // ─── Show toggle ──────────────────────────
  if (window.innerWidth > 767) {
    setTimeout(function () { toggle.classList.add('visible'); }, 3000);
  } else {
    setTimeout(function () { toggle.classList.add('visible'); }, 5000);
  }

  // ─── Attention Pulse ──────────────────────
  setInterval(function () {
    if (isOpen) return;
    toggle.classList.add('attention-pulse');
    toggle.addEventListener('animationend', function h() {
      toggle.classList.remove('attention-pulse');
      toggle.removeEventListener('animationend', h);
    });
  }, 15000);

})();
