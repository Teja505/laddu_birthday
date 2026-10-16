(function () {
  var $ = function (id) { return document.getElementById(id); };
  var config = window.BIRTHDAY_CONFIG || {};
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DEFAULT_LETTER = "I wanted to make you something small, but with a lot of love inside it.\n\nYou make ordinary days feel softer and brighter just by being in them. Thank you for being exactly who you are.\n\nWhatever you wished for tonight, I hope it finds its way to you.\n\nHappy birthday. I'm so glad you exist.";
  var DEFAULT_WISH = "May this year bring you countless little reasons to smile.";

  var D = {
    name: config.theirName || 'Archi',
    from: config.yourName || 'Your Special Someone',
    wish: config.wish || DEFAULT_WISH,
    msg: (config.letter || DEFAULT_LETTER).replace('{n}', config.theirName || 'Archi').replace('{f}', config.yourName || 'Your Special Someone')
  };

  /* ---------- default illustrations (used when no config image is set) ---------- */
  var DEFAULT_ENVELOPE_SVG = '<svg viewBox="0 0 300 200" aria-hidden="true">' +
    '<rect x="12" y="30" width="276" height="160" rx="12" fill="#efd6a8" stroke="#d1b07a" stroke-width="2"/>' +
    '<path d="M12 42 L150 135 L288 42" fill="none" stroke="#d1b07a" stroke-width="2"/>' +
    '<path d="M12 190 L120 110 M288 190 L180 110" stroke="#d1b07a" stroke-width="2"/>' +
    '<path d="M12 42 Q150 -10 288 42 L150 135Z" fill="#f4e0b8" stroke="#d1b07a" stroke-width="2"/>' +
    '<path d="M150 112 q-30 -30 -48 -10 q10 22 48 10 q38 12 48 -10 q-18 -20 -48 10z" fill="#a98ad0"/>' +
    '<path d="M150 128 q-8 14 -20 30 M150 128 q8 14 20 30" stroke="#a98ad0" stroke-width="9" stroke-linecap="round"/>' +
    '<path d="M150 140 c-22 -18 -14 -36 0 -26 c14 -10 22 8 0 26z" fill="#d9406b" stroke="#fff" stroke-width="2"/>' +
    '<g stroke="#7a9a5a" fill="none" stroke-width="2"><path d="M40 170 q10 -40 8 -60"/><path d="M262 170 q-10 -40 -8 -60"/></g>' +
    '<circle cx="48" cy="108" r="7" fill="#f08aa6"/><circle cx="254" cy="108" r="7" fill="#f08aa6"/></svg>';

  var DEFAULT_CAKE_SVG = '<svg viewBox="0 0 300 260" aria-hidden="true">' +
    '<ellipse cx="150" cy="238" rx="130" ry="14" fill="#e7e1e6"/>' +
    '<rect x="40" y="170" width="220" height="62" rx="10" fill="#f8e7dc"/><path d="M40 176 h220 v14 q-10 14 -20 0 q-10 16 -22 0 q-10 14 -22 0 q-12 16 -24 0 q-12 14 -24 0 q-12 16 -24 0 q-12 14 -22 0 q-14 16 -22 0z" fill="#e85d8a"/>' +
    '<rect x="62" y="116" width="176" height="56" rx="10" fill="#f6e6a0"/><rect x="62" y="150" width="176" height="14" fill="#c9b8f0"/><path d="M62 122 h176 v12 q-10 12 -22 0 q-12 14 -24 0 q-12 12 -24 0 q-12 14 -24 0 q-12 12 -24 0 q-12 14 -22 0 q-10 12 -16 0z" fill="#e85d8a"/>' +
    '<rect x="88" y="70" width="124" height="48" rx="10" fill="#fbe9ec"/><path d="M88 76 h124 v12 q-8 12 -18 0 q-10 14 -20 0 q-10 12 -20 0 q-10 14 -20 0 q-10 12 -18 0 q-8 10 -12 0z" fill="#e85d8a"/>' +
    '<circle cx="120" cy="62" r="7" fill="#c8202f"/><circle cx="180" cy="62" r="7" fill="#c8202f"/>' +
    '<rect x="116" y="38" width="7" height="22" rx="2" fill="#f6a1b8"/><rect x="177" y="38" width="7" height="22" rx="2" fill="#f6a1b8"/>' +
    '<g class="flame"><path d="M119.5 20 q7 10 0 18 q-7 -8 0 -18z" fill="#ffb347"/><path d="M180.5 20 q7 10 0 18 q-7 -8 0 -18z" fill="#ffb347"/></g></svg>';

  var DEFAULT_CAKE_ICON_SVG = '<svg viewBox="0 0 160 190" aria-hidden="true">' +
    '<ellipse cx="80" cy="176" rx="64" ry="9" fill="#e7e1e6"/><rect x="22" y="110" width="116" height="62" rx="10" fill="#f08aa6"/>' +
    '<rect x="34" y="70" width="92" height="42" rx="9" fill="#fbe9ec"/><path d="M34 76 h92 v10 q-8 10 -16 0 q-8 12 -16 0 q-8 10 -16 0 q-8 12 -16 0 q-8 10 -12 0z" fill="#e85d8a"/>' +
    '<circle cx="62" cy="62" r="7" fill="#c8202f"/><circle cx="98" cy="62" r="7" fill="#c8202f"/>' +
    '<rect x="76" y="40" width="7" height="26" rx="2" fill="#f6a1b8"/><g class="flame"><path d="M79.5 20 q7 10 0 18 q-7 -8 0 -18z" fill="#ffb347"/></g></svg>';

  function cakeArt(variant) {
    if (config.cakeImage) return '<img src="' + config.cakeImage + '" alt="">';
    return variant === 'icon' ? DEFAULT_CAKE_ICON_SVG : DEFAULT_CAKE_SVG;
  }

  function wishArt(stage) {
    var src = stage === 'made' ? (config.wishMadeImage || config.wishImage) : config.wishImage;
    return src ? '<img src="' + src + '" alt="">' : bear({});
  }

  function bear(opts) {
    if (config.mascotImage) return '<img src="' + config.mascotImage + '" alt="">';
    opts = opts || {};
    return '<svg viewBox="0 0 160 190" aria-hidden="true"><ellipse cx="80" cy="140" rx="46" ry="44" fill="#e0a45c"/><ellipse cx="80" cy="150" rx="28" ry="28" fill="#f5d9a8"/>' +
      '<circle cx="42" cy="58" r="17" fill="#e0a45c"/><circle cx="118" cy="58" r="17" fill="#e0a45c"/><circle cx="42" cy="58" r="8" fill="#f2b9a0"/><circle cx="118" cy="58" r="8" fill="#f2b9a0"/>' +
      '<circle cx="80" cy="82" r="44" fill="#e8b068"/><ellipse cx="80" cy="98" rx="20" ry="15" fill="#f5d9a8"/><ellipse cx="80" cy="92" rx="6" ry="4.5" fill="#4a2c2c"/>' +
      (opts.sleep
        ? '<path d="M56 78 q8 6 16 0 M88 78 q8 6 16 0" stroke="#4a2c2c" stroke-width="3" fill="none" stroke-linecap="round"/>'
        : '<circle cx="62" cy="76" r="5" fill="#4a2c2c"/><circle cx="98" cy="76" r="5" fill="#4a2c2c"/><circle cx="64" cy="74" r="1.8" fill="#fff"/><circle cx="100" cy="74" r="1.8" fill="#fff"/>') +
      '<path d="M72 102 q8 8 16 0" stroke="#4a2c2c" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="52" cy="92" r="7" fill="#f4a3a3" opacity=".7"/><circle cx="108" cy="92" r="7" fill="#f4a3a3" opacity=".7"/>' +
      '<path d="M62 42 L80 6 L98 42z" fill="#a98ad0"/><circle cx="80" cy="6" r="6" fill="#f9d56e"/><path d="M68 34 h24" stroke="#fff" stroke-width="3"/>' +
      (opts.balloon
        ? '<path d="M122 120 Q140 80 132 40" stroke="#b8284f" stroke-width="2" fill="none"/><ellipse cx="132" cy="28" rx="16" ry="20" fill="#f08aa6"/><ellipse cx="127" cy="22" rx="4" ry="7" fill="#fff" opacity=".5"/><circle cx="118" cy="128" r="11" fill="#e8b068"/>'
        : '<circle cx="46" cy="124" r="11" fill="#e8b068"/><circle cx="114" cy="124" r="11" fill="#e8b068"/>') +
      '</svg>';
  }

  $('sleepy').innerHTML = bear({ sleep: 1 });
  $('bearF').innerHTML = bear({ balloon: 1 });
  $('envPeek').innerHTML = config.envelopePeekImage
    ? '<img class="env-peek-photo" src="' + config.envelopePeekImage + '" alt="">'
    : '<div class="env-bear">' + bear({}) + '</div><div class="env-card">This is for you, <em>' + D.name + '</em>!</div>';
  $('env').innerHTML = config.envelopeImage ? '<img src="' + config.envelopeImage + '" alt="">' : DEFAULT_ENVELOPE_SVG;
  $('hl').innerHTML = cakeArt('full');
  $('hr').innerHTML = cakeArt('full');
  $('cakeB').innerHTML = cakeArt('icon');

  /* ---------- scene switching with crossfade ---------- */
  var cur = 's1';
  var activeScene = $('s1');
  function go(id) {
    var next = $(id);
    var prev = activeScene;
    cur = id;
    activeScene = next;
    next.classList.add('on');
    if (prev && prev !== next) {
      prev.classList.add('leaving');
      setTimeout(function () { prev.classList.remove('on', 'leaving'); }, 550);
    }
    if (id === 's1') {
      playEnvelopePeek();
      $('sleepy').classList.add('hide');
    } else {
      $('sleepy').classList.remove('hide');
    }
    if (id === 's3') startMic(); else stopMic();
  }

  function playEnvelopePeek() {
    var el = $('envPeek');
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  /* ---------- bunting flags + night sky stars ---------- */
  var flagColors = ['#f6c76a', '#9ed8c9', '#f4b6c8', '#b4b0ee'];
  var flags = '';
  for (var i = 0; i < 10; i++) {
    flags += '<path d="M' + (i * 40 + 4) + ' ' + (14 + Math.sin(i * .63) * 10 + 8) + ' l14 0 l-7 24z" fill="' + flagColors[i % 4] + '"/>';
  }
  $('flags').innerHTML = flags;

  if (!reduceMotion) {
    var stars = '';
    for (var j = 0; j < 40; j++) {
      stars += '<i style="left:' + (Math.random() * 100) + '%;top:' + (Math.random() * 100) + '%;animation-delay:' + (Math.random() * 3) + 's"></i>';
    }
    $('stars').innerHTML = stars;
  }

  /* ---------- confetti canvas ---------- */
  var cv = $('cv'), cx = cv.getContext('2d'), P = [], running = false;
  function size() { cv.width = innerWidth; cv.height = innerHeight; }
  size(); addEventListener('resize', size); addEventListener('orientationchange', size);
  function burst(n, x, y) {
    var c = ['#e0486f', '#f9d56e', '#f7a8b8', '#fff', '#a98ad0', '#8fd3c7'];
    for (var k = 0; k < n; k++) {
      P.push({
        x: x == null ? Math.random() * cv.width : x,
        y: y == null ? -10 : y,
        vx: (Math.random() - .5) * (x == null ? 2 : 10),
        vy: x == null ? Math.random() * 2 + 1 : -Math.random() * 9,
        w: 5 + Math.random() * 6, h: 3 + Math.random() * 5,
        r: Math.random() * 6, c: c[k % c.length], l: 300 + Math.random() * 200
      });
    }
    if (!running) { running = true; tick(); }
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    P = P.filter(function (p) { return p.l > 0 && p.y < cv.height + 20; });
    P.forEach(function (p) {
      p.x += p.vx; p.y += p.vy; p.vy += .12; p.r += .1; p.l--;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
      cx.fillStyle = p.c; cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cx.restore();
    });
    if (P.length) requestAnimationFrame(tick); else running = false;
  }

  function emojiBurst(n, x, y, emojis) {
    emojis = emojis || ['\u2764', '\u2728', '\uD83D\uDC96'];
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.textContent = emojis[i % emojis.length];
      s.style.cssText = 'position:fixed;left:' + (x + (Math.random() * 60 - 30)) + 'px;top:' + y + 'px;' +
        'font-size:' + (1 + Math.random()) + 'rem;pointer-events:none;z-index:6;' +
        'transition:transform 1.1s ease-out,opacity 1.1s ease-out;opacity:1';
      document.body.appendChild(s);
      (function (el) {
        requestAnimationFrame(function () {
          el.style.transform = 'translateY(-' + (90 + Math.random() * 60) + 'px)';
          el.style.opacity = '0';
        });
        setTimeout(function () { el.remove(); }, 1200);
      })(s);
    }
  }

  /* ---------- flow ---------- */
  var letterTimer = null;
  function setup() {
    document.body.className = '';
    $('ln').textContent = D.name;
    $('fn').textContent = D.name;
    $('wish').textContent = D.wish;
    $('sig').textContent = '\u2014 with love, ' + D.from;
    $('cakebox').classList.remove('cut');
    $('cakeStage').classList.remove('blown');
    $('cutAnyway').classList.add('hide');
    $('b3').classList.add('hide');
    $('c-tag').textContent = 'Cake time';
    $('c-h').textContent = 'Blow out the candles \u2728';
    $('c-p').textContent = 'Tap the cake, or blow into your mic.';
    blown = false;
    done = false;
    $('w-h').textContent = 'Close your eyes...';
    $('w-p').textContent = 'Make a little wish for the year ahead.';
    $('bearA').innerHTML = wishArt('before');
    $('b4').classList.remove('hide');
    $('w-loading').classList.add('hide');
    clearInterval(letterTimer);
    $('paper').textContent = '';
    $('b5').classList.add('hide');
    $('wishstar').classList.remove('go');
    $('b2').disabled = false;
    $('b4').disabled = false;
    $('noBtn').style.left = ''; $('noBtn').style.right = '0'; $('noBtn').style.top = '';
    $('bgm').pause(); $('bgm').currentTime = 0;
  }
  setup();
  playEnvelopePeek();

  $('b1').onclick = function () { document.body.className = 'night'; go('night'); };
  var noBtn = $('noBtn');
  function dodgeNo() {
    noBtn.style.right = 'auto';
    noBtn.style.left = (Math.random() * 170) + 'px';
    noBtn.style.top = (Math.random() * 14 - 7) + 'px';
  }
  noBtn.onmouseenter = dodgeNo;
  noBtn.onclick = dodgeNo;
  noBtn.ontouchstart = function (e) { e.preventDefault(); dodgeNo(); };

  $('b2').onclick = function () {
    document.body.className = 'glow';
    burst(40);
    this.disabled = true;
    setTimeout(function () { document.body.className = ''; go('s3'); }, 1800);
  };

  /* blow out the candles, then swipe down to cut the cake */
  var cakebox = $('cakebox'), knife = $('knife'), cakeStage = $('cakeStage'), startY = null, done = false, blown = false;
  var micStream = null;
  function startMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      micStream = s;
      var ac = new (window.AudioContext || window.webkitAudioContext)();
      var node = ac.createMediaStreamSource(s), an = ac.createAnalyser();
      an.fftSize = 256; node.connect(an);
      var buf = new Uint8Array(an.frequencyBinCount), hits = 0;
      (function loop() {
        if (blown || cur !== 's3' || !micStream) return;
        an.getByteFrequencyData(buf);
        var m = 0; for (var i = 0; i < 20; i++) m += buf[i]; m /= 20;
        hits = m > 150 ? hits + 1 : Math.max(0, hits - 1);
        if (hits > 10) return blowOut();
        requestAnimationFrame(loop);
      })();
    }).catch(function () { /* mic unavailable, tap still works */ });
  }
  function stopMic() {
    if (micStream) { micStream.getTracks().forEach(function (t) { t.stop(); }); micStream = null; }
  }
  function blowOut() {
    if (blown) return;
    blown = true;
    stopMic();
    cakeStage.classList.add('blown');
    $('bgm').play().catch(function () { /* autoplay blocked, ignore */ });
    burst(70);
    var r = cakebox.getBoundingClientRect();
    emojiBurst(5, r.left + r.width / 2, r.top, ['\u2728', '\uD83D\uDCA8']);
    $('c-h').textContent = 'Yehhhh!!! \uD83C\uDF89';
    $('c-p').textContent = '';
    setTimeout(function () {
      $('c-h').textContent = 'Now make the first cut \u2728';
      $('c-p').textContent = 'Swipe down across the cake, top to bottom.';
      $('cutAnyway').classList.remove('hide');
    }, 1100);
  }
  cakebox.onpointerdown = function (e) {
    if (!blown) return blowOut();
    if (done) return;
    startY = e.clientY; cakebox.setPointerCapture(e.pointerId);
  };
  cakebox.onpointermove = function (e) {
    if (!blown || startY == null) return;
    var h = cakebox.getBoundingClientRect().height;
    var d = Math.max(0, Math.min(h, e.clientY - startY));
    knife.style.height = d + 'px';
    if (d > h * .6) cut();
  };
  cakebox.onpointerup = function () { if (blown && !done) knife.style.height = '0'; startY = null; };
  cakebox.onkeydown = function (e) { if (e.key === 'Enter' || e.key === ' ') { if (!blown) blowOut(); else cut(); } };
  function cut() {
    if (!blown || done) return;
    done = true; startY = null;
    cakebox.classList.add('cut');
    knife.style.height = '0';
    burst(90);
    var r = cakebox.getBoundingClientRect();
    emojiBurst(5, r.left + r.width / 2, r.top + r.height / 2, ['\u2728', '\uD83C\uDF82']);
    $('c-tag').textContent = 'Cake time \uD83C\uDF89';
    $('c-h').textContent = 'You did it! \uD83C\uDF8A';
    $('c-p').textContent = 'The first slice is always the sweetest one.';
    $('cutAnyway').classList.add('hide');
    $('b3').classList.remove('hide');
  }
  $('cutAnyway').onclick = function () { cut(); };
  $('b3').onclick = function () { done = false; go('s4'); };

  $('b4').onclick = function () {
    $('w-h').textContent = 'Your wish is on its way \u2728';
    $('w-p').textContent = 'Somewhere, a tiny star just said yes.';
    $('bearA').innerHTML = wishArt('made');
    $('wishstar').classList.add('go');
    burst(60);
    this.classList.add('hide');
    $('w-loading').classList.remove('hide');
    setTimeout(function () { go('s5'); typeLetter(D.msg); }, 2600);
  };

  function typeLetter(raw) {
    var p = $('paper'), i = 0;
    p.textContent = '';
    clearInterval(letterTimer);
    letterTimer = setInterval(function () {
      i++;
      p.textContent = raw.slice(0, i);
      p.scrollTop = p.scrollHeight;
      if (i >= raw.length) {
        clearInterval(letterTimer);
        $('b5').classList.remove('hide');
      }
    }, 28);
    p.onclick = function () {
      clearInterval(letterTimer);
      p.textContent = raw;
      $('b5').classList.remove('hide');
    };
  }
  $('b5').onclick = function () {
    document.body.className = 'pink';
    go('s6');
    burst(160);
    emojiBurst(10, innerWidth / 2, innerHeight, ['\u2764', '\uD83C\uDF89', '\u2728']);
  };

  $('again').onclick = function () { setup(); go('s1'); };
})();
