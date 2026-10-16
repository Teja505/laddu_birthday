import { useEffect, useMemo, useRef, useState } from 'react';
import { CONFIG } from './config.js';
import { asset } from './utils/asset.js';
import { DEFAULT_ENVELOPE_SVG, DEFAULT_CAKE_SVG, DEFAULT_CAKE_ICON_SVG, bearSvg } from './illustrations.js';

const DEFAULT_LETTER =
  "I wanted to make you something small, but with a lot of love inside it.\n\nYou make ordinary days feel softer and brighter just by being in them. Thank you for being exactly who you are.\n\nWhatever you wished for tonight, I hope it finds its way to you.\n\nHappy birthday. I'm so glad you exist.";
const DEFAULT_WISH = 'May this year bring you countless little reasons to smile.';

const BALLOON_COLORS = ['#d7c7ff', '#c3f0d9', '#d9d0ff', '#f9d56e', '#f4b6c8', '#9ed8c9'];
const DEFAULT_BALLOON_IMAGES = ['photos/teja.png', 'photos/close your eyes .png', 'photos/made a wish.png', 'photos/cute laddu.png'];
const BALLOON_COUNT = 6;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function resolved(path) {
  return path ? asset(path) : '';
}

function cakeArt(variant) {
  if (CONFIG.cakeImage) return `<img src="${resolved(CONFIG.cakeImage)}" alt="">`;
  return variant === 'icon' ? DEFAULT_CAKE_ICON_SVG : DEFAULT_CAKE_SVG;
}

function wishArtHtml(stage) {
  const src = stage === 'made' ? (CONFIG.wishMadeImage || CONFIG.wishImage) : CONFIG.wishImage;
  return src ? `<img src="${resolved(src)}" alt="">` : bearSvg({}, resolved(CONFIG.mascotImage));
}

export default function App() {
  const D = useMemo(() => {
    const name = CONFIG.theirName || 'Archi';
    const from = CONFIG.yourName || 'Your Special Someone';
    return {
      name,
      from,
      wish: CONFIG.wish || DEFAULT_WISH,
      msg: (CONFIG.letter || DEFAULT_LETTER).replace('{n}', name).replace('{f}', from),
    };
  }, []);

  /* ---------- scene crossfade state ---------- */
  const [activeId, setActiveId] = useState('s1');
  const [leavingId, setLeavingId] = useState(null);
  const curRef = useRef('s1');
  const leaveTimerRef = useRef(null);

  const [envPeekShow, setEnvPeekShow] = useState(false);
  const [bodyClass, setBodyClass] = useState('');
  const [nightFading, setNightFading] = useState(false);
  const [b2Disabled, setB2Disabled] = useState(false);
  const [noBtnPos, setNoBtnPos] = useState(null);

  const [cTag, setCTag] = useState('Cake time');
  const [cH, setCH] = useState('Blow out the candles \u2728');
  const [cP, setCP] = useState('Tap the cake, or blow into your mic.');
  const [blownUI, setBlownUI] = useState(false);
  const [cutUI, setCutUI] = useState(false);
  const [cutAnywayVisible, setCutAnywayVisible] = useState(false);
  const [b3Visible, setB3Visible] = useState(false);

  const [wH, setWH] = useState('Close your eyes...');
  const [wP, setWP] = useState('Make a little wish for the year ahead.');
  const [bearAStage, setBearAStage] = useState('before');
  const [b4Hidden, setB4Hidden] = useState(false);
  const [wLoadingVisible, setWLoadingVisible] = useState(false);

  const [letterText, setLetterText] = useState('');
  const [b5Visible, setB5Visible] = useState(false);
  const [wishstarGo, setWishstarGo] = useState(false);

  const [balloons, setBalloons] = useState([]);

  /* ---------- refs for imperative bits (mirrors original closures) ---------- */
  const blownRef = useRef(false);
  const doneRef = useRef(false);
  const micStreamRef = useRef(null);
  const startYRef = useRef(null);
  const letterTimerRef = useRef(null);
  const poppedRef = useRef(0);

  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const runningRef = useRef(false);

  const cakeboxRef = useRef(null);
  const knifeRef = useRef(null);
  const cakeStageRef = useRef(null);
  const bfieldRef = useRef(null);
  const paperRef = useRef(null);
  const bgmRef = useRef(null);
  const noBtnRef = useRef(null);
  const starsRef = useRef(null);
  const flagsRef = useRef(null);

  /* ---------- confetti ---------- */
  function sizeCanvas() {
    const cv = canvasRef.current;
    if (!cv) return;
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
  }

  function tick() {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext('2d');
    cx.clearRect(0, 0, cv.width, cv.height);
    particlesRef.current = particlesRef.current.filter((p) => p.l > 0 && p.y < cv.height + 20);
    particlesRef.current.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.r += 0.1; p.l--;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r);
      cx.fillStyle = p.c;
      if (p.shape === 'circle') { cx.beginPath(); cx.arc(0, 0, p.w / 2, 0, Math.PI * 2); cx.fill(); }
      else { cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); }
      cx.restore();
    });
    if (particlesRef.current.length) requestAnimationFrame(tick);
    else runningRef.current = false;
  }

  function burst(n, x, y) {
    const cv = canvasRef.current;
    if (!cv) return;
    const colors = ['#e0486f', '#f9d56e', '#f7a8b8', '#fff', '#a98ad0', '#8fd3c7'];
    for (let k = 0; k < n; k++) {
      particlesRef.current.push({
        x: x == null ? Math.random() * cv.width : x,
        y: y == null ? -10 : y,
        vx: (Math.random() - 0.5) * (x == null ? 2 : 10),
        vy: x == null ? Math.random() * 2 + 1 : -Math.random() * 9,
        w: 5 + Math.random() * 6, h: 3 + Math.random() * 5,
        r: Math.random() * 6, c: colors[k % colors.length], l: 300 + Math.random() * 200,
        shape: Math.random() < 0.35 ? 'circle' : 'rect',
      });
    }
    if (!runningRef.current) { runningRef.current = true; tick(); }
  }

  function emojiBurst(n, x, y, emojis = ['\u2764', '\u2728', '\uD83D\uDC96']) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.textContent = emojis[i % emojis.length];
      s.style.cssText =
        `position:fixed;left:${x + (Math.random() * 60 - 30)}px;top:${y}px;` +
        `font-size:${1 + Math.random()}rem;pointer-events:none;z-index:6;` +
        `transition:transform 1.1s ease-out,opacity 1.1s ease-out;opacity:1`;
      document.body.appendChild(s);
      const el = s;
      requestAnimationFrame(() => {
        el.style.transform = `translateY(-${90 + Math.random() * 60}px)`;
        el.style.opacity = '0';
      });
      setTimeout(() => el.remove(), 1200);
    }
  }

  /* ---------- scene switching ---------- */
  function go(id) {
    curRef.current = id;
    clearTimeout(leaveTimerRef.current);
    setLeavingId(activeId);
    setActiveId(id);
    leaveTimerRef.current = setTimeout(() => setLeavingId(null), 550);

    if (id === 's1') {
      setEnvPeekShow(false);
      requestAnimationFrame(() => setEnvPeekShow(true));
    }
    if (id === 's3') startMic(); else stopMic();
    if (id === 'sBalloons') setupBalloons();
  }

  /* ---------- mic / cake ---------- */
  function startMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((s) => {
        micStreamRef.current = s;
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const node = ac.createMediaStreamSource(s);
        const an = ac.createAnalyser();
        an.fftSize = 256;
        node.connect(an);
        const buf = new Uint8Array(an.frequencyBinCount);
        let hits = 0;
        const loop = () => {
          if (blownRef.current || curRef.current !== 's3' || !micStreamRef.current) return;
          an.getByteFrequencyData(buf);
          let m = 0;
          for (let i = 0; i < 20; i++) m += buf[i];
          m /= 20;
          hits = m > 150 ? hits + 1 : Math.max(0, hits - 1);
          if (hits > 10) return blowOut();
          requestAnimationFrame(loop);
        };
        loop();
      })
      .catch(() => {});
  }
  function stopMic() {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
  }

  function blowOut() {
    if (blownRef.current) return;
    blownRef.current = true;
    setBlownUI(true);
    stopMic();
    bgmRef.current?.play().catch(() => {});
    burst(70);
    const r = cakeboxRef.current.getBoundingClientRect();
    emojiBurst(5, r.left + r.width / 2, r.top, ['\u2728', '\uD83D\uDCA8']);
    setCH('Yehhhh!!! \uD83C\uDF89');
    setCP('');
    setTimeout(() => {
      setCH('Now make the first cut \u2728');
      setCP('Swipe down across the cake, top to bottom.');
      setCutAnywayVisible(true);
    }, 1100);
  }

  function cut() {
    if (!blownRef.current || doneRef.current) return;
    doneRef.current = true;
    startYRef.current = null;
    setCutUI(true);
    knifeRef.current.style.height = '0';
    burst(90);
    const r = cakeboxRef.current.getBoundingClientRect();
    emojiBurst(5, r.left + r.width / 2, r.top + r.height / 2, ['\u2728', '\uD83C\uDF82']);
    setCTag('Cake time \uD83C\uDF89');
    setCH('You did it! \uD83C\uDF8A');
    setCP('The first slice is always the sweetest one.');
    setCutAnywayVisible(false);
    setB3Visible(true);
  }

  function onCakePointerDown(e) {
    if (!blownRef.current) return blowOut();
    if (doneRef.current) return;
    startYRef.current = e.clientY;
    cakeboxRef.current.setPointerCapture(e.pointerId);
  }
  function onCakePointerMove(e) {
    if (!blownRef.current || startYRef.current == null) return;
    const h = cakeboxRef.current.getBoundingClientRect().height;
    const d = Math.max(0, Math.min(h, e.clientY - startYRef.current));
    knifeRef.current.style.height = d + 'px';
    if (d > h * 0.6) cut();
  }
  function onCakePointerUp() {
    if (blownRef.current && !doneRef.current) knifeRef.current.style.height = '0';
    startYRef.current = null;
  }
  function onCakeKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') { if (!blownRef.current) blowOut(); else cut(); }
  }

  /* ---------- wish / letter ---------- */
  function handleWishMade() {
    setWH('Your wish is on its way \u2728');
    setWP('Somewhere, a tiny star just said yes.');
    setBearAStage('made');
    setWishstarGo(true);
    burst(60);
    setB4Hidden(true);
    setWLoadingVisible(true);
    setTimeout(() => { go('s5'); typeLetter(D.msg); }, 2600);
  }

  function typeLetter(raw) {
    let i = 0;
    setLetterText('');
    clearInterval(letterTimerRef.current);
    letterTimerRef.current = setInterval(() => {
      i++;
      setLetterText(raw.slice(0, i));
      if (paperRef.current) paperRef.current.scrollTop = paperRef.current.scrollHeight;
      if (i >= raw.length) {
        clearInterval(letterTimerRef.current);
        setB5Visible(true);
      }
    }, 28);
  }
  function skipLetter() {
    clearInterval(letterTimerRef.current);
    setLetterText(D.msg);
    setB5Visible(true);
  }

  /* ---------- balloons ---------- */
  function setupBalloons() {
    const field = bfieldRef.current;
    poppedRef.current = 0;
    const fw = field?.clientWidth || 380;
    const fh = field?.clientHeight || 420;
    const cols = 2, rows = 3;
    const cellW = fw / cols, cellH = fh / rows;
    const ratio = 84 / 120;
    const maxW = cellW * 0.82, maxH = cellH * 0.82;
    let bw, bh;
    if (maxW / ratio <= maxH) { bw = maxW; bh = maxW / ratio; } else { bh = maxH; bw = maxH * ratio; }
    bw = Math.max(54, Math.min(126, bw));
    bh = bw / ratio;
    const positions = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const slackX = Math.max(0, cellW - bw);
        const slackY = Math.max(0, cellH - bh);
        positions.push([
          col * cellW + slackX / 2 + (Math.random() * slackX * 0.5 - slackX * 0.25),
          row * cellH + slackY / 2 + (Math.random() * slackY * 0.5 - slackY * 0.25),
        ]);
      }
    }
    shuffle(positions);
    const images = (Array.isArray(CONFIG.balloonImages) && CONFIG.balloonImages.length)
      ? CONFIG.balloonImages
      : DEFAULT_BALLOON_IMAGES;
    const list = [];
    for (let i = 0; i < BALLOON_COUNT; i++) {
      list.push({
        id: i,
        w: bw, h: bh,
        x: positions[i][0], y: positions[i][1],
        color: BALLOON_COLORS[i % BALLOON_COLORS.length],
        delay: i * 0.3,
        src: resolved(images[i % images.length]),
        status: 'idle',
      });
    }
    setBalloons(list);
  }

  function popBalloon(id, e) {
    setBalloons((prev) => prev.map((b) => (b.id === id && b.status === 'idle' ? { ...b, status: 'popping' } : b)));
    const r = e.currentTarget.getBoundingClientRect();
    burst(30, r.left + r.width / 2, r.top + r.height / 2);
    emojiBurst(4, r.left + r.width / 2, r.top + r.height / 2, ['\u2728', '\uD83C\uDF88']);
    setTimeout(() => {
      setBalloons((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'revealed' } : b)));
    }, 250);
    poppedRef.current++;
    if (poppedRef.current === BALLOON_COUNT) {
      setTimeout(() => {
        setBodyClass('pink');
        go('s6');
        burst(160);
        emojiBurst(10, window.innerWidth / 2, window.innerHeight, ['\u2764', '\uD83C\uDF89', '\u2728']);
      }, 3500);
    }
  }

  /* ---------- setup / replay ---------- */
  function setup() {
    setBodyClass('');
    setCTag('Cake time');
    setCH('Blow out the candles \u2728');
    setCP('Tap the cake, or blow into your mic.');
    blownRef.current = false;
    doneRef.current = false;
    setBlownUI(false);
    setCutUI(false);
    setCutAnywayVisible(false);
    setB3Visible(false);
    setWH('Close your eyes...');
    setWP('Make a little wish for the year ahead.');
    setBearAStage('before');
    setB4Hidden(false);
    setWLoadingVisible(false);
    clearInterval(letterTimerRef.current);
    setLetterText('');
    setB5Visible(false);
    setWishstarGo(false);
    setB2Disabled(false);
    setNightFading(false);
    setNoBtnPos(null);
    if (bgmRef.current) { bgmRef.current.pause(); bgmRef.current.currentTime = 0; }
  }

  function dodgeNo() {
    setNoBtnPos({ left: Math.random() * 170, top: Math.random() * 14 - 7 });
  }

  /* ---------- one-time mount setup ---------- */
  useEffect(() => {
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    window.addEventListener('orientationchange', sizeCanvas);

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const flagColors = ['#f6c76a', '#9ed8c9', '#f4b6c8', '#b4b0ee'];
    let flags = '';
    for (let i = 0; i < 10; i++) {
      flags += `<path d="M${i * 40 + 4} ${14 + Math.sin(i * 0.63) * 10 + 8} l14 0 l-7 24z" fill="${flagColors[i % 4]}"/>`;
    }
    if (flagsRef.current) flagsRef.current.innerHTML = flags;

    if (!reduceMotion && starsRef.current) {
      let stars = '';
      for (let j = 0; j < 40; j++) {
        stars += `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;animation-delay:${Math.random() * 3}s"></i>`;
      }
      starsRef.current.innerHTML = stars;
    }

    requestAnimationFrame(() => setEnvPeekShow(true));

    return () => {
      window.removeEventListener('resize', sizeCanvas);
      window.removeEventListener('orientationchange', sizeCanvas);
      clearInterval(letterTimerRef.current);
      stopMic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.className = bodyClass;
  }, [bodyClass]);

  const envelopeHtml = CONFIG.envelopeImage ? `<img src="${resolved(CONFIG.envelopeImage)}" alt="">` : DEFAULT_ENVELOPE_SVG;
  const envPeekHtml = CONFIG.envelopePeekImage
    ? `<img class="env-peek-photo" src="${resolved(CONFIG.envelopePeekImage)}" alt="">`
    : `<div class="env-bear">${bearSvg({}, resolved(CONFIG.mascotImage))}</div><div class="env-card">This is for you, <em>${D.name}</em>!</div>`;
  const cakeFullHtml = cakeArt('full');
  const cakeIconHtml = cakeArt('icon');
  const bearFHtml = CONFIG.finaleImage ? `<img src="${resolved(CONFIG.finaleImage)}" alt="">` : bearSvg({ balloon: 1 }, resolved(CONFIG.mascotImage));
  const bearAHtml = wishArtHtml(bearAStage);

  const sceneClass = (id) => `scene${activeId === id ? ' on' : ''}${leavingId === id ? ' leaving' : ''}`;

  return (
    <>
      <div className="aurora" aria-hidden="true"><span></span><span></span><span></span></div>
      <div className="stars" ref={starsRef} aria-hidden="true"></div>
      <div className="rays" aria-hidden="true"></div>
      <svg className="bunting" viewBox="0 0 400 50" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 4 Q200 40 400 4" stroke="#b8946a" fill="none" strokeWidth="2" />
        <g ref={flagsRef}></g>
      </svg>
      <canvas ref={canvasRef}></canvas>
      <div className={`wishstar${wishstarGo ? ' go' : ''}`} aria-hidden="true">⭐</div>
      <audio ref={bgmRef} src={asset('audio/nastelbom-happy-birthday-471481.mp3')} preload="auto" loop></audio>

      <section className={sceneClass('s1')} id="s1">
        <span className="tag">a little something ✦</span>
        <h1 className="shimmer">There's something <em>for you</em></h1>
        <p className="sub">A tiny birthday surprise, made just for you.</p>
        <div className="env-wrap">
          <div className={`env-peek${envPeekShow ? ' show' : ''}`} dangerouslySetInnerHTML={{ __html: envPeekHtml }} />
          <div className="env-art" dangerouslySetInnerHTML={{ __html: envelopeHtml }} />
        </div>
        <p className="sub">Are you excited?</p>
        <div className="row">
          <button style={{ left: 0 }} onClick={() => { setBodyClass('night'); go('night'); }}>Yes</button>
          <button
            ref={noBtnRef}
            className="ghost"
            style={noBtnPos ? { right: 'auto', left: noBtnPos.left, top: noBtnPos.top } : { right: 0 }}
            onMouseEnter={dodgeNo}
            onClick={dodgeNo}
            onTouchStart={(e) => { e.preventDefault(); dodgeNo(); }}
          >
            No
          </button>
        </div>
      </section>

      <section className={sceneClass('night')} id="night">
        <div className={`night-content${nightFading ? ' fading' : ''}`}>
          <span className="tag">Shhh...</span>
          <h1>The room is<br />waiting for you.</h1>
          <p className="sub">Someone left the lights off on purpose.</p>
          <button
            disabled={b2Disabled}
            onClick={() => {
              setBodyClass('glow');
              burst(40);
              setB2Disabled(true);
              setNightFading(true);
              setTimeout(() => { setBodyClass(''); go('s3'); }, 1800);
            }}
          >
            Turn on the lights
          </button>
        </div>
      </section>

      <section className={sceneClass('s3')} id="s3">
        <span className="tag">{cTag}</span>
        <h2>{cH}</h2>
        <p className="sub">{cP}</p>
        <div
          id="cakebox"
          ref={cakeboxRef}
          className={cutUI ? 'cut' : ''}
          tabIndex={0}
          onPointerDown={onCakePointerDown}
          onPointerMove={onCakePointerMove}
          onPointerUp={onCakePointerUp}
          onKeyDown={onCakeKeyDown}
        >
          <div id="knife" ref={knifeRef}></div>
          <div className={`cake-stage${blownUI ? ' blown' : ''}`} ref={cakeStageRef}>
            <div id="hl" className="cake-half cake-left" dangerouslySetInnerHTML={{ __html: cakeFullHtml }} />
            <div id="hr" className="cake-half cake-right" dangerouslySetInnerHTML={{ __html: cakeFullHtml }} />
          </div>
        </div>
        {cutAnywayVisible && (
          <button className="ghost mini" onClick={cut}>Can't swipe? Cut it for me</button>
        )}
        {b3Visible && (
          <button onClick={() => { doneRef.current = false; go('s4'); }}>Make a wish ✨</button>
        )}
      </section>

      <section className={sceneClass('s4')} id="s4">
        <div className="pair">
          <div className="mascot-sm" dangerouslySetInnerHTML={{ __html: bearAHtml }} />
          <div className="mascot-sm" dangerouslySetInnerHTML={{ __html: cakeIconHtml }} />
        </div>
        <h2>{wH}</h2>
        <p className="sub">{wP}</p>
        {!b4Hidden && <button onClick={handleWishMade}>I made my wish ✨</button>}
        {wLoadingVisible && (
          <p className="sub loading">Getting your letter ready<span className="dots"><span>.</span><span>.</span><span>.</span></span></p>
        )}
      </section>

      <section className={sceneClass('s5')} id="s5">
        <h2>For you, <em>{D.name}</em></h2>
        <div id="paper" ref={paperRef} onClick={skipLetter}>{letterText}</div>
        {b5Visible && <button onClick={() => go('sBalloons')}>Continue</button>}
      </section>

      <section className={sceneClass('sBalloons')} id="sBalloons">
        <h2>Some Sweet Memories</h2>
        <p className="sub">Pop all 6 balloons</p>
        <div id="bfield" ref={bfieldRef}>
          {balloons.map((b) => (
            <button
              key={b.id}
              className={`bal${b.status === 'popping' ? ' pop' : ''}${b.status === 'revealed' ? ' revealed' : ''}`}
              aria-label={`Pop balloon ${b.id + 1}`}
              disabled={b.status !== 'idle'}
              style={{ width: b.w, height: b.h, left: b.x, top: b.y, animationDelay: `${b.delay}s` }}
              onClick={(e) => popBalloon(b.id, e)}
            >
              {b.status === 'revealed' ? (
                <img src={b.src} alt="" />
              ) : (
                <svg viewBox="0 0 84 120">
                  <ellipse cx="42" cy="44" rx="34" ry="40" fill={b.color} opacity=".88" />
                  <ellipse cx="30" cy="30" rx="8" ry="14" fill="#fff" opacity=".5" />
                  <path d="M42 84 l-5 8 h10z" fill={b.color} />
                  <path d="M42 92 q-10 12 0 28" stroke="#d9587c" fill="none" strokeWidth="2" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </section>

      <section className={sceneClass('s6')} id="s6">
        <div className="mascot-lg" dangerouslySetInnerHTML={{ __html: bearFHtml }} />
        <h1 className="split-heading">
          <span className="shimmer line1">Happy Birthday</span>
          <span className="line2">cute <em>{D.name}</em>! 🎂</span>
        </h1>
        <p className="sub">{D.wish}</p>
        <p className="sub">— with love, {D.from}? 💕</p>
        <button className="ghost" onClick={() => { setup(); go('s1'); }}>Replay the surprise ↻</button>
      </section>
    </>
  );
}
