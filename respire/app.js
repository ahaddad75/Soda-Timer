/* ============================================================
   Respire — cohérence cardiaque & respiration guidée
   Application 100 % locale (aucune donnée envoyée).
   ============================================================ */
'use strict';

/* ------------------------------------------------------------
   1. Icônes
------------------------------------------------------------ */
const ICONS = {
  heartPulse: '<path d="M12 20s-7-4.5-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7-2.8c0 4.7-7 14.8-7 14.8z"/><path d="M4 12h3l1.5-3 2 6 1.8-4 1.4 2h4.3"/>',
  heartWave:  '<path d="M12 20s-7-4.5-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7-2.8c0 4.7-7 14.8-7 14.8z"/><path d="M7 12h3l1.5 2.5L14 9l1.5 3H18"/>',
  target:     '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/>',
  lotus:      '<path d="M12 4c2.4 2.2 3.4 4.6 3.4 7.4S13.9 17 12 19c-1.9-2-3.4-4.8-3.4-7.6S9.6 6.2 12 4z"/><path d="M12 19c-2.6.4-5-.7-6.6-2.7 1-2.2 2.8-3.5 4.8-3.8"/><path d="M12 19c2.6.4 5-.7 6.6-2.7-1-2.2-2.8-3.5-4.8-3.8"/>',
  square:     '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 8h8v8H8z" opacity=".45"/>',
  meditate:   '<circle cx="12" cy="5" r="2"/><path d="M12 9v5"/><path d="M6.5 11.5 12 14l5.5-2.5"/><path d="M7 20c1.4-1.8 3.1-2.7 5-2.7S15.6 18.2 17 20"/>',
  medal:      '<path d="M9 3h6l-1.2 8h-3.6z"/><circle cx="12" cy="16" r="4.5"/><path d="M12 14.2l.8 1.7 1.8.2-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8L9.4 16l1.8-.2z"/>',
  moon:       '<path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z"/>',
  arrowUp:    '<path d="M12 20V5"/><path d="M6 11l6-6 6 6"/><path d="M4 20h16" opacity=".5"/>',
  arrowDown:  '<path d="M12 4v15"/><path d="M18 13l-6 6-6-6"/>',
  wave:       '<path d="M3 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0"/><path d="M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0" opacity=".5"/>',
  spark:      '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/><circle cx="12" cy="12" r="2.5"/>',
  trash:      '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
  info:       '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  heart:      '<path d="M12 20s-7-4.5-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7-2.8c0 4.7-7 14.8-7 14.8z"/>'
};
const svg = (name, cls) => `<svg viewBox="0 0 24 24" class="${cls || ''}">${ICONS[name] || ''}</svg>`;

/* ------------------------------------------------------------
   2. Catalogue d'exercices
------------------------------------------------------------ */
const TECHNIQUES = [
  {
    id: 'coh-5-5', name: 'Cohérence cardiaque', sub: 'Équilibre 5-5',
    icon: 'heartPulse', color: '#7c8cff', defaultMin: 5,
    p: { in: 5, holdIn: 0, out: 5, holdOut: 0 },
    info: "La référence de la cohérence cardiaque : 6 respirations par minute (5 secondes d'inspiration, 5 secondes d'expiration).\n\nCe rythme synchronise le cœur, la respiration et le système nerveux autonome. Il apaise le stress, aide à la concentration et améliore la variabilité de la fréquence cardiaque.\n\nConseil : 3 séances de 5 minutes par jour (matin, midi, fin d'après-midi), assis, dos droit, en respirant par le nez si possible."
  },
  {
    id: 'coh-4-6', name: 'Cohérence cardiaque', sub: 'Relaxation 4-6',
    icon: 'heartWave', color: '#5ad19a', defaultMin: 5,
    p: { in: 4, holdIn: 0, out: 6, holdOut: 0 },
    info: "Expiration plus longue que l'inspiration : le frein vagal est renforcé et la détente est plus marquée qu'avec le 5-5.\n\nIdéale en fin de journée, avant une situation stressante, ou pour redescendre après un effort."
  },
  {
    id: 'coh-6-4', name: 'Cohérence cardiaque', sub: 'Dynamique 6-4',
    icon: 'target', color: '#ff7a6b', defaultMin: 5,
    p: { in: 6, holdIn: 0, out: 4, holdOut: 0 },
    info: "Inspiration plus longue que l'expiration : légèrement tonifiante tout en gardant les 6 cycles par minute.\n\nÀ utiliser le matin, avant une réunion, un examen ou une compétition, quand il faut être calme mais alerte."
  },
  {
    id: 'sq-4-4-4-4', name: 'Respiration carrée', sub: 'Détente profonde 4-4-4-4',
    icon: 'square', color: '#4fc3d9', defaultMin: 5,
    p: { in: 4, holdIn: 4, out: 4, holdOut: 4 },
    info: "Quatre temps égaux : inspiration, poumons pleins, expiration, poumons vides.\n\nUtilisée par les militaires et les sportifs pour reprendre le contrôle sous pression. Elle recentre l'attention et calme le mental très rapidement."
  },
  {
    id: 'r-4-7-8', name: 'Respiration 4-7-8', sub: "Endormissement",
    icon: 'moon', color: '#f06fa0', defaultMin: 3,
    p: { in: 4, holdIn: 7, out: 8, holdOut: 0 },
    info: "Inspirez 4 s, retenez 7 s, expirez lentement 8 s.\n\nLa longue expiration et la rétention favorisent l'endormissement et la baisse de la tension. Commencez par 4 cycles et augmentez progressivement.\n\nSi la rétention est inconfortable, revenez à un rythme plus court."
  },
  {
    id: 'r-4-4', name: 'Respiration 4-4', sub: 'Contrôle rapide du stress',
    icon: 'medal', color: '#f4c04f', defaultMin: 3,
    p: { in: 4, holdIn: 0, out: 4, holdOut: 0 },
    info: "Un rythme simple à 7,5 respirations par minute, plus facile à tenir que le 5-5 quand on débute ou quand on est déjà essoufflé.\n\nParfait pour une pause express de 1 à 3 minutes."
  },
  {
    id: 'r-4-4-6-2', name: 'Respiration 4-4-6-2', sub: 'Réduction du stress',
    icon: 'lotus', color: '#6fb7ff', defaultMin: 5,
    p: { in: 4, holdIn: 4, out: 6, holdOut: 2 },
    info: "Cycle asymétrique avec une expiration longue et une courte pause poumons vides.\n\nTrès efficace pour faire redescendre une tension accumulée, tout en gardant un rythme confortable."
  },
  {
    id: 'r-4-8', name: 'Respiration apaisante', sub: 'Anti-anxiété 4-8',
    icon: 'wave', color: '#9d8cff', defaultMin: 5,
    p: { in: 4, holdIn: 0, out: 8, holdOut: 0 },
    info: "L'expiration dure deux fois plus longtemps que l'inspiration : c'est le réglage le plus parasympathique, donc le plus calmant.\n\nUtile en cas d'anxiété, de ruminations, ou pour préparer le sommeil."
  },
  {
    id: 'r-stim', name: 'Respiration stimulante', sub: 'Réveil et énergie 6-2',
    icon: 'spark', color: '#ffa15c', defaultMin: 2,
    p: { in: 6, holdIn: 2, out: 2, holdOut: 0 },
    info: "Inspiration ample, expiration brève : le système nerveux sympathique est stimulé.\n\nÀ réserver au matin ou à un coup de fatigue. À éviter le soir et en cas d'anxiété. Arrêtez immédiatement en cas d'étourdissement."
  },
  {
    id: 'medit', name: 'Respiration méditative', sub: 'Ancrage 6-6',
    icon: 'meditate', color: '#4fd1a5', defaultMin: 10,
    p: { in: 6, holdIn: 0, out: 6, holdOut: 0 },
    info: "5 respirations par minute : un rythme lent, proche de la fréquence de résonance de nombreuses personnes.\n\nExcellent support pour une méditation longue ou une séance de relaxation profonde."
  }
];

const PHASE_ORDER = ['in', 'holdIn', 'out', 'holdOut'];
const PHASE_TEXT = { in: 'Inspirez', holdIn: 'Retenez', out: 'Expirez', holdOut: 'Poumons vides' };
const PHASE_SPEECH = { in: 'Inspirez', holdIn: 'Retenez', out: 'Expirez', holdOut: 'Poumons vides' };
const LEAD_IN = 3;                 // secondes de préparation
const DURATIONS = [1, 2, 3, 5, 10, 15, 20, 30];

/* ------------------------------------------------------------
   3. Stockage local
------------------------------------------------------------ */
const KEY = { fav: 'respire.fav', custom: 'respire.custom', sessions: 'respire.sessions', settings: 'respire.settings' };

function load(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; }
  catch (_) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* quota / mode privé */ }
}

let favorites = load(KEY.fav, ['coh-5-5']);
let customs = load(KEY.custom, []);
let sessions = load(KEY.sessions, []);
let settings = Object.assign(
  { voice: true, tones: true, drone: true, vibrate: false, wakeLock: true, volume: 70, lastDuration: 5 },
  load(KEY.settings, {})
);

const allTechniques = () => TECHNIQUES.concat(customs);
const findTech = id => allTechniques().find(t => t.id === id);

/* ------------------------------------------------------------
   4. Utilitaires
------------------------------------------------------------ */
const $ = sel => document.querySelector(sel);
const cycleDuration = t => PHASE_ORDER.reduce((s, k) => s + (t.p[k] || 0), 0);

function mmss(sec) {
  sec = Math.max(0, Math.round(sec));
  return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0');
}
function humanDuration(sec) {
  const m = Math.round(sec / 60);
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60);
  return h + ' h' + (m % 60 ? ' ' + (m % 60) : '');
}
function rhythmLabel(t) {
  const parts = [];
  if (t.p.in) parts.push('Inspirez ' + t.p.in + ' s');
  if (t.p.holdIn) parts.push('Retenez ' + t.p.holdIn + ' s');
  if (t.p.out) parts.push('Expirez ' + t.p.out + ' s');
  if (t.p.holdOut) parts.push('Poumons vides ' + t.p.holdOut + ' s');
  return parts.join(' — ');
}
function dayKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/* ------------------------------------------------------------
   5. Moteur audio
   Tout le guidage sonore est programmé à l'avance sur l'horloge
   audio : il reste précis même quand l'onglet passe en arrière-plan
   ou que l'écran est éteint.
------------------------------------------------------------ */
const Audio_ = {
  ctx: null, master: null, drone: null, droneGain: null, marker: null, markerGain: null,
  keepAlive: null, keepAliveUrl: null,

  makeKeepAliveUrl() {
    if (this.keepAliveUrl) return this.keepAliveUrl;
    const sr = 8000, n = sr * 2, buf = new ArrayBuffer(44 + n), v = new DataView(buf);
    const w = (off, s) => { for (let i = 0; i < s.length; i++) v.setUint8(off + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n, true); w(8, 'WAVE'); w(12, 'fmt ');
    v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, sr, true); v.setUint32(28, sr, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
    w(36, 'data'); v.setUint32(40, n, true);
    // quasi-silence (une valeur strictement constante peut être « optimisée » par l'OS)
    for (let i = 0; i < n; i++) v.setUint8(44 + i, 128 + (i % 3 === 0 ? 1 : 0));
    let bin = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    this.keepAliveUrl = 'data:audio/wav;base64,' + btoa(bin);
    return this.keepAliveUrl;
  },

  /* Maintient la lecture audio active quand l'écran s'éteint :
     le système considère la page comme un lecteur multimédia. */
  startKeepAlive() {
    if (!this.keepAlive) {
      this.keepAlive = new Audio(this.makeKeepAliveUrl());
      this.keepAlive.loop = true;
      this.keepAlive.volume = 0.02;
      this.keepAlive.setAttribute('playsinline', '');
    }
    const p = this.keepAlive.play();
    if (p && p.catch) p.catch(() => {});
  },
  stopKeepAlive() {
    if (this.keepAlive) { this.keepAlive.pause(); this.keepAlive.currentTime = 0; }
  },

  init() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = settings.volume / 100;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2600;
    filter.connect(this.master);
    this.master.connect(this.ctx.destination);
    this.filter = filter;
    return this.ctx.resume();
  },

  note(t, freq, dur, peak) {
    const g = this.markerGain.gain;
    g.setValueAtTime(0.0001, t);
    this.marker.frequency.setValueAtTime(freq, t);
    g.linearRampToValueAtTime(peak, t + 0.025);
    g.linearRampToValueAtTime(peak * 0.7, t + dur * 0.5);
    g.linearRampToValueAtTime(0.0001, t + dur);
  },

  cue(t, type) {
    if (type === 'in') { this.note(t, 523.25, 0.13, 0.28); this.note(t + 0.15, 659.25, 0.18, 0.26); }
    else if (type === 'out') { this.note(t, 440.00, 0.13, 0.28); this.note(t + 0.15, 329.63, 0.22, 0.26); }
    else { this.note(t, 493.88, 0.12, 0.20); }
  },

  /* Programme l'intégralité de la séance d'un seul coup. */
  schedule(t0, timeline, total) {
    const opts = settings;

    if (opts.tones || opts.drone) {
      this.marker = this.ctx.createOscillator();
      this.marker.type = 'sine';
      this.markerGain = this.ctx.createGain();
      this.markerGain.gain.setValueAtTime(0.0001, t0);
      this.marker.connect(this.markerGain).connect(this.filter);
      this.marker.start(t0);
      this.marker.stop(t0 + total + 2.5);
    }

    if (opts.tones) {
      // décompte de préparation
      for (let i = 0; i < LEAD_IN; i++) this.note(t0 + i, 392, 0.09, 0.14);
      timeline.forEach(ph => this.cue(t0 + ph.start, ph.type));
      // carillon de fin
      const e = t0 + total + 0.3;
      this.note(e, 523.25, 0.25, 0.24);
      this.note(e + 0.28, 659.25, 0.25, 0.24);
      this.note(e + 0.56, 783.99, 0.6, 0.26);
    }

    if (opts.drone) {
      this.drone = this.ctx.createOscillator();
      this.drone.type = 'sine';
      this.droneGain = this.ctx.createGain();
      this.drone.connect(this.droneGain).connect(this.filter);
      const LO = 174.6, HI = 349.2;   // une octave de glissando
      const g = this.droneGain.gain;
      g.setValueAtTime(0.0001, t0);
      g.linearRampToValueAtTime(0.075, t0 + LEAD_IN);
      const f = this.drone.frequency;
      f.setValueAtTime(LO, t0);
      timeline.forEach(ph => {
        const a = t0 + ph.start, b = t0 + ph.end;
        if (ph.type === 'in') { f.setValueAtTime(LO, a); f.exponentialRampToValueAtTime(HI, b); }
        else if (ph.type === 'out') { f.setValueAtTime(HI, a); f.exponentialRampToValueAtTime(LO, b); }
        else if (ph.type === 'holdIn') { f.setValueAtTime(HI, a); }
        else { f.setValueAtTime(LO, a); }
      });
      g.setValueAtTime(0.075, t0 + total - 0.6);
      g.linearRampToValueAtTime(0.0001, t0 + total);
      this.drone.start(t0);
      this.drone.stop(t0 + total + 2.5);
    }
  },

  setVolume(v) { if (this.master) this.master.gain.value = v / 100; },

  stop() {
    [this.drone, this.marker].forEach(o => { if (o) { try { o.stop(); } catch (_) {} try { o.disconnect(); } catch (_) {} } });
    this.drone = this.marker = this.droneGain = this.markerGain = null;
    if (this.ctx) { const c = this.ctx; this.ctx = null; c.close().catch(() => {}); }
    this.stopKeepAlive();
  }
};

/* ---------- Voix française ---------- */
const Voice = {
  voice: null,
  pick() {
    if (!('speechSynthesis' in window)) return null;
    const list = speechSynthesis.getVoices() || [];
    this.voice = list.find(v => /^fr/i.test(v.lang) && /google|natural|premium/i.test(v.name))
              || list.find(v => /^fr/i.test(v.lang)) || null;
    return this.voice;
  },
  say(text) {
    if (!settings.voice || !('speechSynthesis' in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'fr-FR';
      u.rate = 0.95;
      u.volume = Math.min(1, settings.volume / 100 + 0.15);
      if (!this.voice) this.pick();
      if (this.voice) u.voice = this.voice;
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch (_) { /* voix indisponible */ }
  }
};
if ('speechSynthesis' in window) {
  speechSynthesis.onvoiceschanged = () => Voice.pick();
  Voice.pick();
}

/* ------------------------------------------------------------
   6. Moteur de séance
------------------------------------------------------------ */
const Session = {
  tech: null, timeline: [], total: 0, cycles: 0,
  t0: 0, raf: 0, endTimer: 0, paused: false, running: false,
  lastPhase: -1, wakeLock: null,

  buildTimeline(tech, minutes) {
    const cd = cycleDuration(tech);
    const nb = Math.max(1, Math.round((minutes * 60) / cd));
    const tl = [];
    let t = LEAD_IN;
    for (let c = 0; c < nb; c++) {
      PHASE_ORDER.forEach(k => {
        const d = tech.p[k] || 0;
        if (d > 0) { tl.push({ type: k, start: t, end: t + d, dur: d, cycle: c + 1 }); t += d; }
      });
    }
    return { timeline: tl, total: t, cycles: nb };
  },

  async start(tech, minutes) {
    const built = this.buildTimeline(tech, minutes);
    this.tech = tech;
    this.timeline = built.timeline;
    this.total = built.total;
    this.cycles = built.cycles;
    this.lastPhase = -1;
    this.paused = false;
    this.running = true;

    Audio_.startKeepAlive();
    try { await Audio_.init(); } catch (_) { /* audio refusé */ }

    this.t0 = Audio_.ctx ? Audio_.ctx.currentTime + 0.12 : 0;
    if (Audio_.ctx) Audio_.schedule(this.t0, this.timeline, this.total);
    this.wallStart = Date.now();

    document.documentElement.style.setProperty('--accent', tech.color);
    $('#s-name').textContent = tech.name;
    $('#s-sub').textContent = tech.sub;
    $('#s-cycles').textContent = '0';
    $('#s-elapsed').textContent = '0:00';
    $('#s-remaining').textContent = mmss(this.total - LEAD_IN);
    show('session');

    this.setupMediaSession();
    this.requestWakeLock();
    this.scheduleEnd();
    this.loop();
    if (settings.voice) Voice.say('Préparez-vous');
  },

  elapsed() {
    if (!Audio_.ctx) return (Date.now() - this.wallStart) / 1000;
    return Audio_.ctx.currentTime - this.t0;
  },

  scheduleEnd() {
    clearTimeout(this.endTimer);
    const left = (this.total + 1.2 - this.elapsed()) * 1000;
    this.endTimer = setTimeout(() => this.finish(), Math.max(0, left));
  },

  loop() {
    cancelAnimationFrame(this.raf);
    const step = () => {
      if (!this.running) return;
      this.render();
      this.raf = requestAnimationFrame(step);
    };
    this.raf = requestAnimationFrame(step);
  },

  currentIndex(e) {
    for (let i = 0; i < this.timeline.length; i++) if (e < this.timeline[i].end) return i;
    return this.timeline.length - 1;
  },

  render() {
    const e = this.elapsed();
    if (e >= this.total) { this.finish(); return; }

    const bubble = $('#bubble');
    let scale = 0.42, label, count;

    if (e < LEAD_IN) {
      label = 'Préparez-vous';
      count = Math.ceil(LEAD_IN - e);
    } else {
      const i = this.currentIndex(e);
      const ph = this.timeline[i];
      const p = Math.min(1, Math.max(0, (e - ph.start) / ph.dur));
      const ease = 0.5 - Math.cos(Math.PI * p) / 2;   // sinusoïde douce
      label = PHASE_TEXT[ph.type];
      count = Math.max(1, Math.ceil(ph.end - e));

      if (ph.type === 'in') scale = 0.42 + 0.58 * ease;
      else if (ph.type === 'out') scale = 1 - 0.58 * ease;
      else if (ph.type === 'holdIn') scale = 1;
      else scale = 0.42;

      if (i !== this.lastPhase) {
        this.lastPhase = i;
        $('#s-cycles').textContent = String(ph.cycle - (ph.type === 'in' ? 1 : 0));
        // repères tardifs ignorés (onglet réveillé après throttling)
        if (e - ph.start < 1.2) {
          Voice.say(PHASE_SPEECH[ph.type]);
          if (settings.vibrate && navigator.vibrate) navigator.vibrate(ph.type === 'in' ? 60 : [40, 60, 40]);
        }
      }
    }

    bubble.style.transform = 'scale(' + scale.toFixed(3) + ')';
    $('#s-phase').textContent = label;
    $('#s-count').textContent = String(count);
    $('#s-elapsed').textContent = mmss(Math.max(0, e - LEAD_IN));
    $('#s-remaining').textContent = mmss(this.total - e);
    const prog = Math.min(1, Math.max(0, (e - LEAD_IN) / (this.total - LEAD_IN)));
    $('#ring').style.strokeDashoffset = String(590.6 * (1 - prog));
  },

  togglePause() {
    if (!this.running || !Audio_.ctx) return;
    if (this.paused) {
      Audio_.ctx.resume();
      Audio_.startKeepAlive();
      this.paused = false;
      $('#btn-pause').textContent = 'Pause';
      this.scheduleEnd();
      this.loop();
      this.requestWakeLock();
    } else {
      Audio_.ctx.suspend();
      this.paused = true;
      $('#btn-pause').textContent = 'Reprendre';
      $('#s-phase').textContent = 'En pause';
      clearTimeout(this.endTimer);
      cancelAnimationFrame(this.raf);
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    }
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = this.paused ? 'paused' : 'playing';
  },

  finish() { this.end(true); },

  end(completed) {
    if (!this.running) return;
    const e = Math.max(0, Math.min(this.elapsed(), this.total) - LEAD_IN);
    this.running = false;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.endTimer);
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    this.releaseWakeLock();

    const doneCycles = Math.floor(e / cycleDuration(this.tech));

    if (completed && settings.voice) Voice.say('Séance terminée. Bravo.');

    // laisse le carillon final se jouer avant de couper le contexte
    setTimeout(() => Audio_.stop(), completed ? 2200 : 120);
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = 'none';
      navigator.mediaSession.metadata = null;
    }

    if (e >= 20) {
      sessions.push({
        at: new Date().toISOString(), tech: this.tech.id, name: this.tech.name,
        sub: this.tech.sub, color: this.tech.color, dur: Math.round(e), cycles: doneCycles
      });
      save(KEY.sessions, sessions);
    }

    document.documentElement.style.setProperty('--accent', '#4f8cff');

    if (completed) {
      $('#done-sum').textContent = this.tech.name + ' — ' + this.tech.sub;
      $('#done-stats').innerHTML =
        '<div><b>' + mmss(e) + '</b><small>durée</small></div>' +
        '<div><b>' + doneCycles + '</b><small>cycles</small></div>' +
        '<div><b>' + sessions.length + '</b><small>séances au total</small></div>';
      show('done');
    } else {
      show('home');
      renderAll();
    }
  },

  setupMediaSession() {
    if (!('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.tech.name + ' — ' + this.tech.sub,
        artist: 'Respire',
        album: 'Séance de ' + humanDuration(this.total)
      });
      navigator.mediaSession.playbackState = 'playing';
      navigator.mediaSession.setActionHandler('play', () => { if (this.paused) this.togglePause(); });
      navigator.mediaSession.setActionHandler('pause', () => { if (!this.paused) this.togglePause(); });
      navigator.mediaSession.setActionHandler('stop', () => this.end(false));
    } catch (_) { /* API partielle */ }
  },

  async requestWakeLock() {
    if (!settings.wakeLock || !('wakeLock' in navigator)) return;
    try { this.wakeLock = await navigator.wakeLock.request('screen'); } catch (_) {}
  },
  releaseWakeLock() {
    if (this.wakeLock) { try { this.wakeLock.release(); } catch (_) {} this.wakeLock = null; }
  }
};

/* Reprise de l'affichage au retour au premier plan */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (Session.running && !Session.paused) {
    Session.lastPhase = Session.currentIndex(Session.elapsed());
    Session.requestWakeLock();
    Session.loop();
    Session.scheduleEnd();
  }
});

/* ------------------------------------------------------------
   7. Affichage
------------------------------------------------------------ */
function show(id) {
  ['home', 'session', 'done'].forEach(s => $('#' + s).classList.toggle('hidden', s !== id));
}

function techCard(t) {
  const fav = favorites.includes(t.id);
  const isCustom = !!t.custom;
  return '<div class="card" data-id="' + t.id + '">' +
    '<div class="ic" style="color:' + t.color + '">' + svg(t.icon) + '</div>' +
    '<div class="txt"><b>' + escapeHtml(t.name) + '</b><span>' + escapeHtml(t.sub) + '</span></div>' +
    '<div class="act">' +
      '<button data-act="info" aria-label="Informations">' + svg('info') + '</button>' +
      '<button data-act="fav" class="' + (fav ? 'on' : '') + '" aria-label="Favori">' + svg('heart') + '</button>' +
      (isCustom ? '<button data-act="del" aria-label="Supprimer">' + svg('trash') + '</button>' : '') +
    '</div></div>';
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderList() {
  $('#tab-list').innerHTML =
    '<div class="section-title">Cohérence cardiaque & respiration</div>' +
    allTechniques().map(techCard).join('');
}

function renderFav() {
  const list = allTechniques().filter(t => favorites.includes(t.id));
  $('#tab-fav').innerHTML = list.length
    ? '<div class="section-title">Vos favoris</div>' + list.map(techCard).join('')
    : '<div class="empty">Aucun favori pour l\'instant.<br>Touchez le cœur d\'un exercice pour l\'ajouter ici.</div>';
}

function renderStats() {
  const el = $('#tab-stats');
  if (!sessions.length) {
    el.innerHTML = '<div class="empty">Aucune séance enregistrée.<br>Vos statistiques apparaîtront ici après votre première séance.</div>';
    return;
  }
  const totalSec = sessions.reduce((s, x) => s + x.dur, 0);

  // série de jours consécutifs
  const days = new Set(sessions.map(s => dayKey(new Date(s.at))));
  let streak = 0;
  const cur = new Date();
  if (!days.has(dayKey(cur))) cur.setDate(cur.getDate() - 1);
  while (days.has(dayKey(cur))) { streak++; cur.setDate(cur.getDate() - 1); }

  // 7 derniers jours
  const bars = [];
  const names = ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = dayKey(d);
    const min = sessions.filter(s => dayKey(new Date(s.at)) === k).reduce((a, s) => a + s.dur, 0) / 60;
    bars.push({ label: names[d.getDay()], min });
  }
  const max = Math.max(1, ...bars.map(b => b.min));
  const weekMin = bars.reduce((a, b) => a + b.min, 0);

  el.innerHTML =
    '<div class="stat-grid">' +
      '<div class="stat"><b>' + sessions.length + '</b><span>séances</span></div>' +
      '<div class="stat"><b>' + humanDuration(totalSec) + '</b><span>temps total</span></div>' +
      '<div class="stat"><b>' + streak + '</b><span>jour' + (streak > 1 ? 's' : '') + ' d\'affilée</span></div>' +
      '<div class="stat"><b>' + Math.round(weekMin) + ' min</b><span>ces 7 jours</span></div>' +
    '</div>' +
    '<div class="chart"><h4>7 derniers jours (minutes)</h4><div class="bars">' +
      bars.map(b => '<div class="bar-col"><div class="bar-track"><div class="bar ' + (b.min ? '' : 'zero') +
        '" style="height:' + Math.max(3, (b.min / max) * 100) + '%"></div></div><small>' + b.label + '</small></div>').join('') +
    '</div></div>' +
    '<div class="section-title">Historique</div><div class="hist">' +
      sessions.slice(-25).reverse().map(s => {
        const d = new Date(s.at);
        const when = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' }) +
                     ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        return '<div class="hist-row"><span class="dot" style="background:' + (s.color || '#4f8cff') + '"></span>' +
          '<div class="h-main"><b>' + escapeHtml(s.name + ' — ' + (s.sub || '')) + '</b><small>' + when + ' · ' + s.cycles + ' cycles</small></div>' +
          '<span class="h-dur">' + mmss(s.dur) + '</span></div>';
      }).join('') +
    '</div>';
}

function renderAll() { renderList(); renderFav(); renderStats(); }

/* ------------------------------------------------------------
   8. Interactions
------------------------------------------------------------ */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
    ['list', 'fav', 'stats'].forEach(n => $('#tab-' + n).classList.toggle('hidden', n !== tab.dataset.tab));
  });
});

document.querySelectorAll('.tabpanel').forEach(panel => {
  panel.addEventListener('click', ev => {
    const card = ev.target.closest('.card');
    if (!card) return;
    const tech = findTech(card.dataset.id);
    if (!tech) return;
    const actBtn = ev.target.closest('[data-act]');
    if (!actBtn) { openStartSheet(tech); return; }

    const act = actBtn.dataset.act;
    if (act === 'fav') {
      const i = favorites.indexOf(tech.id);
      if (i >= 0) favorites.splice(i, 1); else favorites.push(tech.id);
      save(KEY.fav, favorites);
      renderList(); renderFav();
    } else if (act === 'info') {
      $('#info-title').textContent = tech.name + ' — ' + tech.sub;
      $('#info-rhythm').textContent = rhythmLabel(tech);
      $('#info-text').textContent = tech.info;
      openSheet('#info-sheet');
    } else if (act === 'del') {
      if (confirm('Supprimer « ' + tech.name + ' » ?')) {
        customs = customs.filter(c => c.id !== tech.id);
        favorites = favorites.filter(f => f !== tech.id);
        save(KEY.custom, customs); save(KEY.fav, favorites);
        renderAll();
      }
    }
  });
});

/* ---------- Feuilles modales ---------- */
function openSheet(sel) { $(sel).classList.remove('hidden'); }
function closeSheet(sel) { $(sel).classList.add('hidden'); }
document.querySelectorAll('.sheet-backdrop').forEach(bd => {
  bd.addEventListener('click', ev => { if (ev.target === bd) bd.classList.add('hidden'); });
});

/* ---------- Lancement d'une séance ---------- */
let pending = null, pendingMinutes = 5;

function openStartSheet(tech) {
  pending = tech;
  pendingMinutes = settings.lastDuration || tech.defaultMin || 5;
  $('#start-title').textContent = tech.name + ' — ' + tech.sub;
  $('#start-rhythm').textContent = rhythmLabel(tech) + '  ·  ' +
    (Math.round(600 / cycleDuration(tech)) / 10) + ' respirations/min';
  $('#duration-chips').innerHTML = DURATIONS
    .map(m => '<button class="chip' + (m === pendingMinutes ? ' active' : '') + '" data-min="' + m + '">' + m + ' min</button>').join('');
  syncOptionInputs();
  openSheet('#start-sheet');
}

$('#duration-chips').addEventListener('click', ev => {
  const c = ev.target.closest('.chip');
  if (!c) return;
  pendingMinutes = Number(c.dataset.min);
  document.querySelectorAll('#duration-chips .chip').forEach(x => x.classList.toggle('active', x === c));
});

const OPT_MAP = [
  ['#opt-voice', '#set-voice', 'voice'],
  ['#opt-tones', '#set-tones', 'tones'],
  ['#opt-drone', '#set-drone', 'drone'],
  ['#opt-vibe', '#set-vibe', 'vibrate'],
  ['#opt-wake', '#set-wake', 'wakeLock']
];
function syncOptionInputs() {
  OPT_MAP.forEach(([a, b, key]) => { $(a).checked = settings[key]; $(b).checked = settings[key]; });
  $('#opt-volume').value = settings.volume;
  $('#set-volume').value = settings.volume;
}
OPT_MAP.forEach(([a, b, key]) => {
  [a, b].forEach(sel => $(sel).addEventListener('change', () => {
    settings[key] = $(sel).checked;
    save(KEY.settings, settings);
    syncOptionInputs();
  }));
});
['#opt-volume', '#set-volume'].forEach(sel => $(sel).addEventListener('input', () => {
  settings.volume = Number($(sel).value);
  save(KEY.settings, settings);
  Audio_.setVolume(settings.volume);
  syncOptionInputs();
}));

$('#btn-go').addEventListener('click', () => {
  closeSheet('#start-sheet');
  settings.lastDuration = pendingMinutes;
  save(KEY.settings, settings);
  Session.start(pending, pendingMinutes);
});
$('#btn-cancel-start').addEventListener('click', () => closeSheet('#start-sheet'));
$('#btn-close-info').addEventListener('click', () => closeSheet('#info-sheet'));

/* ---------- Séance ---------- */
$('#btn-pause').addEventListener('click', () => Session.togglePause());
$('#btn-stop').addEventListener('click', () => Session.end(false));
$('#btn-close-session').addEventListener('click', () => {
  if (confirm('Quitter la séance en cours ?')) Session.end(false);
});
$('#btn-done-ok').addEventListener('click', () => { show('home'); renderAll(); });

/* ---------- Exercice personnalisé ---------- */
$('#btn-add').addEventListener('click', () => openSheet('#custom-sheet'));
$('#btn-cancel-custom').addEventListener('click', () => closeSheet('#custom-sheet'));
$('#btn-save-custom').addEventListener('click', () => {
  const n = ($('#c-name').value || '').trim() || 'Respiration personnalisée';
  const p = {
    in: Math.min(30, Math.max(1, Number($('#c-in').value) || 4)),
    holdIn: Math.min(30, Math.max(0, Number($('#c-hin').value) || 0)),
    out: Math.min(30, Math.max(1, Number($('#c-out').value) || 4)),
    holdOut: Math.min(30, Math.max(0, Number($('#c-hout').value) || 0))
  };
  const label = [p.in, p.holdIn, p.out, p.holdOut].filter(x => x > 0).join('-');
  customs.push({
    id: 'custom-' + Date.now(), name: n, sub: 'Personnalisé ' + label,
    icon: 'lotus', color: '#8fd67a', defaultMin: 5, custom: true, p: p,
    info: 'Exercice créé par vous.\n\n' + [
      p.in ? 'Inspiration ' + p.in + ' s' : '', p.holdIn ? 'Poumons pleins ' + p.holdIn + ' s' : '',
      p.out ? 'Expiration ' + p.out + ' s' : '', p.holdOut ? 'Poumons vides ' + p.holdOut + ' s' : ''
    ].filter(Boolean).join(' — ')
  });
  save(KEY.custom, customs);
  closeSheet('#custom-sheet');
  renderAll();
});

/* ---------- Réglages ---------- */
$('#btn-settings').addEventListener('click', () => { syncOptionInputs(); openSheet('#settings-sheet'); });
$('#btn-close-settings').addEventListener('click', () => closeSheet('#settings-sheet'));
$('#btn-reset-stats').addEventListener('click', () => {
  if (confirm('Effacer définitivement toutes vos séances enregistrées ?')) {
    sessions = []; save(KEY.sessions, sessions); renderStats();
  }
});

/* ------------------------------------------------------------
   9. Démarrage
------------------------------------------------------------ */
renderAll();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
