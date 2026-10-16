(function () {
  var $ = function (id) { return document.getElementById(id); };
  var config = window.BIRTHDAY_CONFIG || {};
  var reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DEFAULT_LETTER = "Dear {n},\n\nHappy Birthday to someone truly special! \uD83C\uDF82\n\nYou are sweet, loyal, my rock, and I'm so grateful to have you in my life.\n\nYou bring so much warmth and sweetness into my life. Every moment with you is precious.\n\nOn your special day, I wish you all the happiness, love, and joy that you deserve. May this year bring you countless beautiful moments and wonderful memories.\n\nHere's to celebrating you today and always! \uD83C\uDF89\n\nWith love and best wishes,\n{f}";
  var DEFAULT_FINAL = "Once again, Happy Birthday {n}! Hope you loved your surprise.";
  var DEFAULT_FINALE_SVG = '<svg width="170" height="130" viewBox="0 0 170 130" aria-hidden="true"><circle cx="55" cy="72" r="38" fill="#fff" stroke="#eee"/><ellipse cx="42" cy="28" rx="9" ry="24" fill="#fff" stroke="#eee"/><ellipse cx="68" cy="28" rx="9" ry="24" fill="#fff" stroke="#eee"/><circle cx="44" cy="70" r="3" fill="#333"/><circle cx="66" cy="70" r="3" fill="#333"/><circle cx="55" cy="80" r="3" fill="#8d6af5"/><circle cx="125" cy="76" r="38" fill="#a9703f"/><circle cx="100" cy="46" r="12" fill="#a9703f"/><circle cx="150" cy="46" r="12" fill="#a9703f"/><circle cx="114" cy="72" r="3" fill="#222"/><circle cx="136" cy="72" r="3" fill="#222"/><ellipse cx="125" cy="84" rx="12" ry="9" fill="#e4c29c"/><circle cx="125" cy="81" r="3" fill="#222"/></svg>';

  var D = {
    name: config.theirName || 'Archi',
    from: config.yourName || 'Your Special Someone',
    msg: '',
    photos: Array.isArray(config.photos) ? config.photos.slice(0, 8) : [],
    captions: Array.isArray(config.photoCaptions) ? config.photoCaptions : []
  };

  if (!D.msg) {
    var letterTemplate = config.letter || DEFAULT_LETTER;
    D.msg = letterTemplate.replace('{n}', D.name).replace('{f}', D.from);
  }

  var cur = 'cover';

  function go(id) {
    var current = document.querySelector('.scene.on');
    var next = $(id);
    cur = id;
    next.classList.add('on');
    if (current && current !== next) {
      current.classList.add('leaving');
      setTimeout(function () { current.classList.remove('on', 'leaving'); }, 550);
    }
    if (id === 's2') mic();
    if (id === 's3') balloons();
    if (id === 's4') bouquet();
    if (id === 's5') cards();
    if (id === 's7') finale();
  }

  /* ---------- ambient background: stars + drifting hearts ---------- */
  function buildSky() {
    if (reduceMotion) return;
    var sky = $('sky'), frag = document.createDocumentFragment();
    for (var i = 0; i < 40; i++) {
      var s = document.createElement('div');
      s.className = 'star';
      var size = 2 + Math.random() * 3;
      s.style.width = s.style.height = size + 'px';
      s.style.left = Math.random() * 100 + '%';
      s.style.top = Math.random() * 70 + '%';
      s.style.animationDelay = (Math.random() * 3) + 's';
      frag.appendChild(s);
    }
    var emoji = ['\uD83D\uDC96', '\uD83D\uDC95', '\u2728'];
    for (var j = 0; j < 9; j++) {
      var d = document.createElement('span');
      d.className = 'drift';
      d.textContent = emoji[j % emoji.length];
      d.style.left = Math.random() * 96 + '%';
      d.style.animationDuration = (14 + Math.random() * 10) + 's';
      d.style.animationDelay = (Math.random() * 12) + 's';
      frag.appendChild(d);
    }
    sky.appendChild(frag);
  }

  /* ---------- confetti canvas ---------- */
  var cv = $('cv'), cx = cv.getContext('2d'), P = [], running = false;
  function size() { cv.width = innerWidth; cv.height = innerHeight; }
  size(); addEventListener('resize', size);
  function burst(n, x, y) {
    var c = ['#8d6af5', '#f9d56e', '#ff9fc3', '#fff', '#6d3ad6', '#9be4d0'];
    for (var i = 0; i < n; i++) {
      P.push({
        x: x == null ? Math.random() * cv.width : x,
        y: y == null ? -10 : y,
        vx: (Math.random() - .5) * (x == null ? 2 : 9),
        vy: x == null ? Math.random() * 2 + 1 : -Math.random() * 8,
        w: 5 + Math.random() * 6, h: 3 + Math.random() * 5,
        r: Math.random() * 6, c: c[i % c.length], l: 300 + Math.random() * 200
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

  /* floating emoji burst (hearts/sparkles rising from a point) */
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

  /* ---------- cover: unwrap the gift ---------- */
  function initText() {
    $('t1').textContent = 'Happy Birthday, ' + D.name;
    $('t2').textContent = 'Blow the candle, ' + D.name;
    $('flags').innerHTML = [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) {
      return '<path d="M' + (20 + i * 32.5) + ' 30 l16 0 l-8 22z" fill="' + ['#c7b8ff', '#f9d56e', '#9be4d0', '#b9a6f0'][i % 4] + '"/>';
    }).join('');
    var finalTemplate = config.finalMessage || DEFAULT_FINAL;
    $('fnl').textContent = finalTemplate.replace('{n}', D.name);
    $('letter').dataset.raw = D.msg;
    $('fin').innerHTML = config.finaleImage
      ? '<img src="' + config.finaleImage + '" alt="">'
      : DEFAULT_FINALE_SVG;
  }
  initText();

  var gift = $('gift');
  gift.addEventListener('click', function () {
    if (gift.classList.contains('open')) return;
    gift.classList.add('open');
    var r = gift.getBoundingClientRect();
    burst(90, r.left + r.width / 2, r.top + 40);
    emojiBurst(8, r.left + r.width / 2, r.top);
    setTimeout(function () { go('s1'); }, 650);
  });

  /* ---------- s1 ---------- */
  $('yes').onclick = function () { burst(80); go('s2'); };
  var no = $('no');
  function dodge() {
    no.style.right = 'auto';
    no.style.left = (Math.random() * 170) + 'px';
    no.style.top = (Math.random() * 14 - 7) + 'px';
  }
  no.onmouseenter = dodge; no.onclick = dodge;
  no.ontouchstart = function (e) { e.preventDefault(); dodge(); };

  /* ---------- s2: candle ---------- */
  var stream = null;
  function out() {
    if ($('cw').classList.contains('out')) return;
    $('cw').classList.add('out');
    $('bl').textContent = 'Make a wish \u2728';
    if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
    burst(120);
    var r = $('cw').getBoundingClientRect();
    emojiBurst(6, r.left + r.width / 2, r.top, ['\u2728', '\uD83D\uDCAB', '\uD83C\uDF20']);
    setTimeout(function () { $('bl').textContent = 'Your wish is on its way... \uD83D\uDCAB'; }, 1200);
    setTimeout(function () { go('s3'); }, 2600);
  }
  $('cw').onclick = out;
  function mic() {
    $('cw').classList.remove('out');
    $('bl').textContent = 'Blow into the mic, or just tap the candle.';
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      stream = s;
      var ac = new (window.AudioContext || window.webkitAudioContext)();
      var node = ac.createMediaStreamSource(s), an = ac.createAnalyser();
      an.fftSize = 256; node.connect(an);
      var buf = new Uint8Array(an.frequencyBinCount), hits = 0;
      (function loop() {
        if (cur !== 's2' || !stream) return;
        an.getByteFrequencyData(buf);
        var m = 0; for (var i = 0; i < 20; i++) m += buf[i]; m /= 20;
        hits = m > 150 ? hits + 1 : Math.max(0, hits - 1);
        if (hits > 10) return out();
        requestAnimationFrame(loop);
      })();
    }).catch(function () { /* mic unavailable, tap still works */ });
  }

  /* ---------- s3: balloons ---------- */
  var WISHES = ['You make my world beautiful', 'Happy Birthday {n} \u2764', 'You are my favorite person', 'Make a wish!'];
  var BALLOON_COLORS = ['#d7c7ff', '#c3f0d9', '#d9d0ff', '#f9d56e'];
  function balloons() {
    var field = $('bfield'), popped = 0;
    field.innerHTML = ''; $('chips').innerHTML = '';
    var positions = [[6, 30], [62, 10], [30, 150], [70, 190]];
    for (var i = 0; i < 4; i++) {
      (function (i) {
        var b = document.createElement('button');
        b.className = 'bal';
        b.setAttribute('aria-label', 'Pop balloon ' + (i + 1));
        b.style.left = positions[i][0] + '%';
        b.style.top = positions[i][1] + 'px';
        b.style.animationDelay = (i * .4) + 's';
        b.innerHTML = '<svg viewBox="0 0 84 120"><ellipse cx="42" cy="44" rx="34" ry="40" fill="' + BALLOON_COLORS[i] + '" opacity=".88"/><ellipse cx="30" cy="30" rx="8" ry="14" fill="#fff" opacity=".5"/><path d="M42 84 l-5 8 h10z" fill="' + BALLOON_COLORS[i] + '"/><path d="M42 92 q-10 12 0 28" stroke="#6d3ad6" fill="none" stroke-width="2"/></svg>';
        b.onclick = function () {
          b.classList.add('pop'); b.disabled = true;
          var r = b.getBoundingClientRect();
          burst(30, r.left + 42, r.top + 40);
          emojiBurst(4, r.left + 42, r.top + 40, ['\u2728', '\uD83C\uDF88']);
          var chip = document.createElement('div');
          chip.className = 'chip';
          chip.textContent = WISHES[i].replace('{n}', D.name);
          $('chips').appendChild(chip);
          popped++;
          if (popped === 4) setTimeout(function () { go('s4'); }, 1800);
        };
        field.appendChild(b);
      })(i);
    }
  }

  /* ---------- s4: bouquet ---------- */
  function bouquet() {
    var parts = [
      '<g stroke="#2f6f46" stroke-linecap="round" fill="none">',
      '<path d="M150 290 L118 214" stroke-width="7"/>',
      '<path d="M150 290 L150 198" stroke-width="7"/>',
      '<path d="M150 290 L182 214" stroke-width="7"/>',
      '<path d="M120 205 L140 170" stroke-width="6"/>',
      '<path d="M180 205 L160 170" stroke-width="6"/>',
      '<path d="M150 220 L132 180" stroke-width="6"/>',
      '</g>',
      '<g fill="#5fb370" opacity=".9">',
      '<path d="M118 215 C106 200, 108 177, 130 178 C136 195, 128 209, 118 215Z"/>',
      '<path d="M182 215 C194 200, 192 177, 170 178 C164 195, 172 209, 182 215Z"/>',
      '<path d="M150 214 C136 198, 135 174, 155 176 C165 192, 161 205, 150 214Z"/>',
      '<path d="M135 170 C123 154, 124 136, 141 136 C149 153, 144 164, 135 170Z"/>',
      '<path d="M165 170 C177 154, 176 136, 159 136 C151 153, 156 164, 165 170Z"/>',
      '</g>'
    ];
    var rose = function (cx, cy, scale, a, b, c) {
      return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + scale + ')">' +
        '<path d="M0 -16 C12 -30, 30 -28, 32 -8 C35 14, 18 28, 0 30 C-18 26,-32 12,-31 -8 C-30 -23,-14 -25,0 -16Z" fill="' + a + '"/>' +
        '<path d="M0 -28 C18 -38, 34 -34, 38 -12 C42 10, 28 22, 6 24 C-11 25,-24 7,-26 -12 C-15 -26,-8 -28,0 -28Z" fill="' + b + '" transform="rotate(20)"/>' +
        '<path d="M0 -26 C-16 -36,-31 -30,-33 -12 C-35 8,-22 22,-4 24 C14 25,27 11,25 -10 C23 -24,12 -25,0 -26Z" fill="' + c + '" transform="rotate(-18)"/>' +
        '<circle cx="0" cy="0" r="8" fill="#4f1b36"/></g>';
    };
    parts.push('<g>');
    parts.push(rose(118, 142, 1.06, '#d53f6b', '#ef6d8f', '#b81d4d'));
    parts.push(rose(150, 124, 1.18, '#e04d7c', '#f29ab0', '#c81d57'));
    parts.push(rose(182, 142, 1.06, '#dd5d88', '#f7a9bd', '#b91f5e'));
    parts.push(rose(132, 176, .92, '#d74e76', '#f4a1b7', '#b9144b'));
    parts.push(rose(168, 176, .92, '#d64d77', '#f4a1b7', '#b9144b'));
    parts.push('</g>');
    $('bq').innerHTML = parts.join('');
    $('bq').classList.remove('bloom');
    $('n4').style.display = 'none';
  }
  $('bq').onclick = function () {
    this.classList.add('bloom');
    var r = this.getBoundingClientRect();
    burst(60, r.left + r.width / 2, r.top + r.height / 2);
    emojiBurst(6, r.left + r.width / 2, r.top + r.height / 3, ['\uD83C\uDF38', '\u2728']);
    $('n4').style.display = 'inline-block';
  };
  $('n4').onclick = function () { go('s5'); };

  /* ---------- s5: photo cards ---------- */
  var DEFAULT_CARDS = [
    ['\uD83C\uDF38', 'Make a wish \uD83C\uDF88'],
    ['\uD83C\uDF82', 'Sweet as ever'],
    ['\uD83D\uDC95', 'My favorite person'],
    ['\u2728', 'Pure magic']
  ];
  function cards() {
    var stack = $('stack');
    stack.innerHTML = ''; $('n5').style.display = 'none';
    var items = D.photos.length
      ? D.photos.map(function (src, i) { return { img: src, t: D.captions[i] || 'A sweet moment' }; })
      : DEFAULT_CARDS.map(function (c) { return { e: c[0], t: c[1] }; });
    var moved = 0;
    items.forEach(function (it, i) {
      var c = document.createElement('div');
      c.className = 'pc';
      c.style.zIndex = items.length - i;
      c.style.transform = 'rotate(' + ((i % 2 ? 1 : -1) * i * 2) + 'deg) translateY(' + i * 4 + 'px)';
      c.innerHTML = '<div class="ph"' + (it.img ? ' style="background-image:url(' + it.img + ')"' : '') + '>' + (it.e || '') + '</div><div class="cp">' + it.t + '</div>';
      var startX = 0, dragging = false;
      c.onpointerdown = function (e) { dragging = true; startX = e.clientX; c.style.transition = 'none'; c.setPointerCapture(e.pointerId); };
      c.onpointermove = function (e) { if (dragging) c.style.transform = 'translateX(' + (e.clientX - startX) + 'px) rotate(' + (e.clientX - startX) / 15 + 'deg)'; };
      c.onpointerup = function (e) {
        if (!dragging) return;
        dragging = false; c.style.transition = '';
        var dx = e.clientX - startX;
        if (Math.abs(dx) > 70) {
          c.style.transform = 'translateX(' + (dx > 0 ? 500 : -500) + 'px) rotate(' + dx / 8 + 'deg)';
          c.style.opacity = 0;
          moved++;
          if (moved >= items.length) $('n5').style.display = 'inline-block';
          burst(14, e.clientX, e.clientY);
        } else {
          c.style.transform = '';
        }
      };
      stack.appendChild(c);
    });
    if (items.length < 2) $('n5').style.display = 'inline-block';
  }
  $('n5').onclick = function () { go('s6'); };

  /* ---------- s6: envelope / letter ---------- */
  function renderLetter(raw) {
    var lines = raw.split('\n');
    var html = lines.map(function (line, i) {
      if (line.trim() === '') return '<div class="ln gap"></div>';
      return '<div class="ln" style="animation-delay:' + (i * 90) + 'ms">' + line + '</div>';
    }).join('');
    $('letter').innerHTML = html;
  }
  $('env').onclick = function () {
    this.classList.add('open');
    $('tap').style.display = 'none';
    setTimeout(function () {
      $('env').style.display = 'none';
      renderLetter($('letter').dataset.raw || '');
      $('letter').classList.add('on');
      setTimeout(function () { $('more').style.display = 'inline-block'; }, 1300);
    }, 1100);
  };
  $('more').onclick = function () { go('s7'); };

  /* ---------- s7: finale ---------- */
  var finaleTimer = null;
  function finale() {
    burst(160);
    emojiBurst(10, innerWidth / 2, innerHeight, ['\u2764', '\uD83C\uDF89', '\u2728']);
    clearInterval(finaleTimer);
    finaleTimer = setInterval(function () {
      if (cur !== 's7') return clearInterval(finaleTimer);
      burst(10);
    }, 900);
  }
  function resetAll() {
    var e = $('env');
    e.style.display = ''; e.classList.remove('open');
    $('tap').style.display = ''; $('letter').classList.remove('on');
    $('more').style.display = 'none';
    $('gift').classList.remove('open');
  }
  $('again').onclick = function () { resetAll(); go('cover'); };

  buildSky();
})();
