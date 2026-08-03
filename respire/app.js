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
  wind:       '<path d="M3 9h9.5a3 3 0 1 0-3-3"/><path d="M3 14h13a3.4 3.4 0 1 1-3.4 3.4"/><path d="M3 11.5h7" opacity=".55"/>',
  trash:      '<path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"/>',
  info:       '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  heart:      '<path d="M12 20s-7-4.5-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7-2.8c0 4.7-7 14.8-7 14.8z"/>'
};
const svg = (name, cls) => `<svg viewBox="0 0 24 24" class="${cls || ''}">${ICONS[name] || ''}</svg>`;

/* ------------------------------------------------------------
   2. Références scientifiques
   Chaque exercice porte un niveau de preuve honnête :
     solide  — effets démontrés de façon reproductible
     modere  — effets probables, littérature moins directe
     limite  — peu d'études, ou études de faible qualité
------------------------------------------------------------ */
const EVIDENCE_LABEL = { solide: 'Preuves solides', modere: 'Preuves modérées', limite: 'Preuves limitées' };
const EVIDENCE_COLOR = { solide: '#5ad19a', modere: '#f4c04f', limite: '#ff8f6b' };

const REF = {
  slow6:   { t: 'Laborde et al., 2022 — respiration guidée à 6 cycles/min (Psychophysiology)', u: 'https://onlinelibrary.wiley.com/doi/10.1111/psyp.13952' },
  placebo: { t: 'Fincham et al., 2023 — cohérence 5,5/min contre placebo actif, 400 participants (Scientific Reports)', u: 'https://www.nature.com/articles/s41598-023-49279-8' },
  meta:    { t: 'Fincham et al., 2023 — méta-analyse des essais randomisés sur le breathwork (Scientific Reports)', u: 'https://www.nature.com/articles/s41598-022-27247-y' },
  balban:  { t: 'Balban et al., 2023 — 3 respirations comparées à la méditation, 5 min/jour (Stanford)', u: 'https://med.stanford.edu/news/insights/2023/02/cyclic-sighing-can-help-breathe-away-anxiety.html' },
  ratio:   { t: 'Van Diest et al., 2014 — le ratio inspiration/expiration module l\'effet', u: 'https://link.springer.com/article/10.1007/s10484-014-9253-x' },
  ratio2:  { t: 'Steffen et al., 2024 — une expiration plus longue augmente-t-elle vraiment la VFC ?', u: 'https://link.springer.com/article/10.1007/s10484-024-09637-2' },
  bp:      { t: 'Gonçalves et al., 2022 — respiration lente et pression artérielle (méta-analyse)', u: 'https://onlinelibrary.wiley.com/doi/full/10.1002/hsr2.636' },
  rf:      { t: 'La fréquence de résonance est individuelle (4,5–6,5 cycles/min)', u: 'https://www.nature.com/articles/s41598-021-87867-8' },
  s478:    { t: 'Effets de la respiration 4-7-8 sur la VFC et la pression artérielle', u: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9277512/' },
  sigh:    { t: 'Origine cérébrale du réflexe de soupir (UCLA / Stanford, Science 2017)', u: 'https://newsroom.ucla.edu/releases/ucla-and-stanford-researchers-pinpoint-origin-of-sighing-reflex-in-the-brain' }
};

/* ------------------------------------------------------------
   3. Catalogue d'exercices
------------------------------------------------------------ */
const TECHNIQUES = [
  {
    id: 'coh-5-5', name: 'Cohérence cardiaque', sub: 'Équilibre 5-5',
    icon: 'heartPulse', color: '#7c8cff', defaultMin: 5,
    p: { in: 5, holdIn: 0, out: 5, holdOut: 0 },
    ev: 'solide',
    info: "6 respirations par minute (0,1 Hz) : le rythme le plus étudié de toute la littérature sur la respiration lente.\n\nÀ cette cadence, la respiration entre en résonance avec les oscillations naturelles de la pression artérielle. Le résultat est mesurable et reproductible : forte augmentation de la variabilité de la fréquence cardiaque, sensibilité du baroréflexe restaurée, bascule vers l'activité parasympathique.",
    why: "L'effet physiologique est solidement établi. L'effet ressenti l'est moins : dans le plus grand essai contrôlé disponible (400 participants, 4 semaines), respirer à 5,5/min n'a pas fait mieux qu'une respiration placebo à 12/min sur le stress subjectif — les deux groupes se sont améliorés. Autrement dit, le bénéfice corporel est réel, mais une partie du mieux-être vient du fait de s'asseoir 5 minutes et de respirer, pas du rythme exact.",
    refs: [REF.slow6, REF.placebo, REF.rf]
  },
  {
    id: 'sigh', name: 'Soupir physiologique', sub: 'Apaisement rapide 3-1-7',
    icon: 'wind', color: '#5ad19a', defaultMin: 5,
    p: { in: 3, in2: 1, holdIn: 0, out: 7, holdOut: 0 },
    ev: 'modere',
    info: "Deux inspirations enchaînées par le nez — une ample, puis une courte par-dessus — suivies d'une longue expiration lâchée par la bouche.\n\nC'est le soupir que le corps produit spontanément plusieurs fois par heure. La seconde inspiration rouvre les alvéoles affaissées et relance les échanges gazeux ; l'expiration longue et passive fait chuter le rythme cardiaque.",
    why: "C'est la seule technique de cette liste à avoir gagné une comparaison directe : dans un essai randomisé de Stanford (5 min/jour pendant 1 mois), elle a amélioré l'humeur et abaissé la fréquence respiratoire davantage que la respiration carrée, que l'hyperventilation cyclique et que la méditation de pleine conscience. C'est aussi celle dont le bénéfice augmentait le plus avec la régularité. Un seul essai, donc à confirmer — mais c'est le meilleur point de départ.",
    refs: [REF.balban, REF.sigh]
  },
  {
    id: 'coh-4-6', name: 'Cohérence cardiaque', sub: 'Relaxation 4-6',
    icon: 'heartWave', color: '#4fd1a5', defaultMin: 5,
    p: { in: 4, holdIn: 0, out: 6, holdOut: 0 },
    ev: 'modere',
    info: "Toujours 6 cycles par minute, mais avec une expiration plus longue que l'inspiration.\n\nLe cœur ralentit pendant l'expiration : allonger celle-ci prolonge mécaniquement ce ralentissement. Un choix confortable pour la fin de journée.",
    why: "Le rythme (6/min) est ce qui est bien démontré. L'avantage propre du ratio, lui, ne l'est pas : sur neuf études comparant différents ratios inspiration/expiration, les auteurs arrivent à quatre conclusions différentes. Prenez donc ce réglage pour son confort, pas pour une supériorité prouvée sur le 5-5.",
    refs: [REF.ratio, REF.ratio2, REF.slow6]
  },
  {
    id: 'coh-6-4', name: 'Cohérence cardiaque', sub: 'Dynamique 6-4',
    icon: 'target', color: '#ff7a6b', defaultMin: 5,
    p: { in: 6, holdIn: 0, out: 4, holdOut: 0 },
    ev: 'modere',
    info: "Inspiration plus longue que l'expiration, en gardant les 6 cycles par minute.\n\nLégèrement plus tonique que le 5-5, tout en conservant le rythme de résonance. À utiliser le matin ou avant une prise de parole, quand il faut être calme mais alerte.",
    why: "Même situation que le 4-6 : c'est la cadence de 6/min qui porte les preuves, pas l'orientation du ratio. L'effet « tonique » est plausible physiologiquement (l'inspiration accélère le cœur) mais n'a pas été isolé dans un essai clinique.",
    refs: [REF.ratio, REF.slow6]
  },
  {
    id: 'sq-4-4-4-4', name: 'Respiration carrée', sub: 'Détente profonde 4-4-4-4',
    icon: 'square', color: '#4fc3d9', defaultMin: 5,
    p: { in: 4, holdIn: 4, out: 4, holdOut: 4 },
    ev: 'limite',
    info: "Quatre temps égaux : inspiration, poumons pleins, expiration, poumons vides. Soit 3,75 cycles par minute.\n\nLes rétentions occupent l'attention et rendent la pratique très « ancrante » — c'est la raison pour laquelle militaires et sportifs l'utilisent pour reprendre le contrôle sous pression.",
    why: "Elle a bien été testée dans l'essai de Stanford et a amélioré l'humeur — mais moins que le soupir physiologique. Le rythme obtenu est nettement sous la plage de résonance (4,5–6,5/min), ce qui explique probablement des effets cardiaques moindres qu'avec le 5-5. L'intérêt réel est attentionnel plus que physiologique.",
    refs: [REF.balban, REF.rf]
  },
  {
    id: 'r-4-8', name: 'Respiration apaisante', sub: 'Anti-anxiété 4-8',
    icon: 'wave', color: '#9d8cff', defaultMin: 5,
    p: { in: 4, holdIn: 0, out: 8, holdOut: 0 },
    ev: 'modere',
    info: "Expiration deux fois plus longue que l'inspiration, à 5 cycles par minute.\n\nRythme lent, sans rétention, sans effort : le réglage le plus confortable pour une pratique longue en cas d'anxiété ou de ruminations.",
    why: "Le rythme tombe dans la plage de résonance, ce qui est l'élément le mieux étayé. Plusieurs travaux montrent qu'une expiration allongée augmente les indices vagaux à court terme, mais d'autres ne retrouvent pas cet avantage une fois la cadence égalisée. À retenir : c'est la lenteur qui compte, le 1:2 est un confort.",
    refs: [REF.ratio2, REF.slow6]
  },
  {
    id: 'medit', name: 'Respiration méditative', sub: 'Ancrage 6-6',
    icon: 'meditate', color: '#4fd1a5', defaultMin: 10,
    p: { in: 6, holdIn: 0, out: 6, holdOut: 0 },
    ev: 'solide',
    info: "5 respirations par minute, temps égaux. Un rythme lent et régulier, idéal pour une séance longue.\n\nPour beaucoup de gens, la fréquence de résonance personnelle se situe justement entre 5 et 6 cycles par minute.",
    why: "Même socle de preuves que le 5-5 : la plage 4,5–6,5 cycles/min est celle où la variabilité cardiaque et le baroréflexe augmentent le plus. Comme cette fréquence optimale varie d'une personne à l'autre, essayez le 5-5 et le 6-6 et gardez celui où vous vous sentez le plus stable.",
    refs: [REF.rf, REF.slow6]
  },
  {
    id: 'r-4-7-8', name: 'Respiration 4-7-8', sub: 'Endormissement',
    icon: 'moon', color: '#f06fa0', defaultMin: 3,
    p: { in: 4, holdIn: 7, out: 8, holdOut: 0 },
    ev: 'limite',
    info: "Inspirez 4 s, retenez 7 s, expirez lentement 8 s. Popularisée par le Dr Andrew Weil.\n\nLa longue rétention rend l'exercice exigeant : commencez par 4 cycles, et arrêtez si vous ressentez une gêne.",
    why: "Quelques essais randomisés de petite taille rapportent une baisse de l'anxiété et un endormissement plus rapide, ainsi qu'une baisse immédiate de fréquence cardiaque et de pression systolique. Ce sont des études courtes, souvent sans groupe contrôle actif : le résultat est encourageant mais fragile. Attention aussi aux promesses sur l'hypertension : dans les méta-analyses, l'effet de la respiration lente sur la pression artérielle disparaît quand on écarte les essais financés par les fabricants d'appareils.",
    refs: [REF.s478, REF.bp]
  },
  {
    id: 'r-4-4', name: 'Respiration 4-4', sub: 'Contrôle rapide du stress',
    icon: 'medal', color: '#f4c04f', defaultMin: 3,
    p: { in: 4, holdIn: 0, out: 4, holdOut: 0 },
    ev: 'modere',
    info: "7,5 respirations par minute : plus rapide que la cohérence cardiaque, donc plus facile à tenir quand on débute, qu'on est essoufflé ou très agité.\n\nParfait pour une pause d'une à trois minutes.",
    why: "C'est un compromis assumé : le rythme reste bien en dessous de la respiration spontanée (12–16/min) et va dans le bon sens, mais il se situe au-dessus de la plage de résonance, donc l'amplification de la variabilité cardiaque y est plus faible qu'à 6/min. Utile comme marche d'entrée, avant de passer au 5-5.",
    refs: [REF.slow6, REF.rf]
  },
  {
    id: 'r-4-4-6-2', name: 'Respiration 4-4-6-2', sub: 'Réduction du stress',
    icon: 'lotus', color: '#6fb7ff', defaultMin: 5,
    p: { in: 4, holdIn: 4, out: 6, holdOut: 2 },
    ev: 'limite',
    info: "Cycle asymétrique de 16 secondes : inspiration, poumons pleins, expiration longue, courte pause à vide.\n\nUne variante répandue dans les applications de respiration, pour ceux qui aiment les rétentions mais veulent une expiration dominante.",
    why: "Aucune étude ne porte sur ce motif précis. Ce que l'on peut dire : à 3,75 cycles par minute il est plus lent que la plage de résonance, et il combine des éléments dont chacun est étayé séparément (respiration lente, expiration allongée). Traitez-le comme une variante de confort, pas comme un protocole validé.",
    refs: [REF.rf, REF.ratio2]
  },
  {
    id: 'r-stim', name: 'Respiration stimulante', sub: 'Réveil et énergie 6-2',
    icon: 'spark', color: '#ffa15c', defaultMin: 2,
    p: { in: 6, holdIn: 2, out: 2, holdOut: 0 },
    ev: 'limite',
    info: "Inspiration ample, rétention courte, expiration brève : le profil inverse des exercices calmants. Sollicite le système sympathique.\n\nÀ réserver au matin ou à un coup de fatigue. À éviter le soir, en cas d'anxiété, de grossesse ou de trouble cardiaque ou respiratoire. Arrêtez immédiatement en cas d'étourdissement ou de fourmillements.",
    why: "Dans l'essai de Stanford, la version la plus proche (hyperventilation cyclique avec rétention) a bien amélioré l'humeur, mais moins que les techniques à expiration dominante, et c'est la seule qui augmente l'éveil physiologique plutôt que de le réduire. Rien ne démontre un gain d'énergie durable : considérez-la comme un coup de fouet ponctuel.",
    refs: [REF.balban]
  }
];

const PHASE_ORDER = ['in', 'in2', 'holdIn', 'out', 'holdOut'];
const PHASE_TEXT = { in: 'Inspirez', in2: 'Encore un peu', holdIn: 'Retenez', out: 'Expirez', holdOut: 'Poumons vides' };
const PHASE_SPEECH = { in: 'Inspirez', in2: 'Encore', holdIn: 'Retenez', out: 'Expirez', holdOut: 'Poumons vides' };
const LEAD_IN = 3;                 // secondes de préparation
const DURATIONS = [1, 2, 3, 5, 10, 15, 20, 30];

/* ------------------------------------------------------------
   4. Stockage local
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
  { voice: true, tones: true, drone: true, vibrate: false, wakeLock: true, volume: 70, presets: {} },
  load(KEY.settings, {})
);
if (!settings.presets || typeof settings.presets !== 'object') settings.presets = {};

/* Options de la séance en cours (issues du préréglage de l'exercice). */
const OPT_KEYS = ['voice', 'tones', 'drone', 'vibrate', 'wakeLock'];
let active = optionsFor(null);

/* Préréglage mémorisé pour un exercice, sinon les réglages par défaut. */
function optionsFor(tech) {
  const o = { minutes: (tech && tech.defaultMin) || 5 };
  OPT_KEYS.forEach(k => { o[k] = settings[k]; });
  const saved = tech && settings.presets[tech.id];
  if (saved) {
    if (typeof saved.minutes === 'number') o.minutes = saved.minutes;
    OPT_KEYS.forEach(k => { if (typeof saved[k] === 'boolean') o[k] = saved[k]; });
  }
  return o;
}
function savePreset(techId, opts) {
  const stored = { minutes: opts.minutes };
  OPT_KEYS.forEach(k => { stored[k] = opts[k]; });
  settings.presets[techId] = stored;
  save(KEY.settings, settings);
}
const hasPreset = id => !!settings.presets[id];

const allTechniques = () => TECHNIQUES.concat(customs);
const findTech = id => allTechniques().find(t => t.id === id);

/* ------------------------------------------------------------
   5. Utilitaires
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
  if (t.p.in2) parts.push('2ᵉ inspiration ' + t.p.in2 + ' s');
  if (t.p.holdIn) parts.push('Retenez ' + t.p.holdIn + ' s');
  if (t.p.out) parts.push('Expirez ' + t.p.out + ' s');
  if (t.p.holdOut) parts.push('Poumons vides ' + t.p.holdOut + ' s');
  return parts.join(' — ');
}

/* Remplissage des poumons au début et à la fin d'une phase (0 = vides, 1 = pleins).
   Sert à la fois à l'animation de la bulle et au glissando du son continu. */
function phaseRange(type, doubleIn) {
  switch (type) {
    case 'in': return [0, doubleIn ? 0.72 : 1];
    case 'in2': return [0.72, 1];
    case 'holdIn': return [1, 1];
    case 'out': return [1, 0];
    default: return [0, 0];
  }
}
function dayKey(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

/* ------------------------------------------------------------
   6. Moteur audio
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
    else if (type === 'in2') { this.note(t, 783.99, 0.14, 0.24); }
    else if (type === 'out') { this.note(t, 440.00, 0.13, 0.28); this.note(t + 0.15, 329.63, 0.22, 0.26); }
    else { this.note(t, 493.88, 0.12, 0.20); }
  },

  /* Programme l'intégralité de la séance d'un seul coup. */
  schedule(t0, timeline, total) {
    const opts = active;

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
      const doubleIn = timeline.some(ph => ph.type === 'in2');
      f.setValueAtTime(LO, t0);
      timeline.forEach(ph => {
        const a = t0 + ph.start, b = t0 + ph.end;
        const r = phaseRange(ph.type, doubleIn);
        const fa = LO * Math.pow(HI / LO, r[0]), fb = LO * Math.pow(HI / LO, r[1]);
        f.setValueAtTime(fa, a);
        if (Math.abs(fb - fa) > 0.5) f.exponentialRampToValueAtTime(fb, b);
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
    if (!active.voice || !('speechSynthesis' in window)) return;
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
   7. Moteur de séance
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
    this.doubleIn = !!tech.p.in2;
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
    if (active.voice) Voice.say('Préparez-vous');
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

      const r = phaseRange(ph.type, this.doubleIn);
      scale = 0.42 + 0.58 * (r[0] + (r[1] - r[0]) * ease);

      if (i !== this.lastPhase) {
        this.lastPhase = i;
        $('#s-cycles').textContent = String(ph.cycle - (ph.type === 'in' ? 1 : 0));
        // repères tardifs ignorés (onglet réveillé après throttling)
        if (e - ph.start < 1.2) {
          Voice.say(PHASE_SPEECH[ph.type]);
          if (active.vibrate && navigator.vibrate) navigator.vibrate(ph.type === 'in' ? 60 : [40, 60, 40]);
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

    if (completed && active.voice) Voice.say('Séance terminée. Bravo.');

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
    if (!active.wakeLock || !('wakeLock' in navigator)) return;
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
   8. Affichage
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
   9. Interactions
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
      openInfoSheet(tech);
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

/* ---------- Fiche d'information ---------- */
function openInfoSheet(tech) {
  $('#info-title').textContent = tech.name + ' — ' + tech.sub;
  $('#info-rhythm').textContent = rhythmLabel(tech) + '  ·  ' + breathsPerMin(tech) + ' respirations/min';
  $('#info-text').textContent = tech.info;

  const badge = $('#info-badge');
  if (tech.ev) {
    badge.textContent = EVIDENCE_LABEL[tech.ev];
    badge.style.color = EVIDENCE_COLOR[tech.ev];
    badge.style.borderColor = EVIDENCE_COLOR[tech.ev];
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }

  const why = $('#info-why');
  why.innerHTML = tech.why
    ? '<h4>Ce que dit la recherche</h4><p>' + escapeHtml(tech.why) + '</p>'
    : '';
  why.classList.toggle('hidden', !tech.why);

  const refs = $('#info-refs');
  refs.innerHTML = (tech.refs && tech.refs.length)
    ? '<h4>Sources</h4>' + tech.refs.map(r =>
        '<a href="' + r.u + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(r.t) + '</a>').join('')
    : '';
  refs.classList.toggle('hidden', !(tech.refs && tech.refs.length));

  openSheet('#info-sheet');
}
const breathsPerMin = t => String(Math.round(600 / cycleDuration(t)) / 10).replace('.', ',');

/* ---------- Lancement d'une séance ---------- */
/* Chaque exercice garde en mémoire sa durée et ses options : rouvrir la
   fiche d'un exercice restitue exactement les réglages de la dernière fois. */
let pending = null, pendingOpts = optionsFor(null);

const START_OPTS = [
  ['#opt-voice', 'voice'], ['#opt-tones', 'tones'], ['#opt-drone', 'drone'],
  ['#opt-vibe', 'vibrate'], ['#opt-wake', 'wakeLock']
];
const SET_OPTS = [
  ['#set-voice', 'voice'], ['#set-tones', 'tones'], ['#set-drone', 'drone'],
  ['#set-vibe', 'vibrate'], ['#set-wake', 'wakeLock']
];

function openStartSheet(tech) {
  pending = tech;
  pendingOpts = optionsFor(tech);
  $('#start-title').textContent = tech.name + ' — ' + tech.sub;
  $('#start-rhythm').textContent = rhythmLabel(tech) + '  ·  ' + breathsPerMin(tech) + ' respirations/min';
  $('#preset-hint').textContent = hasPreset(tech.id)
    ? 'Réglages mémorisés pour cet exercice.'
    : 'Vos réglages seront mémorisés pour cet exercice.';
  syncStartInputs();
  openSheet('#start-sheet');
}

function syncStartInputs() {
  $('#duration-chips').innerHTML = DURATIONS.map(m =>
    '<button class="chip' + (m === pendingOpts.minutes ? ' active' : '') + '" data-min="' + m + '">' + m + ' min</button>'
  ).join('');
  START_OPTS.forEach(([sel, key]) => { $(sel).checked = pendingOpts[key]; });
  $('#opt-volume').value = settings.volume;
}

$('#duration-chips').addEventListener('click', ev => {
  const c = ev.target.closest('.chip');
  if (!c) return;
  pendingOpts.minutes = Number(c.dataset.min);
  document.querySelectorAll('#duration-chips .chip').forEach(x => x.classList.toggle('active', x === c));
});

START_OPTS.forEach(([sel, key]) => $(sel).addEventListener('change', () => {
  pendingOpts[key] = $(sel).checked;
}));

/* Le panneau Réglages définit les valeurs par défaut des exercices
   qui n'ont pas encore de préréglage. */
function syncSettingsInputs() {
  SET_OPTS.forEach(([sel, key]) => { $(sel).checked = settings[key]; });
  $('#set-volume').value = settings.volume;
  const n = Object.keys(settings.presets).length;
  $('#btn-reset-presets').textContent = n
    ? 'Oublier les réglages mémorisés (' + n + ' exercice' + (n > 1 ? 's' : '') + ')'
    : 'Aucun réglage mémorisé pour l\'instant';
  $('#btn-reset-presets').disabled = !n;
}
SET_OPTS.forEach(([sel, key]) => $(sel).addEventListener('change', () => {
  settings[key] = $(sel).checked;
  save(KEY.settings, settings);
}));

/* Le volume reste un réglage global (il dépend de l'appareil, pas de l'exercice). */
['#opt-volume', '#set-volume'].forEach(sel => $(sel).addEventListener('input', () => {
  settings.volume = Number($(sel).value);
  save(KEY.settings, settings);
  Audio_.setVolume(settings.volume);
  $('#opt-volume').value = settings.volume;
  $('#set-volume').value = settings.volume;
}));

$('#btn-go').addEventListener('click', () => {
  closeSheet('#start-sheet');
  savePreset(pending.id, pendingOpts);
  active = Object.assign({}, pendingOpts);
  Session.start(pending, pendingOpts.minutes);
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
$('#btn-settings').addEventListener('click', () => { syncSettingsInputs(); openSheet('#settings-sheet'); });
$('#btn-close-settings').addEventListener('click', () => closeSheet('#settings-sheet'));
$('#btn-reset-presets').addEventListener('click', () => {
  if (!Object.keys(settings.presets).length) return;
  if (confirm('Oublier les réglages mémorisés pour chaque exercice ?')) {
    settings.presets = {};
    save(KEY.settings, settings);
    syncSettingsInputs();
  }
});
const ALL_REFS = [REF.slow6, REF.placebo, REF.meta, REF.balban, REF.ratio, REF.ratio2, REF.rf, REF.bp, REF.s478, REF.sigh];
$('#btn-science').addEventListener('click', () => {
  $('#science-refs').innerHTML = '<h4>Sources</h4>' + ALL_REFS.map(r =>
    '<a href="' + r.u + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(r.t) + '</a>').join('');
  closeSheet('#settings-sheet');
  openSheet('#science-sheet');
});
$('#btn-close-science').addEventListener('click', () => closeSheet('#science-sheet'));

$('#btn-reset-stats').addEventListener('click', () => {
  if (confirm('Effacer définitivement toutes vos séances enregistrées ?')) {
    sessions = []; save(KEY.sessions, sessions); renderStats();
  }
});

/* ------------------------------------------------------------
   10. Démarrage
------------------------------------------------------------ */
renderAll();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
