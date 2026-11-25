/* Figuras de ejercicios · Plan 70.3
   Dibujos propios (SVG generado), sin licencias de terceros.
   Uso: Figuras.tiene(nombre) · Figuras.svg(nombre, t, {flechas}) · Figuras.info(nombre) */
(function () {
  const L = { thigh: 40, shin: 40, torso: 52, neck: 6, head: 10, up: 27, fore: 25 };
  const G = 185;
  const rad = d => d * Math.PI / 180;
  const P = p => p[0].toFixed(1) + ',' + p[1].toFixed(1);

  function ik(A, C, l1, l2, sign) {
    const dx = C[0] - A[0], dy = C[1] - A[1], d = Math.hypot(dx, dy), th = Math.atan2(dy, dx);
    if (d >= l1 + l2 - 0.01) return { j: [A[0] + l1 * Math.cos(th), A[1] + l1 * Math.sin(th)], e: [A[0] + (l1 + l2) * Math.cos(th), A[1] + (l1 + l2) * Math.sin(th)] };
    const a = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))), t = th + sign * a;
    return { j: [A[0] + l1 * Math.cos(t), A[1] + l1 * Math.sin(t)], e: C };
  }
  function rot(v, a) { a = rad(a); return [v[0] * Math.cos(a) + v[1] * Math.sin(a), -v[0] * Math.sin(a) + v[1] * Math.cos(a)]; }
  function foot(ank, ang) { const h = rot([-3, 4], ang), t = rot([12, 4], ang); return [[ank[0] + h[0], ank[1] + h[1]], [ank[0] + t[0], ank[1] + t[1]]]; }
  const ln = (pts, cls, w) => (cls === 'fb' ? `<polyline points="${pts.map(P).join(' ')}" class="fh" stroke-width="${w + 3.5}"/>` : '') + `<polyline points="${pts.map(P).join(' ')}" class="${cls}" stroke-width="${w}"/>`;
  const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1; return [dx / d, dy / d]; };

  /* ---------- equipo ---------- */
  const EQ = {
    /* pesa rusa: asa en la mano y campana hacia 'v' (abajo = colgando) */
    kb: (h, c) => KB(h, [0, 1]),
    kbGoblet: (h, c) => KB([h[0], h[1] + 1], [0, 1]),
    kbArm: (h, c) => KB(h, unit(c.elbow, h)),                 // sigue el antebrazo (swing)
    kbRack: (h, c) => { const u = unit(h, c.elbow); return KB(h, [u[0] * .8 - u[1] * .35, u[1] * .8 + u[0] * .35]); }, // apoyada sobre el antebrazo
    kbUp: (h, c) => KB(h, [0, -1]),
    kbHip2: (h, c) => `<g opacity=".85">${KB([c.hip[0] - 18, c.hip[1] - 13], [1, 0])}</g>`,
    shoe: h => `<g transform="translate(${h[0].toFixed(1)},${(h[1] - 6).toFixed(1)})"><path d="M-7 3 L-7 -3 Q-6 -6 -2 -6 L1 -4 Q6 -4 8 0 L8 3 Z" class="fm"/></g>`,
    kbHip: (h, c) => KB([c.hip[0] - 11, c.hip[1] - 11], [1, 0]),   // descansando sobre la cadera
    db: h => `<g transform="translate(${h[0].toFixed(1)},${(h[1] + 2).toFixed(1)})"><rect x="-2.5" y="-9" width="5" height="18" rx="2" class="fm"/><rect x="-5" y="-11" width="10" height="5" rx="2" class="fm"/><rect x="-5" y="6" width="10" height="5" rx="2" class="fm"/></g>`
  };
  function KB(h, v, sobre) {
    const ang = Math.atan2(v[1], v[0]) * 180 / Math.PI - 90;
    return `<g transform="translate(${h[0].toFixed(1)},${h[1].toFixed(1)}) rotate(${ang.toFixed(1)}) scale(.8)">` +
      `<path d="M-6.5 9 C-7.6 0 -5.8 -3.4 0 -3.4 C5.8 -3.4 7.6 0 6.5 9" fill="none" class="fkh" stroke-width="3.4" stroke-linecap="round"/>` +
      `<circle cx="0" cy="16.5" r="10.5" class="fkb"/><rect x="-6.5" y="24.5" width="13" height="3.2" rx="1.2" class="fkb"/>` +
      `<ellipse cx="-4" cy="13" rx="2.6" ry="3.8" class="fkl"/></g>`;
  }
  const floor = `<line x1="4" y1="${G}" x2="216" y2="${G}" class="fs"/>`;
  const rect = (x, y, w, h, r = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" class="fp"/>`;
  const S = {
    wallL: x => `<rect x="${x - 14}" y="0" width="14" height="${G}" class="fp"/><line x1="${x}" y1="0" x2="${x}" y2="${G}" class="fe"/>`,
    wallR: x => `<rect x="${x}" y="0" width="14" height="${G}" class="fp"/><line x1="${x}" y1="0" x2="${x}" y2="${G}" class="fe"/>`,
    bench: (x, w, top) => rect(x, top, w, 7) + rect(x + 4, top + 7, 6, G - top - 7, 1) + rect(x + w - 10, top + 7, 6, G - top - 7, 1),
    box: (x, w, top) => rect(x, top, w, G - top, 3),
    mat: (x, w) => `<rect x="${x}" y="${G - 3}" width="${w}" height="4" rx="2" class="fp"/>`
  };

  /* ---------- figura lateral (mira a la derecha) ---------- */
  function side(p) {
    const hip = p.hip, lean = rad(p.lean || 0);
    const sh = p.sh || [hip[0] + L.torso * Math.sin(lean), hip[1] - L.torso * Math.cos(lean)];
    let hd;
    if (p.hd) hd = p.hd; else if (p.sh) { const u = unit(hip, sh); hd = [sh[0] + u[0] * 16, sh[1] + u[1] * 16]; }
    else { const hl = rad(p.headLean != null ? p.headLean : (p.lean || 0) * 0.6); hd = [sh[0] + 16 * Math.sin(hl), sh[1] - 16 * Math.cos(hl)]; }
    /* ancho: cuerpo de frente a la cámara (plancha lateral, Copenhagen): torso con volumen, caderas y hombros separados */
    const W = p.wide > 0.5;
    let perp = [0, 0];
    if (W) { const u = unit(hip, sh); perp = [u[1], -u[0]]; if (perp[1] > 0) perp = [-perp[0], -perp[1]]; }
    const off = (pt, k) => [pt[0] + perp[0] * k, pt[1] + perp[1] * k];
    const hipN = W ? off(hip, 7) : hip, hipF = W ? off(hip, -7) : hip, shN = W ? off(sh, 14) : sh, shF = W ? off(sh, -14) : sh;
    const leg = (root, ank, fa, ks, kO) => { const r = kO ? { j: kO, e: ank } : ik(root, ank, L.thigh, L.shin, ks || -1); const f = foot(r.e, fa || 0); return { leg: [root, r.j, r.e], ft: [f[0], r.e, f[1]], knee: r.j }; };
    const arm = (root, h, es) => { const r = ik(root, h, L.up, L.fore, es || 1); return { pts: [root, r.j, r.e], hand: r.e }; };
    const lF = leg(hipF, p.ankF, p.footF, p.kneeSignF, p.kneeF), lN = leg(hipN, p.ankN, p.footN, p.kneeSignN, p.kneeN);
    const aF = arm(shF, p.handF || p.handN, p.elbowF), aN = arm(shN, p.handN, p.elbowN);
    const pts = { hip, sh, hd, kneeN: lN.knee, kneeF: lF.knee, handN: aN.hand, handF: aF.hand, ankN: p.ankN, ankF: p.ankF, elbowN: aN.pts[1], elbowF: aF.pts[1], belt: [hip[0] + 3, hip[1] + 4], beltKB: [hip[0] + 5, hip[1] + 20] };
    const at = w => Array.isArray(w) ? w : pts[w];
    const eq = (p.eq || []).map(([t, w]) => EQ[t](at(w), { elbow: w === 'handF' ? aF.pts[1] : aN.pts[1], hip }));
    const isF = w => typeof w === 'string' && w.endsWith('F');
    const eqF = eq.filter((_, i) => isF(p.eq[i][1])).join(''), eqN = eq.filter((_, i) => !isF(p.eq[i][1])).join('');
    const cords = (p.cords || []).map(([a, b, c]) => { const A = at(a), B = at(b); return `<line x1="${A[0].toFixed(1)}" y1="${A[1].toFixed(1)}" x2="${B[0].toFixed(1)}" y2="${B[1].toFixed(1)}" class="${c || 'fcord'}"/>`; }).join('');
    let s = '';
    if (p.air > 0.02) {
      const gy = p.airY || G, fx = p.airX != null ? p.airX : (p.ankN[0] + p.ankF[0]) / 2 + 4;
      s += `<ellipse cx="${fx.toFixed(1)}" cy="${gy}" rx="${(18 - 7 * p.air).toFixed(1)}" ry="3.2" class="fsh" opacity="${(0.2 + 0.25 * (1 - p.air)).toFixed(2)}"/>`;
      if (p.air > 0.6) { const o = ((p.air - 0.6) / 0.4).toFixed(2), y1 = p.airLY != null ? p.airLY : Math.max(p.ankN[1], p.ankF[1]) + 12; s += `<g opacity="${o}"><line x1="${fx - 8}" y1="${y1}" x2="${fx - 8}" y2="${y1 + 9}" class="fvel"/><line x1="${fx + 1}" y1="${y1 + 3}" x2="${fx + 1}" y2="${y1 + 13}" class="fvel"/><line x1="${fx + 10}" y1="${y1}" x2="${fx + 10}" y2="${y1 + 9}" class="fvel"/></g>`; }
    }
    if (W) {
      s += ln(lF.leg, 'fb', 8.5) + ln(lF.ft, 'fb', 5.5) + ln(aF.pts, 'fb', 7) + eqF;
      s += `<polygon points="${[shN, shF, hipF, hipN].map(P).join(' ')}" class="ftorso"/>` + ln([sh, hd], 'fb', 6);
    } else {
      s += eqF + ln(aF.pts, 'ff', 6.5) + ln(lF.leg, 'ff', 8) + ln(lF.ft, 'ff', 5);
      /* torso de perfil con volumen: pecho más ancho que la cintura */
      const u = unit(hip, sh), n = [-u[1], u[0]], tw = (pt, k1, k2) => [[pt[0] + n[0] * k1, pt[1] + n[1] * k1], [pt[0] - n[0] * k2, pt[1] - n[1] * k2]];
      const [h1, h2] = tw(hip, 7, 7), [c1, c2] = tw([hip[0] + u[0] * 36 - n[0] * (p.arch || 0) * 9, hip[1] + u[1] * 36 - n[1] * (p.arch || 0) * 9], 9, 8.5), [s1, s2] = tw(sh, 7.5, 7);
      s += `<path d="M${P(h1)} L${P(c1)} Q${P([sh[0] + n[0] * 9, sh[1] + n[1] * 9])} ${P(s1)} L${P(s2)} Q${P([sh[0] - n[0] * 8.5, sh[1] - n[1] * 8.5])} ${P(c2)} L${P(h2)} Z" class="fhalo2"/>`;
      s += `<path d="M${P(h1)} L${P(c1)} Q${P([sh[0] + n[0] * 9, sh[1] + n[1] * 9])} ${P(s1)} L${P(s2)} Q${P([sh[0] - n[0] * 8.5, sh[1] - n[1] * 8.5])} ${P(c2)} L${P(h2)} Z" class="ftorso2"/>`;
      s += ln([sh, hd], 'fb', 7);
    }
    s += `<circle cx="${hd[0].toFixed(1)}" cy="${hd[1].toFixed(1)}" r="${L.head}" class="fhd"/>`;
    s += ln(lN.leg, 'fb', 8.5) + ln(lN.ft, 'fb', 5.5) + cords + ln(aN.pts, 'fb', 7) + eqN;
    if (p.band) s += `<line x1="${(lN.knee[0] - 1).toFixed(1)}" y1="${(lN.knee[1] + 3).toFixed(1)}" x2="${(lN.knee[0] + 5).toFixed(1)}" y2="${(lN.knee[1] + 3).toFixed(1)}" class="fband"/>`;
    if (p.roller > 0.5) { s = `<circle cx="78" cy="${G - 10}" r="10" class="fm"/><circle cx="78" cy="${G - 10}" r="3" class="fhalo"/>` + s; }
    if (p.headFront > 0.5) s += `<circle cx="${hd[0].toFixed(1)}" cy="${hd[1].toFixed(1)}" r="${L.head + 1.8}" class="fhalo"/><circle cx="${hd[0].toFixed(1)}" cy="${hd[1].toFixed(1)}" r="${L.head}" class="fhd"/>`;
    if (p.eyesClosed > 0.5) s += `<path d="M${hd[0] + 2} ${hd[1] - 1} q3 2.5 6 0" class="feye"/>`;
    if (p.breath != null) { const c = p.breathAt || [(hip[0] + sh[0]) / 2, (hip[1] + sh[1]) / 2]; s += `<circle cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="${(12 + 14 * p.breath).toFixed(1)}" class="fbreath" opacity="${(0.55 - 0.35 * p.breath).toFixed(2)}"/>`; }
    return s;
  }
  /* ---------- figura frontal ---------- */
  function front(p) {
    const hc = p.hip, hw = 9, sw = 16, b = rad(p.bend || 0), tl = L.torso * (p.tlen || 1);
    const hL = [hc[0] - hw, hc[1]], hR = [hc[0] + hw, hc[1]];
    const top = [hc[0] + (p.tilt || 0) + tl * Math.sin(b), hc[1] - tl * Math.cos(b)];
    const ax = [Math.sin(b), -Math.cos(b)], pr = [Math.cos(b), Math.sin(b)];
    const sL = [top[0] - pr[0] * sw + ax[0] * -2, top[1] - pr[1] * sw + ax[1] * -2], sR = [top[0] + pr[0] * sw + ax[0] * -2, top[1] + pr[1] * sw + ax[1] * -2];
    const hd = p.hd || [top[0] + ax[0] * (L.neck + L.head), top[1] + ax[1] * (L.neck + L.head)];
    function leg(h, ank, out, kOver) {
      const d = Math.hypot(ank[0] - h[0], ank[1] - h[1]), bend = Math.max(0, 80 - d);
      const k = kOver || [h[0] + (ank[0] - h[0]) * .5 + out * Math.min(bend * .45, 12), h[1] + (ank[1] - h[1]) * .5];
      return { leg: [h, k, ank], ft: [[ank[0] - out, ank[1] + 4], [ank[0] + out * 7, ank[1] + 4]], knee: k };
    }
    const arm = (s0, h, sg) => { const r = ik(s0, h, L.up, L.fore, sg); return [s0, r.j, r.e]; };
    const lL = leg(hL, p.ankL, -1, p.kneeL), lR = leg(hR, p.ankR, 1, p.kneeR);
    if (p.toeUpL > 0.5) lL.ft = [[p.ankL[0] + 1, p.ankL[1] + 4], [p.ankL[0] - 3, p.ankL[1] - 8]];
    if (p.toeUpR > 0.5) lR.ft = [[p.ankR[0] - 1, p.ankR[1] + 4], [p.ankR[0] + 3, p.ankR[1] - 8]];
    let s = '';
    if (p.line) s += `<polygon points="${p.line - 1.2},${G - 6} ${p.line + 1.2},${G - 6} ${p.line + 3},${G + 8} ${p.line - 3},${G + 8}" class="fm"/>`;
    if (p.air > 0.02) {
      const fx = (p.ankL[0] + p.ankR[0]) / 2;
      s += `<ellipse cx="${fx.toFixed(1)}" cy="${G}" rx="${(22 - 8 * p.air).toFixed(1)}" ry="3.2" class="fsh" opacity="${(0.2 + 0.25 * (1 - p.air)).toFixed(2)}"/>`;
      if (p.air > 0.6) { const o = ((p.air - 0.6) / 0.4).toFixed(2), y1 = Math.max(p.ankL[1], p.ankR[1]) + 12; s += `<g opacity="${o}"><line x1="${fx - 9}" y1="${y1}" x2="${fx - 9}" y2="${y1 + 9}" class="fvel"/><line x1="${fx}" y1="${y1 + 3}" x2="${fx}" y2="${y1 + 13}" class="fvel"/><line x1="${fx + 9}" y1="${y1}" x2="${fx + 9}" y2="${y1 + 9}" class="fvel"/></g>`; }
    }
    s += `<polygon points="${[sL, sR, hR, hL].map(P).join(' ')}" class="ftorso"/>`;
    s += ln(lL.leg, 'fb', 8.5) + ln(lL.ft, 'fb', 5.5) + ln(lR.leg, 'fb', 8.5) + ln(lR.ft, 'fb', 5.5);
    let aL, aR;
    if (p.armStraight > 0.5) s += ln([sL, p.handL], 'fb', 7) + ln([sR, p.handR], 'fb', 7) + `<circle cx="${p.handL[0]}" cy="${p.handL[1]}" r="5" class="fhand"/><circle cx="${p.handR[0]}" cy="${p.handR[1]}" r="5" class="fhand"/>`;
    else { aL = arm(sL, p.handL, p.elbowL || 1); aR = arm(sR, p.handR, p.elbowR || -1); s += ln(aL, 'fb', 7) + ln(aR, 'fb', 7); }
    (p.cords || []).forEach(([a, b2]) => { s += `<line x1="${a[0]}" y1="${a[1]}" x2="${((p.handL[0] + p.handR[0]) / 2).toFixed(1)}" y2="${((p.handL[1] + p.handR[1]) / 2).toFixed(1)}" class="fcord"/>`; });
    s += ln([top, hd], 'fb', 6) + `<circle cx="${hd[0].toFixed(1)}" cy="${hd[1].toFixed(1)}" r="${L.head}" class="fhd"/>`;
    if (p.band) s += `<line x1="${lL.knee[0].toFixed(1)}" y1="${lL.knee[1].toFixed(1)}" x2="${lR.knee[0].toFixed(1)}" y2="${lR.knee[1].toFixed(1)}" class="fband"/>`;
    const pts = { handL: aL ? aL[2] : p.handL, handR: aR ? aR[2] : p.handR, handC: [(p.handL[0] + p.handR[0]) / 2, (p.handL[1] + p.handR[1]) / 2] };
    (p.eq || []).forEach(([t, w]) => { s += EQ[t](pts[w], { elbow: w === 'handL' && aL ? aL[1] : aR ? aR[1] : pts[w], hip: hc }); });
    return s;
  }

  const arrow = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" class="far" marker-end="url(#fah)"/>`;
  const DEFS = `<defs><marker id="fah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="fahd"/></marker></defs>`;
  const STY = `<style>.fb,.ff,.fh{fill:none;stroke-linecap:round;stroke-linejoin:round}.fb{stroke:var(--fig-ink,#1f3a5f)}.ff{stroke:var(--fig-far,#9fb3cc)}.fh{stroke:var(--fig-bg,#eef6fc)}.fhd,.ftorso{fill:var(--fig-ink,#1f3a5f)}.ftorso{stroke:var(--fig-ink,#1f3a5f);stroke-width:6;stroke-linejoin:round}.fp{fill:var(--fig-prop,#d5e3f0)}.fe{stroke:var(--fig-edge,#a9c1d9);stroke-width:1.5}.fs{stroke:var(--fig-floor,#c9dbeb);stroke-width:2}.fm{fill:var(--fig-acc,#f4a259)}.fkb{fill:var(--fig-acc,#f4a259);stroke:var(--fig-kbl,#c4692a);stroke-width:1.3}.fkh{stroke:var(--fig-kbl,#c4692a)}.fkl{fill:#fff;opacity:.45}.fq{stroke:var(--fig-acc,#f4a259)}.fband{stroke:var(--fig-acc,#f4a259);stroke-width:5;stroke-linecap:round}.far{stroke:var(--fig-acc2,#e76f51);stroke-width:2.5;fill:none}.fahd{fill:var(--fig-acc2,#e76f51)}.fsh{fill:var(--fig-ink,#1f3a5f)}.fvel{stroke:var(--fig-acc2,#e76f51);stroke-width:2;stroke-linecap:round}.fcord{stroke:var(--fig-acc,#f4a259);stroke-width:2.6;stroke-linecap:round}.fchain{stroke:var(--fig-far,#9fb3cc);stroke-width:2;stroke-dasharray:2 2}.fhand{fill:var(--fig-ink,#1f3a5f)}.fbar{stroke:var(--fig-edge,#a9c1d9);stroke-width:5;stroke-linecap:round}.fhalo{fill:var(--fig-bg,#eef6fc)}.fletra{fill:var(--fig-acc2,#e76f51);font:800 18px Montserrat,system-ui,sans-serif}.ftorso2{fill:var(--fig-ink,#1f3a5f);stroke:var(--fig-ink,#1f3a5f);stroke-width:3;stroke-linejoin:round}.fhalo2{fill:none;stroke:var(--fig-bg,#eef6fc);stroke-width:6.5;stroke-linejoin:round}.fline{stroke:var(--fig-acc2,#e76f51);stroke-width:2}.fline2{stroke:var(--fig-acc2,#e76f51);stroke-width:2.5;stroke-dasharray:5 4}.fbreath{fill:none;stroke:var(--fig-acc,#f4a259);stroke-width:2.5;stroke-dasharray:3 3}.feye{stroke:var(--fig-bg,#eef6fc);stroke-width:1.6;fill:none;stroke-linecap:round}</style>`;

  /* ---------- poses ----------
     A = inicio, B = final. Las vistas laterales miran a la derecha; N = lado cercano (oscuro), F = lado lejano (gris). */
  const stand = (x, extra) => Object.assign({ hip: [x, 103], lean: 0, ankN: [x + 6, 181], ankF: [x + 2, 181], handN: [x + 2, 103] }, extra || {});
  const DB2 = [['db', 'handF'], ['db', 'handN']], KB2 = [['kb', 'handF'], ['kb', 'handN']], RACK = [['kbRack', 'handF'], ['kbRack', 'handN']];

  const F = {};
  /* — Sentadillas — */
  F.goblet = { tag: 'Sentadilla · piernas', view: 'side', scene: '', hold: 0,
    A: stand(100, { handN: [114, 74], eq: [['kbGoblet', 'handN']] }),
    B: { hip: [78, 146], lean: 32, ankN: [108, 181], ankF: [104, 181], handN: [116, 108], eq: [['kbGoblet', 'handN']] },
    arrows: [[[150, 96], [150, 132]]],
    cues: ['Pesa pegada al pecho, tomada de los costados del asa.', 'Baja llevando la cadera atrás y abajo hasta muslo paralelo; codos entre las rodillas.', 'Sube empujando el suelo, pecho arriba y rodillas en línea con los pies.'] };
  F.frontal = { tag: 'Sentadilla · piernas', view: 'side', scene: '',
    A: stand(100, { handN: [112, 64], eq: RACK }),
    B: { hip: [80, 146], lean: 24, ankN: [108, 181], ankF: [104, 181], handN: [111, 98], eq: RACK },
    arrows: [[[150, 96], [150, 132]]],
    cues: ['Una pesa rusa en cada mano, apoyadas sobre el antebrazo a la altura del pecho (rack).', 'Baja con el torso lo más vertical posible hasta muslo paralelo.', 'Codos abajo y abdomen firme durante todo el movimiento.'] };
  F.sjump = { tag: 'Potencia · piernas', view: 'side', vb: '0 -22 220 216', ritmo: 'salto', scene: '',
    A: { hip: [82, 140], lean: 30, ankN: [108, 181], ankF: [104, 181], footN: 0, footF: 0, handN: [74, 128], air: 0 },
    B: { hip: [102, 70], lean: 2, ankN: [108, 147], ankF: [104, 147], footN: -35, footF: -35, handN: [132, -4], handF: [128, -2], air: 1 },
    arrows: [[[160, 140], [160, 96]]],
    cues: ['Desde media sentadilla, brazos atrás.', 'Salta lo más alto que puedas lanzando los brazos arriba.', 'Aterriza suave y en silencio, doblando cadera y rodillas.'] };
  F.wall = { tag: 'Isométrico · rodilla', view: 'side', scene: S.wallL(62),
    A: { hip: [72, 118], lean: 0, ankN: [112, 181], ankF: [106, 181], handN: [86, 82] },
    B: { hip: [72, 142], lean: 0, ankN: [112, 181], ankF: [106, 181], handN: [86, 106] },
    arrows: [[[34, 110], [34, 140]]],
    cues: ['Espalda completa apoyada en la pared, pies a unos 50 cm de ella.', 'Desliza hacia abajo hasta muslo paralelo y mantén la posición.', 'Rodillas sobre los tobillos. Debe arder el muslo, no doler la rodilla.'] };
  /* — Unilaterales — */
  F.bulg = { tag: 'Unilateral · rodilla y glúteo', view: 'side', scene: S.bench(22, 62, 138),
    A: { hip: [104, 105], lean: 8, ankN: [134, 181], ankF: [62, 133], footF: 180, handN: [108, 104], eq: DB2 },
    B: { hip: [96, 140], lean: 20, ankN: [134, 181], ankF: [62, 133], footF: 180, handN: [108, 142], eq: DB2 },
    arrows: [[[160, 96], [160, 132]]],
    cues: ['Empeine de atrás sobre el banco, pie de adelante a un paso largo.', 'Baja recto hasta que la rodilla de atrás quede a un puño del piso.', 'Empuja con el talón de adelante; rodilla alineada con la punta del pie.'] };
  F.bulgKB = Object.assign({}, F.bulg, { A: Object.assign({}, F.bulg.A, { eq: KB2 }), B: Object.assign({}, F.bulg.B, { eq: KB2, handN: [108, 138] }) });
  F.bulgJump = { tag: 'Potencia · unilateral', view: 'side', ritmo: 'salto', scene: S.bench(22, 62, 138),
    A: Object.assign({}, F.bulg.B, { air: 0, airX: 142 }),
    B: { hip: [108, 80], lean: 4, ankN: [138, 156], ankF: [62, 133], footN: -30, footF: 180, handN: [112, 80], eq: DB2, air: 1, airX: 142 },
    arrows: [[[160, 140], [160, 100]]],
    cues: ['Desde abajo de la búlgara, con mancuernas livianas.', 'Sube explosivo: el pie de adelante despega un poco del suelo.', 'Aterriza suave y baja controlado a la siguiente repetición.'] };
  F.lunge = { tag: 'Unilateral · piernas', view: 'side', scene: '',
    A: stand(106, { ankN: [112, 181], ankF: [106, 181], handN: [108, 103], eq: DB2 }),
    B: { hip: [90, 140], lean: 6, ankN: [114, 181], ankF: [42, 175], footF: -55, handN: [94, 142], eq: DB2 },
    arrows: [[[66, 160], [44, 160]]],
    cues: ['De pie, una mancuerna en cada mano.', 'Da un paso largo hacia atrás y baja hasta que la rodilla de atrás casi toque el piso.', 'Vuelve empujando con el talón de adelante.'] };
  F.stepup = { tag: 'Unilateral · piernas', view: 'side', scene: S.bench(118, 64, 150),
    A: { hip: [100, 110], lean: 10, ankN: [132, 146], ankF: [96, 181], handN: [106, 110], eq: DB2 },
    B: { hip: [128, 73], lean: 0, ankN: [132, 146], ankF: [124, 146], handN: [130, 70], eq: DB2 },
    arrows: [[[196, 120], [196, 80]]],
    cues: ['Un pie completo sobre el banco, mancuernas a los costados.', 'Sube empujando solo con la pierna de arriba, sin impulsarte con la de abajo.', 'Baja lento con la misma pierna.'] };
  F.stepupKB = Object.assign({}, F.stepup, { A: Object.assign({}, F.stepup.A, { eq: KB2 }), B: Object.assign({}, F.stepup.B, { eq: KB2 }) });
  F.stepupJump = { tag: 'Potencia · unilateral', view: 'side', vb: '0 -34 220 228', ritmo: 'salto', scene: S.bench(118, 64, 150),
    A: Object.assign({}, F.stepup.A, { eq: [], air: 0, airY: 150, airX: 138 }),
    B: { hip: [130, 48], lean: 0, ankN: [134, 124], ankF: [158, 84], footN: -30, footF: 0, handN: [150, 32], handF: [112, 56], eq: [], air: 1, airY: 150, airX: 138 },
    arrows: [[[196, 120], [196, 76]]],
    cues: ['Un pie sobre el banco.', 'Empuja explosivo hasta despegar, subiendo la otra rodilla.', 'Aterriza con el mismo pie sobre el banco y baja controlado.'] };
  F.stepdown = { tag: 'Excéntrico · rodilla', view: 'front', scene: S.box(96, 64, 156),
    A: { hip: [104, 79], ankR: [113, 152], ankL: [86, 153], handL: [93, 74], handR: [115, 74] },
    B: { hip: [101, 104], ankR: [113, 152], ankL: [84, 181], handL: [90, 99], handR: [112, 99] },
    arrows: [[[66, 140], [66, 172]]],
    cues: ['De pie de lado sobre un escalón bajo, una pierna colgando por fuera.', 'Dobla la rodilla de apoyo en 3 segundos hasta tocar el suelo con el talón libre.', 'La rodilla apunta siempre al dedo medio del pie.'] };
  /* — Cadena posterior — */
  F.rdl = { tag: 'Bisagra de cadera', view: 'side', scene: '',
    A: stand(104, { handN: [106, 104], eq: KB2 }),
    B: { hip: [90, 104], lean: 72, ankN: [110, 181], ankF: [106, 181], handN: [140, 140], eq: KB2 },
    arrows: [[[60, 104], [40, 104]]],
    cues: ['Pesas frente a los muslos, rodillas apenas flexionadas.', 'Lleva la cadera atrás con la espalda recta; las pesas bajan pegadas a las piernas.', 'Sube apretando glúteos hasta quedar derecho.'] };
  F.sldlWall = { tag: 'Bisagra unilateral', view: 'side', scene: S.wallR(184),
    A: { hip: [104, 103], lean: 0, ankN: [98, 178], ankF: [106, 181], footN: -20, handN: [106, 104], handF: [140, 72], eq: [['kb', 'handN']] },
    B: { hip: [100, 102], lean: 80, ankN: [22, 92], ankF: [106, 181], footN: -90, handN: [150, 146], handF: [182, 96], eq: [['kb', 'handN']] },
    arrows: [[[54, 64], [32, 70]]],
    cues: ['Una mano en la pared para equilibrarte, la pesa en la otra.', 'Inclina el torso mientras la pierna libre se va atrás, en línea con la espalda.', 'Cadera cuadrada (no gira) y vuelve apretando el glúteo de apoyo.'] };
  F.sldl = { tag: 'Bisagra unilateral', view: 'side', scene: '',
    A: { hip: [104, 103], lean: 0, ankN: [98, 178], ankF: [106, 181], footN: -20, handN: [106, 104], eq: [['kb', 'handN']] },
    B: { hip: [100, 102], lean: 80, ankN: [22, 92], ankF: [106, 181], footN: -90, handN: [150, 146], handF: [152, 140], eq: [['kb', 'handN']] },
    arrows: [[[54, 64], [32, 70]]],
    cues: ['De pie en una pierna, pesa en la mano contraria.', 'Inclina el torso y lleva la pierna libre atrás formando una línea con la espalda.', 'Cadera cuadrada; sube apretando el glúteo de apoyo.'] };
  F.sldl2 = Object.assign({}, F.sldl, { A: Object.assign({}, F.sldl.A, { eq: KB2 }), B: Object.assign({}, F.sldl.B, { handF: [148, 146], eq: KB2 }) });
  F.bridge1 = { tag: 'Glúteo', view: 'side', vb: '0 50 220 144', scene: S.mat(30, 170),
    A: { hip: [112, 175], sh: [62, 176], hd: [46, 174], ankF: [148, 181], ankN: [166, 121], footN: 20, handN: [106, 182], handF: [104, 182] },
    B: { hip: [110, 148], sh: [62, 174], hd: [46, 174], ankF: [148, 181], ankN: [166, 92], footN: 20, handN: [106, 182], handF: [104, 182] },
    arrows: [[[196, 176], [196, 150]]],
    cues: ['Boca arriba, un pie apoyado y la otra pierna estirada hacia arriba.', 'Empuja con el talón y sube la cadera hasta alinear hombro, cadera y rodilla.', 'Aprieta el glúteo 1 s arriba y baja lento.'] };
  F.thrust = { tag: 'Glúteo', view: 'side', vb: '0 64 220 130', scene: S.bench(14, 56, 140),
    A: { hip: [96, 170], sh: [62, 138], hd: [50, 126], ankN: [140, 181], ankF: [136, 181], handN: [85, 159], band: true, eq: [['kbHip', 'hip']] },
    B: { hip: [110, 138], sh: [62, 136], hd: [48, 128], ankN: [140, 181], ankF: [136, 181], handN: [99, 127], band: true, eq: [['kbHip', 'hip']] },
    arrows: [[[176, 170], [176, 140]]],
    cues: ['Parte alta de la espalda en el borde del banco, pesa sobre la cadera y banda sobre las rodillas.', 'Sube la cadera hasta que el torso quede horizontal; empuja las rodillas contra la banda.', 'Mentón al pecho y 1 s de pausa arriba.'] };
  F.thrust2 = Object.assign({}, F.thrust, { A: Object.assign({}, F.thrust.A, { eq: [['kbHip', 'hip']], handF: [84, 160] }), B: Object.assign({}, F.thrust.B, { eq: [['kbHip', 'hip']], handF: [98, 128] }) });
  F.thrust1 = { tag: 'Glúteo unilateral', view: 'side', vb: '0 64 220 130', scene: S.bench(14, 56, 140),
    A: { hip: [96, 170], sh: [62, 138], hd: [50, 126], ankF: [140, 181], ankN: [124, 132], footN: 0, handN: [85, 159], eq: [['kbHip', 'hip']] },
    B: { hip: [110, 138], sh: [62, 136], hd: [48, 128], ankF: [140, 181], ankN: [148, 104], footN: 0, handN: [99, 127], eq: [['kbHip', 'hip']] },
    arrows: [[[176, 170], [176, 140]]],
    cues: ['Espalda alta en el banco, un pie apoyado y la otra rodilla hacia el pecho.', 'Sube la cadera con una sola pierna hasta el torso horizontal.', 'Cadera nivelada: que no se caiga hacia el lado libre.'] };
  /* — Tobillo y pantorrilla — */
  const calf = (bent) => ({
    A: { hip: [bent ? 84 : 90, bent ? 96 : 84], lean: bent ? 8 : 0, ankN: [95, 160], ankF: [91, 160], footN: 20, footF: 20, handN: [146, 70], handF: [146, 76] },
    B: { hip: [bent ? 88 : 98, bent ? 86 : 72], lean: bent ? 8 : 0, ankN: [99, 150], ankF: [95, 150], footN: -30, footF: -30, handN: [148, 62], handF: [148, 68] } });
  const calfScene = S.box(100, 52, 160) + S.wallR(156);
  F.calf2 = Object.assign({ tag: 'Pantorrilla · tobillo', view: 'side', scene: calfScene, arrows: [[[70, 166], [70, 146]]],
    cues: ['Puntas de los pies en el borde del escalón, una mano en la pared.', 'Sube en puntas lo más alto posible, piernas estiradas.', 'Baja lento hasta que los talones queden bajo el escalón.'] }, calf(false));
  F.calf1 = { tag: 'Pantorrilla · tobillo', view: 'side', scene: calfScene, arrows: [[[70, 166], [70, 146]]],
    A: { hip: [90, 84], lean: 0, ankN: [95, 160], ankF: [72, 134], footN: 20, footF: -40, handN: [94, 84], handF: [146, 76], eq: [['kb', 'handN']] },
    B: { hip: [98, 72], lean: 0, ankN: [99, 150], ankF: [78, 124], footN: -30, footF: -40, handN: [100, 72], handF: [148, 68], eq: [['kb', 'handN']] },
    cues: ['Una pierna en el borde del escalón, pesa en la mano del mismo lado.', 'Sube en puntas con la rodilla estirada.', 'Baja en 3 segundos hasta estirar la pantorrilla.'] };
  F.soleo = Object.assign({ tag: 'Sóleo · tendón de Aquiles', view: 'side', scene: calfScene, arrows: [[[70, 166], [70, 146]]],
    cues: ['Puntas en el borde del escalón, rodillas dobladas unos 30°.', 'Sube en puntas sin estirar las rodillas.', 'Baja lento hasta que los talones queden bajo el escalón.'] }, calf(true));
  F.tibial = { tag: 'Tobillo · canilla', view: 'side', scene: S.wallL(62),
    A: { hip: [80, 104], lean: -13, ankN: [104, 181], ankF: [98, 181], footN: 0, footF: 0, handN: [78, 108] },
    B: { hip: [80, 104], lean: -13, ankN: [104, 181], ankF: [98, 181], footN: 42, footF: 42, handN: [78, 108] },
    arrows: [[[136, 180], [136, 160]]],
    cues: ['Espalda y glúteos en la pared, talones a unos 30 cm.', 'Sube las puntas de los pies sin despegar los talones.', 'Baja lento: trabaja el músculo delantero de la canilla.'] };
  F.balance = { tag: 'Equilibrio · tobillo', view: 'side', scene: '',
    A: { hip: [104, 104], lean: 0, ankN: [110, 181], ankF: [102, 181], footN: 0, handN: [108, 100] },
    B: { hip: [102, 104], lean: -2, ankN: [140, 144], ankF: [102, 181], footN: -25, handN: [106, 100] },
    arrows: [],
    cues: ['Descalzo, apoyado en una pierna con la rodilla apenas flexionada.', 'Sube la otra rodilla a la altura de la cadera y mantén.', 'Mes 3: con ojos cerrados. Mes 6: sobre un cojín.'] };
  F.banda = { tag: 'Cadera · rodilla', view: 'front', scene: '',
    A: { hip: [110, 120], ankL: [101, 181], ankR: [119, 181], handL: [97, 117], handR: [123, 117], band: true },
    B: { hip: [108, 120], ankL: [86, 181], ankR: [128, 181], handL: [95, 117], handR: [121, 117], band: true },
    arrows: [[[150, 165], [178, 165]]],
    cues: ['Mini banda sobre las rodillas, semi-sentadilla con el pecho arriba.', 'Paso lateral largo y junta el otro pie sin aflojar la banda.', 'Rodillas empujando hacia afuera todo el recorrido.'] };


  /* ======== TANDA 2 · tren superior, core y cargas ======== */
  const barra = (x, y) => `<line x1="${x - 30}" y1="${y - 26}" x2="${x - 30}" y2="${y}" class="fe" stroke-width="3"/><line x1="${x + 26}" y1="${y - 26}" x2="${x + 26}" y2="${y}" class="fe" stroke-width="3"/><line x1="${x - 34}" y1="${y}" x2="${x + 30}" y2="${y}" class="fbar"/>`;
  const BAR = [118, -16];
  const colgado = { sh: [107, 35], hd: [104, 17], hip: [105, 87], ankN: [109, 168], ankF: [106, 168], footN: -55, footF: -55, handN: BAR, handF: [116, -16] };
  const arriba = { sh: [100, -6], hd: [96, -23], hip: [98, 46], ankN: [102, 127], ankF: [99, 127], footN: -55, footF: -55, handN: BAR, handF: [116, -16] };
  F.pull = { tag: 'Tirón vertical · espalda', view: 'side', vb: '0 -46 220 240', scene: barra(118, -16), A: colgado, B: arriba,
    arrows: [[[160, 60], [160, 20]]],
    cues: ['Agarre prono (palmas al frente) al ancho de hombros, brazos estirados.', 'Baja las escápulas y sube hasta pasar el mentón sobre la barra, sin balanceo.', 'Baja controlado hasta estirar los brazos por completo.'] };
  F.pullBand = Object.assign({}, F.pull, { A: Object.assign({}, colgado, { cords: [[[114, -13], 'ankN'], [[122, -13], 'ankN']] }), B: Object.assign({}, arriba, { cords: [[[114, -13], 'ankN'], [[122, -13], 'ankN']] }),
    cues: ['Pasa la banda por la barra y apoya las rodillas (o un pie) en ella.', 'Sube hasta pasar el mentón sobre la barra; la banda te ayuda abajo.', 'Cambia a una banda más delgada cuando hagas 8 reps limpias.'] });
  F.pullW = Object.assign({}, F.pull, { A: Object.assign({}, colgado, { eq: [['kb', 'beltKB']], cords: [['belt', 'beltKB', 'fchain']] }), B: Object.assign({}, arriba, { eq: [['kb', 'beltKB']], cords: [['belt', 'beltKB', 'fchain']] }),
    cues: ['Cinturón de lastre con la pesa colgando entre las piernas.', 'Misma técnica que la dominada normal, sin balanceo.', 'Baja en 2–3 segundos.'] });
  F.pullX = Object.assign({}, F.pull, { ritmo: 'salto', vb: '0 -60 220 254',
    B: { sh: [100, -18], hd: [96, -35], hip: [98, 34], ankN: [102, 115], ankF: [99, 115], footN: -55, footF: -55, handN: [121, -32], handF: [119, -31] },
    cues: ['Desde colgado, sube lo más rápido posible.', 'Arriba las manos se despegan un instante de la barra.', 'Vuelve a tomar la barra y baja controlado.'] });
  F.kneeRaise = { tag: 'Core · flexión', view: 'side', vb: '0 -40 220 234', scene: barra(118, -16),
    A: { sh: [107, 35], hd: [104, 17], hip: [105, 87], ankN: [109, 168], ankF: [106, 168], footN: -55, footF: -55, handN: BAR, handF: [116, -16] },
    B: { sh: [107, 35], hd: [104, 17], hip: [101, 87], ankN: [141, 125], ankF: [139, 125], handN: BAR, handF: [116, -16] },
    arrows: [[[170, 150], [170, 110]]],
    cues: ['Colgado de la barra, hombros activos (no sueltos).', 'Sube las rodillas hacia el pecho sin balancearte.', 'Baja lento. También sirve apoyado en los antebrazos en la estación de fondos.'] };
  F.legRaise = Object.assign({}, F.kneeRaise, { B: { sh: [107, 35], hd: [104, 17], hip: [99, 89], ankN: [178, 86], ankF: [176, 88], handN: BAR, handF: [116, -16] },
    cues: ['Colgado de la barra, hombros activos.', 'Sube las piernas estiradas hasta la horizontal (o lo más alto que puedas).', 'Baja en 2–3 segundos sin balanceo.'] });
  /* empujes */
  const pushTop = { ankN: [30, 173], ankF: [28, 173], footN: -80, footF: -80, hip: [105, 146], sh: [154, 128], handN: [156, 181], handF: [152, 181] };
  const pushBot = Object.assign({}, pushTop, { hip: [110, 167], sh: [161, 163] });
  F.push = { tag: 'Empuje horizontal', view: 'side', vb: '0 86 220 108', scene: '', A: pushTop, B: pushBot,
    arrows: [[[196, 130], [196, 160]]],
    cues: ['Manos bajo los hombros, cuerpo en línea recta de cabeza a talones.', 'Baja el pecho hasta casi tocar el suelo, codos a 45° del cuerpo.', 'Empuja el suelo y aprieta abdomen y glúteos todo el tiempo.'] };
  F.pushX = { tag: 'Potencia · empuje', view: 'side', vb: '0 76 220 118', scene: '', ritmo: 'salto', A: pushBot,
    B: Object.assign({}, pushTop, { hip: [106, 138], sh: [156, 116], handN: [162, 168], handF: [158, 168], air: 1, airX: 160, airLY: 172 }),
    arrows: [[[196, 160], [196, 126]]],
    cues: ['Desde abajo de la flexión, empuja explosivo.', 'Las manos despegan del suelo un instante.', 'Aterriza con los codos un poco flexionados y baja controlado.'] };
  const estacion = x => `<line x1="${x - 26}" y1="100" x2="${x - 26}" y2="${G}" class="fe" stroke-width="3"/><line x1="${x + 22}" y1="100" x2="${x + 22}" y2="${G}" class="fe" stroke-width="3"/><line x1="${x - 30}" y1="100" x2="${x + 26}" y2="100" class="fbar"/>`;
  const dipTop = { sh: [106, 50], hip: [90, 99], ankN: [62, 150], ankF: [60, 150], handN: [118, 100], handF: [116, 100] };
  const dipBot = { sh: [116, 76], hip: [96, 124], ankN: [64, 168], ankF: [62, 168], handN: [118, 100], handF: [116, 100] };
  F.dip = { tag: 'Empuje · tríceps y pecho', view: 'side', scene: estacion(118), A: dipTop, B: dipBot,
    arrows: [[[160, 50], [160, 80]]],
    cues: ['Brazos estirados en las paralelas, hombros abajo (lejos de las orejas).', 'Baja hasta codos a 90°, tronco levemente inclinado adelante.', 'Empuja hasta estirar los brazos. Si cuesta, usa banda de asistencia.'] };
  F.dipW = Object.assign({}, F.dip, { A: Object.assign({}, dipTop, { eq: [['kb', 'beltKB']], cords: [['belt', 'beltKB', 'fchain']] }), B: Object.assign({}, dipBot, { eq: [['kb', 'beltKB']], cords: [['belt', 'beltKB', 'fchain']] }),
    cues: ['Cinturón con la pesa colgando entre las piernas.', 'Misma técnica: baja hasta codos a 90°.', 'Sube sin balancear las piernas.'] });
  /* remo */
  const remoA = { hip: [78, 103], sh: [130, 101], ankN: [96, 180], ankF: [40, 138], footF: 180, handF: [134, 140], handN: [132, 152], eq: [['kb', 'handN']] };
  const remoB = Object.assign({}, remoA, { handN: [104, 108] });
  F.row = { tag: 'Tirón horizontal · espalda', view: 'side', scene: S.bench(30, 124, 140), A: remoA, B: remoB,
    arrows: [[[176, 150], [176, 116]]],
    cues: ['Mano y rodilla del mismo lado sobre el banco, espalda plana.', 'Tira la pesa llevando el codo hacia la cadera, no hacia el techo.', '1 s arriba y baja en 3 s sin girar el torso.'] };
  const pisada = [[[90, 186.5], [112, 186.5]], [[110, 186.5], 'handN']];
  F.rowBand = Object.assign({}, F.row, { A: Object.assign({}, remoA, { cords: pisada }), B: Object.assign({}, remoB, { cords: pisada }),
    cues: ['Igual que el remo, con la banda pisada bajo el pie de apoyo y tomada junto al asa.', 'La banda suma resistencia arriba, donde la pesa se siente liviana.', 'Codo hacia la cadera y pausa de 1 s.'] });
  F.rowX = Object.assign({}, F.row, { ritmo: 'salto', cues: ['Posición de remo, espalda plana.', 'Tira la pesa lo más rápido posible.', 'Baja controlado en 2–3 s.'] });
  /* hombros */
  const banco = `<rect x="44" y="140" width="66" height="7" rx="3" class="fp"/><rect x="48" y="147" width="6" height="38" rx="1" class="fp"/><rect x="100" y="147" width="6" height="38" rx="1" class="fp"/><rect x="52" y="66" width="8" height="76" rx="3" class="fp"/>`;
  F.pressSit = { tag: 'Empuje vertical · hombros', view: 'side', vb: '0 -20 220 214', scene: banco,
    A: { hip: [70, 134], lean: 0, ankN: [114, 181], ankF: [110, 181], handN: [80, 78], handF: [78, 80], eq: DB2 },
    B: { hip: [70, 134], lean: 0, ankN: [114, 181], ankF: [110, 181], handN: [74, 30], handF: [72, 32], eq: DB2 },
    arrows: [[[150, 70], [150, 34]]],
    cues: ['Respaldo vertical, espalda apoyada y mancuernas a la altura de los hombros.', 'Empuja hacia arriba hasta estirar los brazos sobre la cabeza.', 'No arquees la zona lumbar: abdomen firme.'] };
  F.pressKB = { tag: 'Empuje vertical · unilateral', view: 'side', vb: '0 -20 220 214', scene: '',
    A: stand(100, { handN: [110, 62], handF: [106, 98], eq: [['kbRack', 'handN']] }),
    B: stand(100, { handN: [102, -1], handF: [106, 98], eq: [['kbRack', 'handN']] }),
    arrows: [[[150, 60], [150, 24]]],
    cues: ['Pesa en rack: la campana apoyada sobre el antebrazo, muñeca recta.', 'Empuja hasta estirar el brazo junto a la oreja.', 'Glúteos y abdomen apretados para no arquear la espalda.'] };
  F.pushPress = { tag: 'Potencia · empuje vertical', view: 'side', vb: '0 -20 220 214', scene: '', ritmo: 'salto',
    A: { hip: [96, 114], lean: 4, ankN: [106, 181], ankF: [102, 181], handN: [112, 72], handF: [106, 108], eq: [['kbRack', 'handN']] },
    B: stand(100, { handN: [102, -1], handF: [106, 98], eq: [['kbRack', 'handN']] }),
    arrows: [[[150, 60], [150, 24]]],
    cues: ['Pesa en rack, flexiona un poco las rodillas (impulso corto).', 'Estira las piernas de golpe y usa ese impulso para subir la pesa.', 'Baja la pesa al rack controlada.'] };
  /* Y-T-W: vista desde arriba (cabeza arriba, boca abajo sobre el banco) */
  const YTW = { R: { e: [4, 7], h: [2, 12] }, Y: { e: [19, -19], h: [36, -38] }, T: { e: [27, 0], h: [52, 1] }, W: { e: [24, 13], h: [34, -9] } };
  function ytwBrazo(sh, a, sg, op) {
    const e = [sh[0] + sg * a.e[0], sh[1] + a.e[1]], h = [sh[0] + sg * a.h[0], sh[1] + a.h[1]];
    return `<g opacity="${op}">${ln([sh, e, h], 'fb', 7)}<g transform="translate(${h[0].toFixed(1)},${h[1].toFixed(1)})"><rect x="-6" y="-2.5" width="12" height="5" rx="2" class="fm"/><rect x="-7" y="-4.5" width="3.5" height="9" rx="1.5" class="fm"/><rect x="3.5" y="-4.5" width="3.5" height="9" rx="1.5" class="fm"/></g></g>`;
  }
  function ytwFig(poses) {
    const sL = [94, 62], sR = [126, 62];
    let s = `<rect x="88" y="38" width="44" height="118" rx="10" class="fp"/><rect x="92" y="156" width="36" height="6" rx="2" class="fp"/>`;
    s += ln([[104, 122], [100, 186]], 'fb', 9) + ln([[116, 122], [120, 186]], 'fb', 9);
    s += `<path d="M${sL[0]} ${sL[1]} L${sR[0]} ${sR[1]} L120 124 L100 124 Z" class="ftorso"/>`;
    const off = { Y: [10, 5], T: [8, 6], W: [-6, 32] };
    poses.forEach(([a, op, letra]) => { s += ytwBrazo(sL, a, -1, op) + ytwBrazo(sR, a, 1, op); if (letra) s += `<text x="${(sR[0] + a.h[0] + off[letra][0]).toFixed(0)}" y="${(sR[1] + a.h[1] + off[letra][1]).toFixed(0)}" class="fletra">${letra}</text>`; });
    s += `<circle cx="110" cy="44" r="11" class="fhd"/>`;
    return s;
  }
  const mixA = (a, b, t) => ({ e: lerp(a.e, b.e, t), h: lerp(a.h, b.h, t) });
  F.ytw = { tag: 'Postura · escápulas', view: 'top', vb: '0 -10 220 204',
    dibujar(t) { // estático: 0 = brazos colgando · 1 = las tres letras juntas
      if (t >= 1) return ytwFig([[YTW.Y, .9, 'Y'], [YTW.T, .9, 'T'], [YTW.W, .9, 'W']]);
      return ytwFig([[YTW.R, 1]]);
    },
    animar(u) { // ciclo: colgando → Y → colgando → T → colgando → W
      const seq = ['Y', 'T', 'W'], k = Math.min(2, Math.floor(u * 3)), v = u * 3 - k;
      let t = v < .2 ? 0 : v < .45 ? (v - .2) / .25 : v < .75 ? 1 : v < .95 ? 1 - (v - .75) / .2 : 0;
      t = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      return ytwFig([[mixA(YTW.R, YTW[seq[k]], t), 1, t > .85 ? seq[k] : '']]);
    },
    cues: ['Vista desde arriba: boca abajo en el banco inclinado, una mancuerna liviana en cada mano.', 'Sube los brazos formando una Y (en diagonal), luego una T (hacia los lados) y una W (codos atrás, manos arriba).', 'Pulgares arriba y escápulas juntas; 8 de cada letra.'] };
  /* swing */
  const swA = { hip: [76, 104], lean: 72, ankN: [106, 181], ankF: [102, 181], handN: [102, 134], handF: [100, 134] };
  const swB = { hip: [100, 103], lean: -4, ankN: [106, 181], ankF: [102, 181], handN: [148, 54], handF: [146, 56] };
  F.swing = { tag: 'Bisagra balística · cadera', view: 'side', scene: '', A: Object.assign({}, swA, { eq: [['kbArm', 'handN']] }), B: Object.assign({}, swB, { eq: [['kbArm', 'handN']] }),
    arrows: [[[170, 120], [170, 70]]],
    cues: ['Bisagra (no sentadilla): la pesa pasa entre las piernas, espalda recta.', 'Proyecta la cadera adelante de golpe y aprieta glúteos.', 'Los brazos no levantan: la pesa "flota" hasta la altura del pecho.'] };
  F.swing1 = Object.assign({}, F.swing, { A: Object.assign({}, swA, { handF: [92, 128], eq: [['kbArm', 'handN']] }), B: Object.assign({}, swB, { handF: [104, 104], eq: [['kbArm', 'handN']] }),
    cues: ['Igual que el swing a dos manos, con una sola mano.', 'El hombro no se va hacia adelante: tronco firme, sin girar.', 'Cambia de mano al terminar la serie.'] });
  /* core en el suelo */
  const supA = { sh: [62, 174], hd: [46, 174], hip: [114, 176], handN: [64, 122], handF: [60, 122], ankN: [154, 136], ankF: [150, 136], footN: 0, footF: 0 };
  F.deadbug = { tag: 'Core · anti-extensión', view: 'side', vb: '0 80 220 114', scene: S.mat(24, 180), A: supA,
    B: Object.assign({}, supA, { handN: [12, 166], ankF: [192, 168], footF: 80 }),
    arrows: [],
    cues: ['Boca arriba, brazos al techo y rodillas a 90° sobre la cadera.', 'Estira un brazo atrás y la pierna contraria adelante, sin tocar el suelo.', 'La zona lumbar pegada al suelo todo el tiempo. Vuelve y cambia de lado.'] };
  F.deadbugW = Object.assign({}, F.deadbug, { A: Object.assign({}, supA, { handN: [62, 122], handF: [62, 122], eq: [['db', 'handN']] }),
    B: Object.assign({}, supA, { handN: [62, 122], handF: [62, 122], ankF: [192, 168], footF: 80, eq: [['db', 'handN']] }),
    cues: ['Boca arriba, mancuerna sostenida con las dos manos sobre el pecho.', 'Estira una pierna sin tocar el suelo mientras la otra queda a 90°.', 'Lumbar pegada al suelo; alterna las piernas.'] });
  const plankA = { ankN: [24, 176], ankF: [22, 176], footN: -80, footF: -80, hip: [103, 174], sh: [154, 156], handN: [178, 181], handF: [174, 181] };
  F.plank = { tag: 'Core · isométrico', view: 'side', vb: '0 96 220 98', scene: S.mat(14, 190), A: plankA,
    B: Object.assign({}, plankA, { hip: [103, 160], sh: [154, 154] }),
    arrows: [[[90, 184], [90, 168]]],
    cues: ['Antebrazos en el suelo, codos bajo los hombros.', 'Sube la cadera hasta formar una línea recta de cabeza a talones.', 'Aprieta abdomen y glúteos; respira normal mientras mantienes.'] };
  F.sidePlank = { tag: 'Core lateral · isométrico', view: 'side', vb: '0 40 220 154', scene: S.mat(14, 190),
    A: Object.assign({}, plankA, { wide: 1, hip: [103, 170], sh: [154, 140], ankN: [26, 168], ankF: [22, 176], handN: [152, 76], handF: [180, 181] }),
    B: Object.assign({}, plankA, { wide: 1, hip: [103, 153], sh: [154, 140], ankN: [26, 168], ankF: [22, 176], handN: [152, 76], handF: [180, 181] }),
    arrows: [[[90, 184], [90, 166]]],
    cues: ['De lado, antebrazo bajo el hombro y piernas estiradas una sobre otra.', 'Sube la cadera hasta alinear tobillos, cadera y hombros.', 'Brazo libre al techo o en la cadera; mantén sin dejar caer la cadera.'] };
  F.copen = { tag: 'Aductores · core lateral', view: 'side', vb: '0 40 220 154', scene: S.bench(4, 62, 146),
    A: { wide: 1, hip: [116, 170], sh: [171, 140], ankN: [44, 142], footN: 0, ankF: [40, 181], footF: 0, handN: [169, 74], handF: [196, 181] },
    B: { wide: 1, hip: [119, 144], sh: [171, 140], ankN: [40, 142], footN: 0, ankF: [44, 160], footF: 0, handN: [169, 74], handF: [196, 181] },
    arrows: [[[100, 184], [100, 160]]],
    cues: ['De lado, el tobillo de la pierna de arriba sobre el banco y el antebrazo en el suelo.', 'Sube la cadera y lleva la pierna de abajo hasta tocar el banco por debajo.', 'Mantén o haz repeticiones lentas. Es exigente para los aductores: parte corto.'] };
  F.copenK = Object.assign({}, F.copen, { scene: S.bench(56, 34, 146),
    A: Object.assign({}, F.copen.A, { ankN: [44, 140] }), B: Object.assign({}, F.copen.B, { ankN: [40, 140], ankF: [46, 162] }),
    cues: ['Versión más fácil: el banco queda bajo la rodilla de la pierna de arriba.', 'Sube la cadera hasta alinear el cuerpo.', 'La pierna de abajo sube hacia el banco. Mantén sin dejar caer la cadera.'] });
  F.drag = { tag: 'Core · anti-rotación', view: 'side', vb: '0 86 220 108', scene: '',
    A: Object.assign({}, pushTop, { eq: [['kb', [124, 163]]] }),
    B: Object.assign({}, pushTop, { handN: [126, 166], eq: [['kb', [124, 163]]] }),
    arrows: [],
    cues: ['Plancha alta (manos estiradas), pesa al costado del cuerpo, a la altura del pecho.', 'Con la mano contraria pasa por debajo y arrastra la pesa al otro lado.', 'La cadera no se mueve ni gira: pies un poco separados ayudan.'] };
  F.birddog = { tag: 'Core · anti-rotación', view: 'side', vb: '0 64 220 130', scene: S.mat(10, 200),
    A: { hip: [88, 130], sh: [140, 128], handN: [141, 181], handF: [139, 181], ankN: [48, 179], ankF: [46, 179], footN: 180, footF: 180 },
    B: { hip: [88, 130], sh: [140, 128], handN: [192, 122], handF: [139, 181], ankN: [48, 179], ankF: [10, 128], footN: 180, footF: -90 },
    arrows: [],
    cues: ['En cuatro apoyos: manos bajo los hombros, rodillas bajo la cadera.', 'Estira un brazo adelante y la pierna contraria atrás, a la altura del cuerpo.', 'Espalda quieta como una mesa: imagina un vaso de agua sobre la zona lumbar.'] };
  F.pallof = { tag: 'Core · anti-rotación', view: 'front', scene: `<rect x="16" y="40" width="9" height="145" rx="3" class="fp"/><circle cx="24" cy="80" r="4" class="fm"/>`,
    A: { hip: [124, 106], ankL: [110, 181], ankR: [138, 181], handL: [120, 76], handR: [128, 76], armStraight: 0, cords: [[[24, 80]]] },
    B: { hip: [124, 106], ankL: [110, 181], ankR: [138, 181], handL: [121, 84], handR: [127, 84], armStraight: 1, cords: [[[24, 80]]] },
    arrows: [],
    cues: ['De pie de lado al anclaje, banda tomada con las dos manos frente al pecho.', 'Empuja las manos al frente y mantén 2 s: la banda intenta girarte, no la dejes.', 'Vuelve al pecho. Haz las repeticiones y cambia de lado.'] };
  /* cargas */
  const walkA = { hip: [100, 106], lean: 0, ankN: [122, 181], ankF: [80, 179], footN: 10, footF: -25 };
  const walkB = { hip: [100, 106], lean: 0, ankN: [80, 179], ankF: [122, 181], footN: -25, footF: 10 };
  const walk = (extra) => ({ A: Object.assign({}, walkA, extra), B: Object.assign({}, walkB, extra) });
  F.farmer = Object.assign({ tag: 'Carga · agarre y core', view: 'side', scene: '', arrows: [[[150, 150], [180, 150]]],
    cues: ['Una pesa en cada mano, hombros atrás y abajo.', 'Camina con pasos cortos y firmes, sin balancear las pesas.', 'Tronco recto: crece hacia arriba.'] }, walk({ handN: [102, 108], handF: [98, 108], eq: KB2 }));
  F.suitcase = Object.assign({ tag: 'Carga · anti-inclinación', view: 'side', scene: '', arrows: [[[150, 150], [180, 150]]],
    cues: ['Una sola pesa, en una mano, como una maleta.', 'Camina sin inclinarte hacia el lado de la pesa.', 'Cambia de mano en cada vuelta.'] }, walk({ handN: [102, 108], handF: [98, 106], eq: [['kb', 'handN']] }));
  F.rackWalk = Object.assign({ tag: 'Carga · anti-extensión', view: 'side', scene: '', arrows: [[[150, 150], [180, 150]]],
    cues: ['Dos pesas en rack, apoyadas en los antebrazos frente al pecho.', 'Camina sin arquear la espalda baja: costillas abajo.', 'Respira corto y mantén el abdomen firme.'] }, walk({ handN: [112, 62], handF: [110, 64], eq: RACK }));


  /* ======== TANDA 3 · movilidad, compuestos y pliometría ======== */
  /* — movilidad — */
  const wgsLunge = { hip: [96, 146], lean: 70, ankN: [140, 181], ankF: [40, 176], footF: -55, handN: [134, 181], handF: [138, 181] };
  F.wgs = { tag: 'Movilidad · cadera y columna', view: 'side', scene: '',
    A: wgsLunge, B: Object.assign({}, wgsLunge, { handN: [146, 76] }),
    arrows: [],
    cues: ['Zancada larga, rodilla de atrás cerca del suelo, manos en el suelo por dentro del pie de adelante.', 'Lleva el codo hacia el empeine de adelante.', 'Gira el pecho y sube el brazo al techo siguiendo la mano con la vista. Cambia de lado.'] };
  const haloA = stand(100, { handN: [116, 36], handF: [114, 38], eq: [['kbUp', 'handN']] });
  const haloM = stand(100, { handN: [104, 10], handF: [102, 12], eq: [['kbUp', 'handN']] });
  const haloB = stand(100, { handN: [86, 34], handF: [84, 36], eq: [['kbUp', 'handN']] });
  F.halo = { tag: 'Movilidad · hombros', view: 'side', vb: '0 -24 220 218', scene: '', K: [haloA, haloM, haloB, wgsLunge, Object.assign({}, wgsLunge, { handN: [146, 76] })],
    arrows: [],
    cues: ['Halo: pesa boca abajo tomada de los costados del asa, rodéala alrededor de la cabeza, cerca del cuello.', 'Mantén las costillas abajo y el abdomen firme; 8 vueltas por lado.', 'Luego el World\'s greatest stretch: zancada, codo al empeine y brazo al techo.'] };
  const quadA = { hip: [88, 130], sh: [140, 128], hd: [156, 130], handN: [150, 118], handF: [139, 181], ankN: [48, 179], ankF: [46, 179], footN: 180, footF: 180, elbowN: 1 };
  F.haloQuad = { tag: 'Movilidad · columna torácica', view: 'side', scene: S.mat(10, 200), K: [haloA, haloM, haloB, quadA, Object.assign({}, quadA, { elbowN: -1 })],
    vb: '0 -24 220 218', arrows: [],
    cues: ['Primero el halo de pie: 8 vueltas por lado.', 'Luego en cuatro apoyos, una mano en la nuca.', 'Abre el codo hacia el techo girando la parte alta de la espalda; la cadera no se mueve.'] };
  F.cossack = { tag: 'Movilidad · aductores', view: 'front', scene: '',
    A: { hip: [110, 110], ankL: [70, 181], ankR: [150, 181], handL: [106, 86], handR: [114, 86] },
    B: { hip: [140, 142], ankL: [70, 181], ankR: [150, 181], handL: [136, 118], handR: [144, 118] },
    arrows: [],
    cues: ['Pies muy separados, puntas un poco hacia afuera.', 'Baja hacia un lado doblando esa rodilla; la otra pierna queda estirada con la punta arriba.', 'Talón de la pierna doblada en el suelo. Alterna de lado.'] };
  F.cossackKB = Object.assign({}, F.cossack, { A: Object.assign({}, F.cossack.A, { eq: [['kbGoblet', 'handC']] }), B: Object.assign({}, F.cossack.B, { eq: [['kbGoblet', 'handC']] }),
    cues: ['Igual que la sentadilla cosaca, con la pesa al pecho (goblet).', 'La pesa ayuda a bajar más y a mantener el pecho arriba.', 'Talón en el suelo y rodilla alineada con el pie.'] });
  F.ninety = { tag: 'Movilidad · cadera', view: 'front', scene: S.mat(30, 160),
    A: { hip: [110, 168], ankL: [104, 182], ankR: [172, 160], kneeL: [62, 176], kneeR: [158, 177], handL: [76, 166], handR: [146, 166] },
    B: { hip: [110, 168], tlen: .72, bend: -14, ankL: [104, 182], ankR: [172, 160], kneeL: [62, 176], kneeR: [158, 177], handL: [82, 180], handR: [112, 180] },
    arrows: [],
    cues: ['Sentado en el suelo: pierna de adelante doblada a 90° frente a ti, pierna de atrás doblada a 90° hacia el lado.', 'Con la espalda recta, inclina el torso sobre la pierna de adelante.', 'Vuelve, gira las rodillas al otro lado y repite.'] };
  F.hipFlex = { tag: 'Movilidad · flexor de cadera', view: 'side', scene: S.mat(30, 160),
    A: { hip: [100, 140], lean: 0, ankN: [146, 181], ankF: [60, 180], footF: 180, handN: [104, 136], handF: [100, 136] },
    B: { hip: [110, 142], lean: -6, ankN: [146, 181], ankF: [60, 180], footF: 180, handN: [112, 138], handF: [100, 40] },
    arrows: [[[62, 120], [84, 120]]],
    cues: ['Rodilla de atrás en el suelo (sobre el mat), pie de adelante a un paso largo.', 'Aprieta el glúteo de la pierna de atrás y lleva la cadera un poco adelante.', 'Sube el brazo del mismo lado de la rodilla apoyada. Siente el estiramiento al frente de la cadera.'] };
  /* open book: vista desde arriba, acostado de lado */
  F.openBook = { tag: 'Movilidad · columna torácica', view: 'top', vb: '0 -10 220 204',
    dibujar(t) {
      const th = Math.PI * t, sh = [104, 58];
      let s = S.mat(60, 1).replace('class="fp"', 'class="fp" opacity=".0"') + `<rect x="58" y="24" width="140" height="160" rx="10" class="fp" opacity=".55"/>`;
      s += ln([[106, 112], [146, 118], [150, 162]], 'ff', 8) + ln([[104, 112], [150, 126], [146, 170]], 'fb', 8.5);
      const tw = 8 + 9 * Math.sin(th / 2) ;
      s += `<path d="M${104 - tw} 52 L${104 + tw} 52 L${104 + 7} 116 L${104 - 7} 116 Z" class="ftorso"/>`;
      s += ln([[sh[0], sh[1] + 6], [sh[0] + 52, sh[1] + 6]], 'ff', 6.5);
      const hx = sh[0] + 52 * Math.cos(th), hr = 4.5 + 3.5 * Math.sin(th), ex = sh[0] + 27 * Math.cos(th);
      s += ln([sh, [ex, sh[1] - 2 * Math.sin(th)], [hx, sh[1] - 4 * Math.sin(th)]], 'fb', 7 + 2 * Math.sin(th)) + `<circle cx="${hx.toFixed(1)}" cy="${(sh[1] - 4 * Math.sin(th)).toFixed(1)}" r="${hr.toFixed(1)}" class="fhd"/>`;
      s += `<circle cx="104" cy="38" r="11" class="fhd"/><circle cx="${(104 + 6 * Math.cos(th)).toFixed(1)}" cy="36" r="2" class="fhalo"/>`;
      s += `<path d="M ${sh[0] + 46} ${sh[1] - 20} A 46 30 0 0 0 ${sh[0] - 46} ${sh[1] - 20}" class="far" fill="none" stroke-dasharray="4 4" marker-end="url(#fah)" opacity=".7"/>`;
      return s;
    },
    cues: ['Vista desde arriba: acostado de lado, rodillas dobladas a 90° y brazos estirados al frente, uno sobre otro.', 'Abre el brazo de arriba como un libro hasta el otro lado, siguiendo la mano con la vista.', 'Las rodillas no se separan. Vuelve lento; 8 por lado.'] };
  /* — compuestos — */
  const tguK = [
    { sh: [62, 170], hd: [46, 168], hip: [114, 174], handN: [62, 118], handF: [16, 178], ankN: [146, 181], ankF: [192, 178], footF: 90, eq: [['kbRack', 'handN']] },
    { sh: [74, 148], hip: [114, 174], handN: [74, 96], handF: [50, 181], ankN: [146, 181], ankF: [192, 178], footF: 90, eq: [['kbRack', 'handN']] },
    { sh: [92, 128], hip: [116, 174], handN: [92, 76], handF: [70, 181], ankN: [146, 181], ankF: [192, 178], footF: 90, eq: [['kbRack', 'handN']] },
    { sh: [88, 128], hip: [130, 150], handN: [88, 76], handF: [68, 181], ankN: [152, 181], ankF: [204, 170], footF: 90, eq: [['kbRack', 'handN']] },
    { sh: [104, 92], hip: [116, 140], handN: [104, 40], handF: [82, 181], ankN: [152, 181], ankF: [70, 178], footF: 180, eq: [['kbRack', 'handN']] },
    { sh: [118, 84], hip: [118, 136], handN: [118, 32], handF: [112, 130], ankN: [154, 181], ankF: [76, 178], footF: 180, eq: [['kbRack', 'handN']] },
    { sh: [124, 51], hip: [124, 103], handN: [124, -1], handF: [126, 104], ankN: [130, 181], ankF: [122, 181], footF: 0, eq: [['kbRack', 'handN']] }];
  F.tgu = { tag: 'Compuesto · estabilidad', view: 'side', vb: '0 -24 220 218', scene: S.mat(4, 212), K: tguK, T: 15000,
    arrows: [],
    cues: ['Acostado, pesa arriba con el brazo estirado y la rodilla del mismo lado doblada. Mirada siempre en la pesa.', 'Sube al codo, luego a la mano, levanta la cadera, pasa la pierna de abajo hacia atrás hasta quedar en una rodilla y ponte de pie.', 'Baja haciendo los mismos pasos al revés. Lento: 1 repetición dura 30–60 s.'] };
  F.tguBW = Object.assign({}, F.tgu, { K: tguK.map(k => Object.assign({}, k, { eq: [] })),
    cues: ['Igual que el Turkish get-up, sin pesa: un zapato en el puño (debe quedar equilibrado arriba).', 'Aprende cada paso por separado: codo, mano, cadera, rodilla, de pie.', 'Mirada siempre en el puño. Baja con los mismos pasos al revés.'] });
  F.windmill = { tag: 'Compuesto · cadera y hombro', view: 'front', vb: '0 -24 220 218', scene: '',
    A: { hip: [110, 104], ankL: [90, 181], ankR: [132, 181], handR: [126, 2], handL: [96, 104], eq: [['kbRack', 'handR']] },
    B: { hip: [128, 104], bend: -65, tlen: .95, ankL: [90, 181], ankR: [132, 181], handR: [91, 16], handL: [92, 166], eq: [['kbRack', 'handR']] },
    arrows: [],
    cues: ['Pesa arriba con el brazo estirado, pies separados y apuntando un poco hacia el lado libre.', 'Empuja la cadera hacia el lado de la pesa y baja la otra mano por la pierna hasta el pie.', 'El brazo de la pesa queda vertical y la mirada en ella. Sube por el mismo camino.'] };
  const lungeRot = { hip: [90, 140], lean: 4, ankN: [114, 181], ankF: [42, 175], footF: -55 };
  F.lungeRot = { tag: 'Compuesto · movilidad', view: 'side', scene: '',
    K: [stand(106, { ankN: [112, 181], ankF: [106, 181], handN: [126, 78], handF: [124, 80] }),
        Object.assign({}, lungeRot, { handN: [114, 112], handF: [112, 114] }),
        Object.assign({}, lungeRot, { handN: [140, 92], handF: [50, 96] })],
    arrows: [],
    cues: ['Zancada hacia adelante con los brazos estirados al frente.', 'Abajo, gira el pecho hacia el lado de la pierna de adelante abriendo los brazos.', 'Vuelve al centro, sube y cambia de pierna.'] };
  F.lungePress = { tag: 'Compuesto · fuerza', view: 'side', vb: '0 -24 220 218', scene: '',
    K: [stand(106, { ankN: [112, 181], ankF: [106, 181], handN: [118, 62], handF: [108, 104], eq: [['kbRack', 'handN']] }),
        { hip: [90, 140], lean: 6, ankN: [114, 181], ankF: [42, 175], footF: -55, handN: [104, 98], handF: [94, 142], eq: [['kbRack', 'handN']] },
        { hip: [90, 140], lean: 6, ankN: [114, 181], ankF: [42, 175], footF: -55, handN: [98, 36], handF: [94, 142], eq: [['kbRack', 'handN']] }],
    arrows: [],
    cues: ['Pesa en rack, da un paso largo atrás y baja a la zancada.', 'Abajo, empuja la pesa sobre la cabeza sin arquear la espalda.', 'Baja la pesa al rack y vuelve de pie. Cambia de lado al terminar la serie.'] };
  /* — pliometría — */
  F.freeze = { tag: 'Pliometría · aterrizaje', view: 'side', vb: '0 -24 220 218', scene: '', ritmo: 'salto',
    A: { hip: [100, 92], lean: 0, ankN: [106, 172], ankF: [102, 172], footN: -45, footF: -45, handN: [106, -10], handF: [104, -8] },
    B: { hip: [86, 134], lean: 26, ankN: [108, 181], ankF: [104, 181], footN: 0, footF: 0, handN: [74, 132], handF: [72, 130] },
    arrows: [[[160, 90], [160, 130]]],
    cues: ['En puntas, brazos arriba.', 'Déjate caer de golpe a media sentadilla, brazos atrás.', 'Quédate quieto 2 s: rodillas alineadas con la punta del pie, sin ruido.'] };
  F.calfIso = { tag: 'Pantorrilla · isométrico', view: 'side', scene: '',
    A: stand(100, { handN: [106, 100] }), B: { hip: [100, 92], lean: 0, ankN: [106, 172], ankF: [102, 172], footN: -45, footF: -45, handN: [106, 90] },
    arrows: [[[150, 176], [150, 160]]],
    cues: ['De pie, manos en la cadera.', 'Sube en puntas lo más alto posible, rodillas estiradas.', 'Mantén quieto el tiempo indicado; baja lento.'] };
  F.calfEcc = { tag: 'Tendón de Aquiles · excéntrico', view: 'side', scene: calfScene,
    A: { hip: [98, 72], lean: 0, ankN: [99, 150], ankF: [95, 150], footN: -30, footF: -30, handN: [148, 62], handF: [148, 68] },
    B: { hip: [90, 84], lean: 0, ankN: [95, 160], ankF: [74, 136], footN: 20, footF: -40, handN: [146, 70], handF: [146, 76] },
    arrows: [[[70, 146], [70, 166]]],
    cues: ['Sube en puntas con los dos pies en el borde del escalón.', 'Levanta un pie y baja con la otra pierna en 3 segundos.', 'Vuelve a subir con los dos pies. Prepara el tendón para el trote.'] };
  const pogo = { hip: [100, 96], lean: 0, ankN: [106, 176], ankF: [102, 176], footN: -25, footF: -25, handN: [114, 96], handF: [112, 98] };
  F.pogoLow = { tag: 'Pliometría · tobillo', view: 'side', scene: '', A: pogo, B: pogo, arc: 9, ritmo: 'rebote', T: 900, arrows: [],
    cues: ['Rodillas casi estiradas, peso en la parte delantera del pie.', 'Rebota solo con los tobillos, 3–5 cm de altura.', 'Contacto suave y rítmico, como una pelota.'] };
  F.pogo = Object.assign({}, F.pogoLow, { arc: 15, T: 700,
    cues: ['Rodillas casi estiradas, tronco firme.', 'Rebotes rápidos: el pie toca el suelo lo menos posible.', 'Brazos relajados; corta la serie si pierdes el ritmo.'] });
  const latA = { hip: [88, 112], ankL: [80, 181], ankR: [96, 181], handL: [70, 106], handR: [106, 106], line: 110 };
  const latB = { hip: [132, 112], ankL: [124, 181], ankR: [140, 181], handL: [114, 106], handR: [150, 106], line: 110 };
  F.latHopLow = { tag: 'Pliometría · lateral', view: 'front', scene: '', A: latA, B: latB, arc: 10, T: 1500, arrows: [],
    cues: ['Pies juntos al lado de una línea en el suelo.', 'Saltitos cortos de un lado a otro de la línea.', 'Aterriza en silencio, en la parte delantera del pie.'] };
  F.latHop = Object.assign({}, F.latHopLow, { arc: 18, T: 1100,
    cues: ['Pies juntos al lado de la línea.', 'Salta de lado a lado lo más rápido posible.', 'Rodillas suaves al aterrizar y siempre en silencio.'] });
  F.skater = { tag: 'Pliometría · lateral unipodal', view: 'front', scene: '', arc: 22, T: 1700,
    A: { hip: [74, 122], ankL: [68, 181], ankR: [92, 168], handL: [54, 112], handR: [100, 96] },
    B: { hip: [146, 122], ankL: [128, 168], ankR: [152, 181], handL: [120, 96], handR: [166, 112] },
    arrows: [],
    cues: ['Sobre una pierna, la otra cruzada atrás.', 'Salta hacia el lado y cae en la otra pierna, como un patinador.', 'Aguanta 1 s el aterrizaje con la rodilla alineada; vuelve al otro lado.'] };
  const skA = { hip: [100, 96], lean: 2, ankN: [140, 138], ankF: [102, 174], footN: -30, footF: -40, handN: [80, 110], handF: [128, 82] };
  const skB = { hip: [100, 96], lean: 2, ankF: [140, 138], ankN: [102, 174], footF: -30, footN: -40, handF: [80, 110], handN: [128, 82] };
  F.skipA = { tag: 'Técnica de carrera', view: 'side', scene: '', A: skA, B: skB, arc: 5, ritmo: 'rebote', T: 900, arrows: [],
    cues: ['Trote en el lugar subiendo las rodillas a la altura de la cadera.', 'Apoyo en la parte delantera del pie, tronco alto.', 'Brazos activos, codos a 90°, coordinados con las piernas.'] };
  F.skipB = { tag: 'Técnica de carrera', view: 'side', scene: '', ritmo: 'rebote', T: 1300, arrows: [],
    A: skA, B: Object.assign({}, skA, { ankN: [176, 106], footN: 10 }),
    cues: ['Sube la rodilla como en el skipping A.', 'Estira la pierna adelante y bájala "arañando" el suelo hacia atrás.', 'Alterna las piernas a ritmo constante.'] };
  F.jumpOne = { tag: 'Pliometría · aterrizaje unipodal', view: 'side', scene: '', arc: 26, T: 2600,
    A: { hip: [52, 140], lean: 30, ankN: [80, 181], ankF: [76, 181], handN: [44, 128], handF: [42, 126] },
    B: { hip: [132, 132], lean: 20, ankN: [156, 181], ankF: [108, 150], footF: -30, handN: [162, 100], handF: [96, 104] },
    arrows: [[[60, 196], [130, 196]]],
    cues: ['Desde media sentadilla con los dos pies.', 'Salto corto hacia adelante.', 'Cae en una pierna y quédate quieto 2 s, rodilla alineada con el pie.'] };
  F.boxJump = { tag: 'Pliometría · potencia', view: 'side', scene: S.box(130, 64, 136), arc: 26, T: 2600,
    A: { hip: [70, 140], lean: 30, ankN: [98, 181], ankF: [94, 181], handN: [62, 128], handF: [60, 126] },
    B: { hip: [138, 96], lean: 26, ankN: [162, 132], ankF: [158, 132], handN: [180, 84], handF: [178, 86] },
    arrows: [],
    cues: ['De pie frente al banco firme (50 cm), media sentadilla y brazos atrás.', 'Salta y cae arriba en media sentadilla, suave.', 'Baja siempre caminando, nunca saltando.'] };
  const bndA = { hip: [100, 102], lean: 8, ankN: [138, 150], ankF: [40, 168], footN: -20, footF: -50, handN: [76, 112], handF: [130, 82] };
  const bndB = { hip: [100, 102], lean: 8, ankF: [138, 150], ankN: [40, 168], footF: -20, footN: -50, handF: [76, 112], handN: [130, 82] };
  F.bounding = { tag: 'Pliometría · zancada saltada', view: 'side', scene: '', A: bndA, B: bndB, arc: 16, ritmo: 'rebote', T: 1300, arrows: [[[150, 196], [190, 196]]],
    cues: ['Al aire libre: pasos largos saltados.', 'Empuja fuerte con la pierna de atrás y sube la rodilla de adelante.', 'Brazos opuestos a las piernas; aterriza y vuelve a empujar.'] };
  F.lungeJump = { tag: 'Pliometría · zancada', view: 'side', scene: '', arc: 26, T: 1900,
    A: { hip: [92, 140], lean: 4, ankN: [124, 181], ankF: [42, 175], footF: -55, handN: [80, 130], handF: [112, 118] },
    B: { hip: [92, 140], lean: 4, ankF: [124, 181], ankN: [42, 175], footN: -55, footF: 0, handF: [80, 130], handN: [112, 118] },
    arrows: [],
    cues: ['Desde la posición de zancada.', 'Salta y cambia de pierna en el aire.', 'Aterriza suave en zancada, rodilla de adelante sobre el pie.'] };
  /* — extra: trote y foam roller — */
  F.run = { tag: 'Trote', view: 'side', scene: '', A: bndA, B: bndB, arc: 6, ritmo: 'rebote', T: 900, arrows: [],
    cues: ['Tronco alto, mirada al frente, hombros relajados.', 'Pasos cortos y rápidos, el pie cae bajo la cadera.', 'Ritmo suave: debes poder conversar.'] };
  F.roller = { tag: 'Recuperación', view: 'side', vb: '0 96 220 98', scene: '',
    A: { roller: 1, hip: [80, 160], sh: [132, 158], ankN: [6, 170], ankF: [4, 170], footN: -70, footF: -70, handN: [146, 181], handF: [142, 181], eq: [] },
    B: { roller: 1, hip: [108, 160], sh: [160, 158], ankN: [34, 170], ankF: [32, 170], footN: -70, footF: -70, handN: [174, 181], handF: [170, 181], eq: [] },
    roller: true, arrows: [[[60, 120], [100, 120]]],
    cues: ['Boca abajo sobre los antebrazos, el rodillo bajo los muslos.', 'Muévete lento de la cadera a la rodilla, 1–2 cm por segundo.', 'Si encuentras un punto tenso, quédate 20 s ahí respirando.'] };


  /* ======== TANDA 4 · yoga con Sonia ======== */
  /* sentado con piernas cruzadas (perfil) */
  const sentado = (x, extra) => Object.assign({ hip: [x, 172], lean: 0, kneeN: [x + 38, 174], ankN: [x + 12, 181], kneeF: [x + 36, 172], ankF: [x + 14, 180], handN: [x + 36, 166], handF: [x + 34, 165], footN: 0, footF: 0 }, extra || {});
  F.yResp2 = { tag: 'Yoga · respiración en pareja', view: 'side', scene: S.mat(30, 160), T: 10000, ritmo: 'rebote',
    A: sentado(124, { breath: 0, eyesClosed: 1 }), B: sentado(124, { breath: 1, eyesClosed: 1 }),
    A2: sentado(124, { breath: 0, eyesClosed: 1 }), B2: sentado(124, { breath: 1, eyesClosed: 1 }), mirror2: true,
    arrows: [],
    cues: ['Sentados espalda con espalda, piernas cruzadas, columnas apoyadas una en la otra.', 'Inhalen juntos en 4 s y exhalen en 6 s; sientan la espalda del otro moverse.', 'Hombros relajados y ojos cerrados. 3 minutos.'] };
  F.yRespAcost = { tag: 'Yoga · respiración', view: 'side', vb: '0 70 220 124', scene: S.mat(24, 180), T: 10000, ritmo: 'rebote',
    A: { sh: [62, 174], hd: [46, 172], hip: [114, 176], ankN: [150, 181], ankF: [146, 181], handN: [104, 166], handF: [80, 168], breath: 0, breathAt: [100, 164], eyesClosed: 1 },
    B: { sh: [62, 174], hd: [46, 172], hip: [114, 176], ankN: [150, 181], ankF: [146, 181], handN: [104, 162], handF: [80, 167], breath: 1, breathAt: [100, 164], eyesClosed: 1 },
    arrows: [],
    cues: ['Acostado boca arriba, rodillas dobladas y pies en el suelo.', 'Una mano en el abdomen: al inhalar debe subir la mano, no el pecho.', 'Exhala más largo de lo que inhalas para bajar las pulsaciones.'] };
  const quad = (extra) => Object.assign({ hip: [88, 130], sh: [140, 128], handN: [141, 181], handF: [139, 181], ankN: [48, 179], ankF: [46, 179], footN: 180, footF: 180 }, extra || {});
  F.yGato = { tag: 'Yoga · columna', view: 'side', vb: '0 64 220 130', scene: S.mat(10, 200), T: 4400,
    A: quad({ arch: 1.9, hd: [152, 148] }), B: quad({ arch: -1.7, hd: [157, 110] }),
    arrows: [],
    cues: ['En cuatro apoyos: manos bajo los hombros, rodillas bajo la cadera.', 'Exhala redondeando la espalda hacia el techo (gato), mentón al pecho.', 'Inhala hundiendo la espalda y mirando al frente (vaca). Al ritmo de la respiración.'] };
  const fold = { hip: [96, 100], lean: 158, headLean: 165, ankN: [104, 181], ankF: [100, 181], handN: [120, 181], handF: [116, 181] };
  const halfLift = { hip: [96, 100], lean: 95, headLean: 95, ankN: [104, 181], ankF: [100, 181], handN: [134, 142], handF: [130, 142] };
  const plankY = { ankN: [40, 173], ankF: [38, 173], footN: -80, footF: -80, hip: [112, 146], sh: [160, 128], handN: [162, 181], handF: [158, 181] };
  const cobra = { ankN: [40, 179], ankF: [38, 179], footN: 180, footF: 180, hip: [116, 176], sh: [160, 148], handN: [166, 181], handF: [162, 181] };
  const dog = { ankN: [56, 178], ankF: [54, 178], footN: -30, footF: -30, hip: [92, 104], sh: [128, 145], hd: [138, 158], handN: [162, 181], handF: [158, 181] };
  const armsUp = stand(100, { handN: [104, -1], handF: [102, 0] });
  F.ySol = { tag: 'Yoga · saludo al sol', view: 'side', vb: '0 -24 220 218', scene: S.mat(20, 180), T: 18000,
    K: [armsUp, fold, halfLift, plankY, cobra, dog, fold, armsUp],
    arrows: [],
    cues: ['De pie, brazos arriba al inhalar; flexión hacia adelante al exhalar.', 'Media elevación, plancha, baja al suelo, cobra suave y perro boca abajo.', 'Vuelve a la flexión y sube. Lento y fluido; dobla las rodillas si lo necesitas.'] };
  F.yPerro = { tag: 'Yoga · cadena posterior', view: 'side', vb: '0 70 220 124', scene: S.mat(20, 180), T: 5000,
    A: plankY, B: dog,
    arrows: [],
    cues: ['Desde la plancha, empuja la cadera hacia arriba y atrás.', 'Perro boca abajo: brazos y espalda en línea, talones hacia el suelo.', 'Vuelve a la plancha lento. 5 rondas.'] };
  F.yGuerrero2 = { tag: 'Yoga · piernas y cadera', view: 'front', scene: S.mat(30, 160), T: 9000,
    K: [{ hip: [110, 104], ankL: [70, 181], ankR: [150, 181], handL: [96, 104], handR: [124, 104] },
        { hip: [104, 128], ankL: [62, 181], ankR: [156, 181], kneeR: [154, 140], handL: [36, 74], handR: [174, 74] },
        { hip: [96, 112], bend: 62, ankL: [62, 181], ankR: [156, 181], handL: [96, 30], handR: [150, 150] }],
    arrows: [],
    cues: ['Guerrero II: pies muy separados, rodilla de adelante doblada sobre el tobillo, brazos estirados a los lados.', 'Triángulo: estira la pierna de adelante e inclina el torso hacia ella; mano baja a la canilla y la otra al techo.', 'Mantén 1 minuto por lado en cada postura.'] };
  F.yGuerrero13 = { tag: 'Yoga · equilibrio y fuerza', view: 'side', vb: '0 -24 220 218', scene: S.mat(10, 200), T: 9000,
    K: [stand(100, { handN: [104, 100] }),
        { hip: [96, 128], lean: 0, ankN: [132, 181], ankF: [38, 176], footF: -30, handN: [98, 24], handF: [96, 24] },
        { hip: [92, 104], lean: 88, ankN: [96, 181], ankF: [14, 100], footF: -90, handN: [196, 100], handF: [194, 102] }],
    arrows: [],
    cues: ['Guerrero I: zancada con la rodilla de adelante doblada, pierna de atrás estirada y brazos arriba.', 'Guerrero III: carga el peso en la pierna de adelante e inclina el cuerpo hasta quedar en una línea horizontal.', 'En el guerrero III pueden tomarse de las manos frente a frente para equilibrarse.'] };
  const arbol = (x, out) => ({ hip: [x, 104], ankL: out < 0 ? [x - 4, 140] : [x - 6, 181], ankR: out > 0 ? [x + 4, 140] : [x + 6, 181], kneeL: out < 0 ? [x - 34, 146] : null, kneeR: out > 0 ? [x + 34, 146] : null });
  /* árbol en pareja: separados lo justo para que el brazo de adentro quede estirado sobre el hombro del otro */
  F.yArbol2 = { tag: 'Yoga · equilibrio en pareja', view: 'front', scene: S.mat(10, 200), T: 5000,
    A: { hip: [70, 104], ankL: [64, 181], ankR: [76, 181], handL: [40, 4], handR: [141, 48] },
    B: Object.assign(arbol(70, -1), { handL: [40, 4], handR: [141, 48] }),
    A2: { hip: [150, 104], ankL: [144, 181], ankR: [156, 181], handL: [79, 60], handR: [180, 4] },
    B2: Object.assign(arbol(150, 1), { handL: [79, 60], handR: [180, 4] }),
    front2: true, arrows: [],
    cues: ['De pie lado a lado, a un brazo de distancia: cada uno apoya la mano de adentro, con el brazo estirado, sobre el hombro del otro.', 'Lleva la planta del pie de afuera al muslo de la pierna de apoyo (o a la pantorrilla, nunca a la rodilla).', 'Sube el brazo de afuera y mantengan 1 minuto; luego cambien de lado.'] };
  F.yTorsion2 = { tag: 'Yoga · columna en pareja', view: 'side', scene: S.mat(30, 160), T: 6000,
    A: sentado(124), B: sentado(124, { handN: [96, 172], handF: [158, 166] }),
    A2: sentado(124), B2: sentado(124, { handN: [96, 172], handF: [158, 166] }), mirror2: true,
    arrows: [],
    cues: ['Espalda con espalda, piernas cruzadas.', 'Giren hacia el mismo lado: una mano en la propia rodilla y la otra en la rodilla del otro.', 'Crezcan al inhalar y giren un poco más al exhalar. 1 minuto por lado.'] };
  const sentadoPiernas = (x, extra) => Object.assign({ hip: [x, 174], lean: -4, ankN: [x + 78, 180], ankF: [x + 76, 180], footN: 70, footF: 70, handN: [110, 132], handF: [108, 134] }, extra || {});
  F.yFlex2 = { tag: 'Yoga · isquios y aductores en pareja', view: 'side', scene: S.mat(10, 200), T: 7000,
    A: sentadoPiernas(56), B: sentadoPiernas(56, { lean: 45, handN: [116, 140], handF: [114, 142] }),
    A2: sentadoPiernas(56), B2: sentadoPiernas(56, { lean: -18, handN: [104, 138], handF: [102, 140] }), mirror2: true,
    arrows: [],
    cues: ['Sentados frente a frente con las piernas abiertas, plantas tocando las del otro.', 'Tómense de las manos: uno se inclina hacia adelante mientras el otro lo lleva suave.', '2 minutos cada uno, sin rebotes.'] };
  const sillaA = (x) => stand(x, { handN: [x + 10, 76], handF: [x + 8, 78] });
  const sillaB = (x) => ({ hip: [x, 142], lean: 0, ankN: [x + 40, 181], ankF: [x + 36, 181], handN: [x + 10, 112], handF: [x + 8, 114] });
  F.ySilla2 = { tag: 'Yoga · piernas en pareja', view: 'side', scene: '', T: 5000,
    A: sillaA(118), B: sillaB(118), A2: sillaA(118), B2: sillaB(118), mirror2: true,
    arrows: [[[200, 100], [200, 136]]],
    cues: ['De pie espalda con espalda, brazos cruzados o enganchados.', 'Caminen los pies hacia adelante y bajen juntos como si se sentaran en una silla.', 'Muslos paralelos al suelo; mantengan 30 s y suban juntos.'] };
  const boteA = { hip: [64, 172], lean: -4, ankN: [106, 181], ankF: [102, 181], handN: [110, 136], handF: [108, 138] };
  const boteB = { hip: [64, 172], lean: -6, ankN: [110, 110], ankF: [106, 112], footN: 70, footF: 70, handN: [110, 128], handF: [108, 130] };
  F.yBote2 = { tag: 'Yoga · core en pareja', view: 'side', scene: S.mat(10, 200), T: 5000,
    A: boteA, B: boteB, A2: boteA, B2: boteB, mirror2: true,
    arrows: [],
    cues: ['Sentados frente a frente, rodillas dobladas y plantas juntas, tomados de las manos.', 'Suban las piernas juntos hasta estirarlas, manteniendo las plantas en contacto.', 'Espalda larga; mantengan 20 s.'] };
  F.yPaloma = { tag: 'Yoga · cadera', view: 'side', scene: S.mat(4, 212), T: 6000,
    A: { hip: [100, 166], lean: 0, ankN: [104, 182], kneeSignN: 1, ankF: [24, 180], footF: 180, handN: [110, 181], handF: [106, 181] },
    B: { hip: [100, 168], lean: 72, ankN: [104, 182], kneeSignN: 1, ankF: [24, 180], footF: 180, handN: [170, 181], handF: [166, 181] },
    arrows: [],
    cues: ['Pierna de adelante doblada en el suelo frente a ti, la de atrás estirada hacia atrás.', 'Con la cadera nivelada, baja el torso sobre la pierna de adelante.', 'Respira hondo 2 minutos por lado: abre glúteo y cadera.'] };
  const supino = { sh: [62, 174], hd: [46, 172], hip: [114, 176] };
  F.ySavasana = { tag: 'Yoga · relajación', view: 'side', vb: '0 110 220 84', scene: S.mat(24, 180), T: 10000, ritmo: 'rebote',
    A: Object.assign({}, supino, { ankN: [192, 179], ankF: [190, 179], footN: 70, footF: 70, handN: [104, 182], handF: [100, 182], eyesClosed: 1, breath: 0 }),
    B: Object.assign({}, supino, { ankN: [192, 179], ankF: [190, 179], footN: 70, footF: 70, handN: [104, 182], handF: [100, 182], eyesClosed: 1, breath: 1 }),
    arrows: [],
    cues: ['Acostado boca arriba, piernas estiradas y brazos relajados a los lados.', 'Ojos cerrados; suelta el peso del cuerpo en el suelo.', 'Respiración tranquila, sin controlarla.'] };
  F.yPuente = { tag: 'Yoga · glúteos', view: 'side', vb: '0 70 220 124', scene: S.mat(24, 180), T: 5000,
    A: Object.assign({}, supino, { ankN: [150, 181], ankF: [146, 181], handN: [106, 182], handF: [102, 182] }),
    B: { sh: [62, 174], hd: [46, 174], hip: [110, 146], ankN: [150, 181], ankF: [146, 181], handN: [106, 182], handF: [102, 182] },
    arrows: [[[190, 176], [190, 150]]],
    cues: ['Boca arriba, rodillas dobladas y pies apoyados al ancho de la cadera.', 'Sube la cadera apretando los glúteos, sin arquear la espalda baja.', 'Mantén 30 s y baja vértebra por vértebra.'] };
  F.yLagartija = { tag: 'Yoga · cadera y flexores', view: 'side', scene: S.mat(10, 200), T: 6000,
    A: { hip: [100, 150], lean: 70, ankN: [144, 181], ankF: [36, 180], footF: 180, handN: [140, 181], handF: [136, 181] },
    B: { hip: [98, 156], lean: 84, ankN: [144, 181], ankF: [34, 180], footF: 180, handN: [178, 181], handF: [174, 181] },
    arrows: [],
    cues: ['Zancada baja: pie de adelante por fuera de las manos, rodilla de atrás en el suelo.', 'Deja caer la cadera hacia adelante y abajo.', 'Si puedes, baja a los antebrazos. 1,5 minutos por lado.'] };
  F.yPared = { tag: 'Yoga · recuperación', view: 'side', vb: '0 60 220 134', scene: S.wallR(156) + S.mat(20, 136), T: 10000, ritmo: 'rebote',
    A: { sh: [100, 174], hd: [84, 172], hip: [150, 176], ankN: [152, 96], ankF: [150, 96], footN: 90, footF: 90, handN: [54, 182], handF: [52, 182], eyesClosed: 1, breath: 0 },
    B: { sh: [100, 174], hd: [84, 172], hip: [150, 176], ankN: [152, 96], ankF: [150, 96], footN: 90, footF: 90, handN: [54, 182], handF: [52, 182], eyesClosed: 1, breath: 1 },
    arrows: [],
    cues: ['Glúteos pegados a la pared y piernas estiradas hacia arriba apoyadas en ella.', 'Brazos relajados a los lados, palmas arriba.', 'Quédate 5 minutos respirando lento: descarga las piernas después del fondo.'] };
  F.yFigura4 = { tag: 'Yoga · glúteo', view: 'side', vb: '0 70 220 124', scene: S.mat(24, 180), T: 6000,
    A: Object.assign({}, supino, { ankN: [150, 181], ankF: [146, 181], handN: [106, 182], handF: [102, 182] }),
    B: Object.assign({}, supino, { ankN: [150, 132], ankF: [124, 132], footN: 70, kneeSignF: 1, handN: [116, 128], handF: [112, 130] }),
    arrows: [],
    cues: ['Boca arriba, cruza el tobillo sobre la rodilla contraria.', 'Toma el muslo de la pierna de abajo y acércalo al pecho.', 'Siente el glúteo de la pierna cruzada. 2 minutos por lado.'] };
  /* cuádriceps de lado: vista desde arriba (la flexión de rodilla se ve de perfil) */
  const cuadA = { sh: [66, 112], hd: [50, 110], hip: [120, 114], ankN: [198, 112], ankF: [198, 120], footN: 0, footF: 0, handN: [110, 100], handF: [34, 118] };
  const cuadB = Object.assign({}, cuadA, { kneeN: [158, 110], ankN: [128, 86], footN: 0, handN: [128, 88] });
  F.yCuadLado = { tag: 'Yoga · cuádriceps (vista desde arriba)', view: 'top', vb: '0 40 220 120', T: 5000,
    dibujar: t => `<rect x="18" y="72" width="194" height="70" rx="10" class="fp" opacity=".55"/>` + side(mix(cuadA, cuadB, t)),
    cues: ['Vista desde arriba: acostado de lado, la cabeza apoyada en el brazo de abajo.', 'Dobla la rodilla de arriba y toma el tobillo con la mano de arriba.', 'Lleva el talón al glúteo con las rodillas juntas. 1,5 minutos por lado.'] };
  const ninoBase = { hip: [88, 156], sh: [136, 168], hd: [151, 175], kneeN: [126, 178], ankN: [84, 181], kneeF: [124, 177], ankF: [82, 181], footN: 180, footF: 180, handN: [196, 181], handF: [194, 181] };
  F.yNino2 = { tag: 'Yoga · espalda en pareja', view: 'side', scene: S.mat(4, 212), T: 6000,
    A: ninoBase, B: Object.assign({}, ninoBase, { hip: [90, 166] }),
    A2: { hip: [44, 134], lean: 10, ankN: [10, 180], ankF: [8, 180], footN: 180, footF: 180, handN: [70, 150], handF: [68, 152] },
    B2: { hip: [44, 138], lean: 40, ankN: [10, 180], ankF: [8, 180], footN: 180, footF: 180, handN: [92, 156], handF: [90, 158] },
    arrows: [],
    cues: ['Uno en postura del niño: rodillas en el suelo, glúteos a los talones y brazos estirados adelante.', 'El otro, de rodillas detrás, apoya las manos en la espalda baja y presiona muy suave.', '2 minutos cada uno; la presión nunca debe doler.'] };
  F.yEsfinge = { tag: 'Yoga · extensión de espalda', view: 'side', vb: '0 90 220 104', scene: S.mat(10, 200), T: 5000,
    A: { ankN: [24, 180], ankF: [22, 180], footN: 180, footF: 180, hip: [100, 177], sh: [152, 175], hd: [168, 176], handN: [176, 182], handF: [172, 182] },
    B: { ankN: [24, 180], ankF: [22, 180], footN: 180, footF: 180, hip: [100, 176], sh: [148, 150], handN: [176, 181], handF: [172, 181] },
    arrows: [],
    cues: ['Boca abajo, codos bajo los hombros y antebrazos en el suelo.', 'Levanta el pecho suave, hombros lejos de las orejas.', 'Glúteos relajados; mantén 2 minutos respirando.'] };
  F.yIsquio = { tag: 'Yoga · isquiotibiales', view: 'side', vb: '0 50 220 144', scene: S.mat(10, 200), T: 6000,
    A: Object.assign({}, supino, { ankN: [168, 112], footN: 80, ankF: [192, 178], footF: 70, handN: [104, 132], handF: [100, 134], cords: [['handN', [172, 106]]] }),
    B: Object.assign({}, supino, { ankN: [124, 97], footN: 80, ankF: [192, 178], footF: 70, handN: [96, 124], handF: [92, 126], cords: [['handN', [128, 91]]] }),
    arrows: [],
    cues: ['Boca arriba, banda elástica en la planta de un pie.', 'Sube la pierna estirada y acércala con la banda, sin despegar la otra del suelo.', 'Sin tirones: 2 minutos por pierna.'] };
  /* vista desde arriba: torsión acostado y mariposa reclinada */
  function supTop(t, modo) {
    let s = `<rect x="40" y="20" width="140" height="170" rx="10" class="fp" opacity=".55"/>`;
    const sL = [96, 64], sR = [124, 64], hL = [102, 122], hR = [118, 122];
    if (modo === 'torsion') {
      const k = t; // rodillas: arriba (0) → caen a la derecha (1)
      const kn = [[110 + 52 * k, 104 + 30 * k], [110 + 50 * k, 112 + 34 * k]];
      const ft = [[110 + 30 * k, 150 + 14 * k], [110 + 26 * k, 152 + 22 * k]];
      s += ln([hL, kn[0], ft[0]], 'ff', 8.5) + ln([hR, kn[1], ft[1]], 'fb', 8.5);
      s += ln([sL, [70, 64], [44, 64]], 'fb', 7) + ln([sR, [150, 64], [176, 64]], 'fb', 7);
    } else {
      const k = t; // mariposa: rodillas juntas (0) → abiertas (1)
      const knL = [110 - 6 - 40 * k, 106 + 34 * k], knR = [110 + 6 + 40 * k, 106 + 34 * k];
      s += ln([hL, knL, [106, 168]], 'fb', 8.5) + ln([hR, knR, [114, 168]], 'fb', 8.5);
      s += ln([sL, [80, 88], [90, 114]], 'fb', 7) + ln([sR, [140, 88], [130, 114]], 'fb', 7);
    }
    s += `<path d="M${sL[0] - 2} ${sL[1]} L${sR[0] + 2} ${sR[1]} L${hR[0] + 2} ${hR[1]} L${hL[0] - 2} ${hL[1]} Z" class="ftorso"/>`;
    s += `<circle cx="110" cy="44" r="11" class="fhd"/>`;
    if (modo === 'torsion') s += `<circle cx="${(110 - 5 * t).toFixed(1)}" cy="40" r="2" class="fhalo"/>`;
    return s;
  }
  F.yTorsionAcost = { tag: 'Yoga · columna (vista desde arriba)', view: 'top', vb: '0 10 220 190', T: 6000, dibujar: t => supTop(t, 'torsion'),
    cues: ['Vista desde arriba: boca arriba, brazos abiertos en cruz y rodillas dobladas.', 'Deja caer las dos rodillas hacia un lado y gira la cabeza al otro.', 'Hombros en el suelo. 1,5 minutos por lado.'] };
  F.yMariposa = { tag: 'Yoga · aductores (vista desde arriba)', view: 'top', vb: '0 10 220 190', T: 6000, dibujar: t => supTop(t, 'mariposa'),
    cues: ['Vista desde arriba: boca arriba, plantas de los pies juntas.', 'Deja que las rodillas se abran hacia los lados por su propio peso.', 'Manos en el abdomen, respiración lenta. 3 minutos.'] };


  /* ======== AJUSTES: el dibujo hace exactamente lo que dice el texto ======== */
  F.gobletP = Object.assign({}, F.goblet, { ritmo: 'pausa', T: 4600,
    cues: ['Pesa pegada al pecho, tomada de los costados del asa.', 'Baja llevando la cadera atrás y abajo hasta muslo paralelo; codos entre las rodillas.', 'Abajo quédate quieto 2 s sin rebotar y luego sube empujando el suelo.'] });
  F.contrast = { tag: 'Potencia · contraste', view: 'side', vb: '0 -22 220 216', scene: '', T: 9000,
    K: [F.frontal.A, F.frontal.B, F.frontal.A, Object.assign({}, F.sjump.A, { eq: [['kb', [150, 163]], ['kb', [168, 163]]] }), Object.assign({}, F.sjump.B, { eq: [['kb', [150, 163]], ['kb', [168, 163]]] })],
    arrows: [],
    cues: ['Primero la serie de sentadilla frontal con las 2 pesas rusas en rack.', 'Deja las pesas en el suelo y, sin descansar, pasa a los saltos.', 'Saltos: desde media sentadilla con brazos atrás, salta lo más alto posible y aterriza suave.'] };
  F.sjumpSoft = Object.assign({}, F.sjump, { B: Object.assign({}, F.sjump.B, { hip: [102, 84], ankN: [108, 162], ankF: [104, 162], handN: [132, 10], handF: [128, 12] }),
    cues: ['Desde media sentadilla, brazos atrás.', 'Salta a media altura, sin buscar el máximo.', 'Aterriza en silencio flexionando cadera y rodillas, y quédate quieto 1 s.'] });
  F.sjumpMax = Object.assign({}, F.sjump, { cues: ['Desde media sentadilla, brazos atrás.', 'Salta lo más alto que puedas lanzando los brazos arriba.', 'Aterriza suave y descansa 20 s antes del siguiente salto.'] });
  F.wall.cues = ['Espalda completa apoyada en la pared, pies a unos 50 cm de ella y brazos cruzados sobre el pecho.', 'Desliza hacia abajo hasta muslo paralelo y mantén la posición.', 'Rodillas sobre los tobillos. Debe arder el muslo, no doler la rodilla.'];
  F.bulg.cues = ['Una mancuerna en cada mano. Empeine del pie de atrás sobre el banco y pie de adelante a un paso largo.', 'Baja recto hasta que la rodilla de atrás quede a un puño del suelo.', 'Empuja con el talón de adelante para subir; rodilla alineada con la punta del pie.'];
  F.bulgKB.cues = ['Una pesa rusa en cada mano. Empeine del pie de atrás sobre el banco y pie de adelante a un paso largo.', 'Baja recto hasta que la rodilla de atrás quede a un puño del suelo.', 'Empuja con el talón de adelante para subir; rodilla alineada con la punta del pie.'];
  F.stepupKB.cues = ['Un pie completo sobre el banco, una pesa rusa en cada mano a los costados.', 'Sube empujando solo con la pierna de arriba, sin impulsarte con la de abajo.', 'Baja lento con la misma pierna.'];
  F.stepdown.cues = ['De pie de lado sobre un escalón bajo, manos en la cintura y una pierna colgando por fuera.', 'Dobla la rodilla de apoyo en 3 segundos hasta tocar el suelo con el talón libre.', 'Sube estirando la pierna de apoyo; la rodilla apunta siempre al dedo medio del pie.'];
  F.sldl2.cues = ['De pie en una pierna, una pesa rusa en cada mano.', 'Inclina el torso y lleva la pierna libre atrás formando una línea con la espalda; las pesas bajan cerca de la pierna de apoyo.', 'Cadera cuadrada; sube apretando el glúteo de apoyo.'];
  F.thrust2 = Object.assign({}, F.thrust, { A: Object.assign({}, F.thrust.A, { eq: [['kbHip2', 'hip'], ['kbHip', 'hip']], handF: [84, 160] }), B: Object.assign({}, F.thrust.B, { eq: [['kbHip2', 'hip'], ['kbHip', 'hip']], handF: [98, 128] }),
    cues: ['Parte alta de la espalda en el borde del banco, dos pesas rusas sobre la cadera (sujétalas con las manos) y banda sobre las rodillas.', 'Sube la cadera hasta que el torso quede horizontal; empuja las rodillas contra la banda.', 'Mentón al pecho y 1 s de pausa arriba.'] });
  F.thrust1.A = Object.assign({}, F.thrust1.A, { kneeN: [92, 146], ankN: [110, 138] });
  F.thrust1.B = Object.assign({}, F.thrust1.B, { kneeN: [102, 112], ankN: [120, 106] });
  F.thrust1.cues = ['Espalda alta en el banco, pesa sobre la cadera, un pie apoyado y la otra rodilla recogida hacia el pecho.', 'Sube la cadera empujando con una sola pierna hasta que el torso quede horizontal.', 'La rodilla recogida no se mueve y la cadera queda nivelada, sin caer hacia el lado libre.'];
  F.balance.cues = ['Descalzo, manos en la cintura, apoyado en una pierna con la rodilla apenas flexionada.', 'Sube la otra rodilla a la altura de la cadera y mantén.', 'Mes 3: con ojos cerrados. Mes 6: sobre un cojín.'];
  F.banda = { tag: 'Cadera · rodilla', view: 'front', scene: '', T: 5200, arrows: [[[150, 150], [178, 150]]],
    K: [{ hip: [92, 120], ankL: [84, 181], ankR: [100, 181], handL: [79, 117], handR: [105, 117], band: true },
        { hip: [102, 120], ankL: [84, 181], ankR: [122, 181], handL: [89, 117], handR: [115, 117], band: true },
        { hip: [114, 120], ankL: [106, 181], ankR: [122, 181], handL: [101, 117], handR: [127, 117], band: true }],
    cues: ['Mini banda sobre las rodillas, semi-sentadilla con el pecho arriba y manos en la cintura.', 'Paso largo hacia el lado con un pie y luego acerca el otro, sin juntar del todo los pies ni aflojar la banda.', 'Haz los pasos hacia un lado y vuelve hacia el otro, con las rodillas empujando hacia afuera.'] };
  F.pullBand.cues = ['Pasa la banda por la barra y apoya los pies (o las rodillas) en ella.', 'Sube hasta pasar el mentón sobre la barra; la banda te ayuda abajo.', 'Cambia a una banda más delgada cuando hagas 8 repeticiones limpias.'];
  F.kneeRaise.B = Object.assign({}, F.kneeRaise.B, { hip: [100, 87], kneeN: [134, 66], ankN: [138, 106], kneeF: [132, 68], ankF: [136, 108] });
  const estacionAlta = x => `<line x1="${x - 26}" y1="86" x2="${x - 26}" y2="${G}" class="fe" stroke-width="3"/><line x1="${x + 22}" y1="86" x2="${x + 22}" y2="${G}" class="fe" stroke-width="3"/><line x1="${x - 30}" y1="86" x2="${x + 26}" y2="86" class="fbar"/>`;
  const dipTop2 = { sh: [106, 36], hip: [90, 86], ankN: [62, 136], ankF: [60, 136], handN: [118, 86], handF: [116, 86] };
  const dipBot2 = { sh: [116, 62], hip: [96, 110], ankN: [64, 156], ankF: [62, 156], handN: [118, 86], handF: [116, 86] };
  F.dip = Object.assign({}, F.dip, { scene: estacionAlta(118), A: dipTop2, B: dipBot2, arrows: [[[164, 40], [164, 70]]],
    cues: ['Brazos estirados en las paralelas, rodillas dobladas y pies atrás sin tocar el suelo.', 'Baja hasta codos a 90°, tronco levemente inclinado adelante y hombros lejos de las orejas.', 'Empuja hasta estirar los brazos. Si cuesta, usa banda de asistencia.'] });
  F.dipW = Object.assign({}, F.dip, { A: Object.assign({}, dipTop2, { eq: [['kb', 'beltKB']], cords: [['belt', 'beltKB', 'fchain']] }), B: Object.assign({}, dipBot2, { eq: [['kb', 'beltKB']], cords: [['belt', 'beltKB', 'fchain']] }),
    cues: ['Cinturón de lastre con la pesa colgando entre las piernas.', 'Misma técnica: baja hasta codos a 90°.', 'Sube sin balancear las piernas.'] });
  F.swingT = Object.assign({}, F.swing, { cues: ['Con la pesa liviana (8 kg) para aprender el movimiento: bisagra (no sentadilla), la pesa pasa entre las piernas con la espalda recta.', 'Proyecta la cadera adelante de golpe y aprieta glúteos.', 'Los brazos no levantan: la pesa "flota" hasta la altura del pecho. Series cortas y técnica limpia.'] });
  /* arrastre de pesa en plancha: vista desde arriba (el arrastre es de lado a lado) */
  F.drag = { tag: 'Core · anti-rotación (vista desde arriba)', view: 'top', vb: '0 10 220 190', T: 5000,
    dibujar(t) {
      const sL = [96, 64], sR = [124, 64], hc = [110, 132];
      const kb0 = [62, 104], kb1 = [158, 104];
      const ph = t < .4 ? t / .4 : 1, mv = t < .4 ? 0 : (t - .4) / .6;
      const kb = lerp(kb0, kb1, mv), hand = t < .4 ? lerp([124, 64], kb0, ph) : kb;
      let s = `<rect x="40" y="20" width="140" height="176" rx="10" class="fp" opacity=".55"/>`;
      s += ln([[104, 132], [100, 188]], 'fb', 9) + ln([[116, 132], [124, 188]], 'fb', 9);
      s += `<path d="M${sL[0] - 2} ${sL[1]} L${sR[0] + 2} ${sR[1]} L${hc[0] + 9} ${hc[1]} L${hc[0] - 9} ${hc[1]} Z" class="ftorso"/>`;
      s += `<circle cx="${sL[0] - 2}" cy="${sL[1] + 4}" r="6" class="fhd"/>`;
      s += `<g transform="translate(${kb[0].toFixed(1)},${kb[1].toFixed(1)})"><circle r="10" class="fkb"/><path d="M-7 -7 Q0 -15 7 -7" class="fkh" fill="none" stroke-width="3"/></g>`;
      s += `<g opacity=".9">${ln([sR, hand], 'fb', 7)}</g><circle cx="${hand[0].toFixed(1)}" cy="${hand[1].toFixed(1)}" r="5" class="fhd"/>`;
      s += `<circle cx="110" cy="44" r="11" class="fhd"/>`;
      return s;
    },
    cues: ['Vista desde arriba: plancha alta (brazos estirados), pies un poco separados y la pesa en el suelo a un costado, a la altura del pecho.', 'Con la mano del lado contrario pasa por debajo del cuerpo, toma la pesa y arrástrala hasta el otro lado.', 'La cadera no se mueve ni gira. Luego arrástrala de vuelta con la otra mano.'] };
  /* WGS con el paso del codo al empeine */
  const wgsElbow = Object.assign({}, wgsLunge, { handN: [128, 168], elbowN: -1 });
  const wgsUp = Object.assign({}, wgsLunge, { handN: [146, 76] });
  F.wgs = Object.assign({}, F.wgs, { A: undefined, B: undefined, K: [wgsLunge, wgsElbow, wgsLunge, wgsUp], T: 9000 });
  F.halo = Object.assign({}, F.halo, { K: [haloA, haloM, haloB, wgsLunge, wgsElbow, wgsUp], T: 14000 });
  F.cossack.A = Object.assign({}, F.cossack.A); F.cossack.B = Object.assign({}, F.cossack.B, { toeUpL: 1 });
  F.cossack.cues = ['Pies muy separados, puntas un poco hacia afuera y manos juntas frente al pecho.', 'Baja hacia un lado doblando esa rodilla; la otra pierna queda estirada con la punta del pie hacia arriba.', 'Talón de la pierna doblada en el suelo. Sube y alterna de lado.'];
  F.cossackKB = Object.assign({}, F.cossack, { A: Object.assign({}, F.cossack.A, { eq: [['kbGoblet', 'handC']] }), B: Object.assign({}, F.cossack.B, { eq: [['kbGoblet', 'handC']] }),
    cues: ['Pies muy separados y la pesa al pecho (goblet), tomada de los costados del asa.', 'Baja hacia un lado doblando esa rodilla; la otra pierna queda estirada con la punta del pie hacia arriba.', 'Talón en el suelo y rodilla alineada con el pie. Sube y alterna de lado.'] });
  F.tguBW = Object.assign({}, F.tgu, { K: tguK.map(k => Object.assign({}, k, { eq: [['shoe', 'handN']] })),
    cues: ['Igual que el Turkish get-up, sin pesa: un zapato sobre el puño cerrado (debe quedar equilibrado arriba).', 'Aprende cada paso por separado: codo, mano, cadera arriba, rodilla atrás, de pie.', 'Mirada siempre en el zapato. Baja con los mismos pasos al revés.'] });
  F.tguL = Object.assign({}, F.tgu, { cues: ['Con la pesa liviana (8 kg): acostado, pesa arriba con el brazo estirado y la rodilla del mismo lado doblada. Mirada siempre en la pesa.', 'Sube al codo, luego a la mano, levanta la cadera, pasa la pierna de abajo hacia atrás hasta quedar en una rodilla y ponte de pie.', 'Baja haciendo los mismos pasos al revés. Lento: 1 repetición dura 30–60 s.'] });
  F.lungeRot = { tag: 'Compuesto · movilidad', view: 'side', scene: '', T: 8000,
    K: [stand(66, { ankN: [72, 181], ankF: [66, 181], handN: [118, 52], handF: [116, 54] }),
        { hip: [98, 140], lean: 4, ankN: [128, 181], ankF: [66, 178], footF: -55, handN: [150, 90], handF: [148, 92] },
        { hip: [98, 140], lean: 4, ankN: [128, 181], ankF: [66, 178], footF: -55, handN: [150, 92], handF: [52, 96] }],
    arrows: [],
    cues: ['De pie con los brazos estirados al frente, a la altura del pecho.', 'Da un paso largo adelante y baja a la zancada; abajo gira el pecho hacia el lado de la pierna de adelante abriendo un brazo hacia atrás.', 'Vuelve al centro, sube juntando los pies y cambia de pierna.'] };
  F.latHopLow.A = Object.assign({}, latA, { ankL: [83, 181], ankR: [93, 181] }); F.latHopLow.B = Object.assign({}, latB, { ankL: [127, 181], ankR: [137, 181] });
  F.latHopLow.cues = ['Pies juntos al lado de una línea en el suelo, manos en la cintura.', 'Saltitos cortos de un lado a otro de la línea, sin pisarla.', 'Aterriza en silencio, en la parte delantera del pie.'];
  F.latHop = Object.assign({}, F.latHopLow, { arc: 18, T: 1100,
    cues: ['Pies juntos al lado de la línea, manos en la cintura.', 'Salta de lado a lado lo más rápido posible, sin pisar la línea.', 'Rodillas suaves al aterrizar y siempre en silencio.'] });
  F.jumpOne.arrows = []; F.bounding.arrows = [];
  /* salto al banco: sube saltando y baja caminando (nunca saltando) */
  F.boxJump = { tag: 'Pliometría · potencia', view: 'side', vb: '0 -40 220 234', scene: S.box(130, 64, 136), loop: true, T: 9000,
    K: [{ hip: [70, 140], lean: 30, ankN: [98, 181], ankF: [94, 181], handN: [62, 128], handF: [60, 126] },
        { hip: [112, 78], lean: 8, ankN: [128, 150], ankF: [124, 150], footN: -30, footF: -30, handN: [150, 40], handF: [148, 42], air: 1, airX: 112 },
        { hip: [138, 96], lean: 26, ankN: [162, 132], ankF: [158, 132], handN: [180, 84], handF: [178, 86] },
        { hip: [158, 54], lean: 0, ankN: [162, 132], ankF: [158, 132], handN: [160, 106], handF: [158, 106] },
        { hip: [136, 104], lean: 0, ankN: [118, 181], ankF: [156, 132], handN: [138, 154], handF: [136, 154] },
        { hip: [110, 103], lean: 0, ankN: [116, 181], ankF: [112, 181], handN: [112, 154], handF: [110, 154] },
        { hip: [70, 140], lean: 30, ankN: [98, 181], ankF: [94, 181], handN: [62, 128], handF: [60, 126] }],
    arrows: [],
    cues: ['De pie frente al banco firme (50 cm), media sentadilla y brazos atrás.', 'Salta y cae arriba en media sentadilla, suave; luego ponte de pie sobre el banco.', 'Baja caminando hacia atrás, un pie y luego el otro. Nunca bajes saltando.'] };


  /* posturas que el modo guiado separa ("Guerrero II y triángulo" → dos pasos) */
  const g2K = F.yGuerrero2.K, g13K = F.yGuerrero13.K;
  F.yGuerreroII = Object.assign({}, F.yGuerrero2, { K: undefined, A: g2K[0], B: g2K[1], cues: ['Pies muy separados, pie de adelante apuntando al frente.', 'Dobla la rodilla de adelante hasta dejarla sobre el tobillo.', 'Brazos estirados a los lados a la altura de los hombros, mirada sobre la mano de adelante.'] });
  F.yTriangulo = Object.assign({}, F.yGuerrero2, { K: undefined, A: g2K[1], B: g2K[2], cues: ['Desde el guerrero II, estira la pierna de adelante.', 'Inclina el torso hacia esa pierna sin girar la cadera.', 'Mano de abajo a la canilla y la de arriba al techo, en una línea.'] });
  F.yGuerreroI = Object.assign({}, F.yGuerrero13, { K: undefined, A: g13K[0], B: g13K[1], cues: ['Zancada larga: rodilla de adelante doblada sobre el tobillo, pierna de atrás estirada.', 'Cadera mirando al frente.', 'Brazos arriba junto a las orejas.'] });
  F.yGuerreroIII = Object.assign({}, F.yGuerrero13, { K: undefined, A: g13K[1], B: g13K[2], cues: ['Desde el guerrero I, carga el peso en la pierna de adelante.', 'Inclina el cuerpo y sube la pierna de atrás hasta formar una línea horizontal con brazos y espalda.', 'Pueden tomarse de las manos frente a frente para equilibrarse.'] });

  /* ---------- nombre del ejercicio → dibujo ---------- */
  const MAPA = {
    'Sentadilla goblet': 'goblet', 'Sentadilla goblet con pausa': 'gobletP',
    'Sentadilla frontal doble con pesas rusas': 'frontal',
    'Sentadilla frontal doble + salto vertical (contraste)': 'contrast', 'Sentadilla con salto': 'sjump',
    'Sentadilla isométrica en pared': 'wall',
    'Sentadilla búlgara': 'bulg', 'Sentadilla búlgara con 2 pesas rusas': 'bulgKB', 'Sentadilla búlgara explosiva': 'bulgJump',
    'Zancada inversa con mancuernas': 'lunge',
    'Step-up al banco': 'stepup', 'Step-up con 2 pesas rusas': 'stepupKB', 'Step-up explosivo': 'stepupJump',
    'Step-down lateral excéntrico': 'stepdown',
    'Peso muerto rumano con 2 pesas rusas': 'rdl', 'Peso muerto a una pierna con apoyo': 'sldlWall',
    'Peso muerto rumano a una pierna': 'sldl', 'Peso muerto rumano a una pierna con 2 pesas': 'sldl2',
    'Puente de glúteo a una pierna': 'bridge1',
    'Hip thrust con pesa rusa + banda': 'thrust', 'Hip thrust con 2 pesas rusas + banda': 'thrust2', 'Hip thrust a una pierna con pesa rusa': 'thrust1',
    'Elevación de talones (2 piernas)': 'calf2', 'Elevación de talones a una pierna con pesa': 'calf1',
    'Elevación de talón con rodilla flexionada (sóleo)': 'soleo', 'Elevación de puntas (tibial anterior)': 'tibial',
    'Equilibrio a una pierna': 'balance', 'Caminata lateral con mini banda': 'banda',
    'Dominadas': 'pull', 'Dominada asistida con banda': 'pullBand', 'Dominada con lastre': 'pullW', 'Dominada explosiva': 'pullX',
    'Elevación de rodillas colgado': 'kneeRaise', 'Elevación de piernas colgado': 'legRaise',
    'Flexiones de brazos': 'push', 'Flexiones pliométricas': 'pushX', 'Fondos en paralelas': 'dip', 'Fondos con lastre': 'dipW',
    'Remo con pesa rusa apoyado en banco': 'row', 'Remo con pesa rusa + banda': 'rowBand', 'Remo explosivo con pesa rusa': 'rowX',
    'Press militar sentado con mancuernas': 'pressSit', 'Press de hombro con pesa rusa a una mano': 'pressKB', 'Push press con pesa rusa': 'pushPress',
    'Y-T-W en banco inclinado': 'ytw', 'Swing a dos manos': 'swing', 'Swing a dos manos (técnica)': 'swingT', 'Swing a una mano': 'swing1',
    'Dead bug': 'deadbug', 'Dead bug con pesa': 'deadbugW', 'Plancha frontal': 'plank', 'Plancha lateral': 'sidePlank',
    'Plancha Copenhagen (pierna extendida)': 'copen', 'Plancha Copenhagen (rodilla)': 'copenK', 'Plancha con arrastre de pesa rusa': 'drag',
    'Bird dog': 'birddog', 'Pallof press con banda': 'pallof',
    'Paseo de granjero con 2 pesas rusas': 'farmer', 'Paseo de maleta (suitcase carry)': 'suitcase', 'Paseo en rack frontal doble': 'rackWalk',
    "World's greatest stretch": 'wgs', 'Halo con pesa rusa + WGS': 'halo', 'Halo + rotación torácica en cuadrupedia': 'haloQuad',
    'Cossack squat (peso corporal)': 'cossack', 'Cossack squat con pesa rusa': 'cossackKB', 'Movilidad de cadera 90/90': 'ninety',
    'Estiramiento flexor de cadera (half kneeling)': 'hipFlex', 'Movilidad torácica (open book)': 'openBook',
    'Turkish get-up': 'tgu', 'Turkish get-up con pesa liviana': 'tguL', 'Turkish get-up (técnica, sin peso)': 'tguBW',
    'Windmill con pesa rusa': 'windmill', 'Zancada con rotación torácica': 'lungeRot', 'Zancada inversa + press con pesa rusa': 'lungePress',
    'Aterrizaje congelado': 'freeze', 'Isométrico de gemelos en puntas': 'calfIso', 'Elevación de talón excéntrica en escalón': 'calfEcc',
    'Saltitos suaves de tobillo (pogos bajos)': 'pogoLow', 'Pogos rápidos': 'pogo', 'Saltos pogo': 'pogo',
    'Salto vertical suave con aterrizaje controlado': 'sjumpSoft', 'Salto desde sentadilla': 'sjump', 'Salto vertical máximo': 'sjumpMax',
    'Saltos laterales bajos sobre una línea': 'latHopLow', 'Saltos laterales sobre una línea': 'latHop', 'Salto patinador lateral': 'skater',
    'Skipping A en el lugar': 'skipA', 'Skipping B en el lugar': 'skipB', 'Salto con aterrizaje en una pierna': 'jumpOne',
    'Salto al banco (50 cm), bajando caminando': 'boxJump', 'Salto al banco': 'boxJump', 'Zancadas largas saltadas (bounding)': 'bounding',
    'Estocada saltada alternada': 'lungeJump', 'Zancada con salto alterno': 'lungeJump',
    'Trote suave (caminata-trote)': 'run', 'Foam roller (recuperación)': 'roller',
    'Respiración espalda con espalda': 'yResp2', 'Respiración diafragmática acostados': 'yRespAcost', 'Gato-vaca': 'yGato',
    'Saludo al sol suave': 'ySol', 'Perro boca abajo ↔ plancha': 'yPerro', 'Guerrero II y triángulo': 'yGuerrero2', 'Guerrero I y guerrero III': 'yGuerrero13',
    'Árbol en pareja': 'yArbol2', 'Torsión sentados en pareja': 'yTorsion2', 'Flexión sentados en pareja': 'yFlex2', 'Silla en pareja': 'ySilla2',
    'Bote doble': 'yBote2', 'Paloma (cadera)': 'yPaloma', 'Savasana': 'ySavasana', 'Puente': 'yPuente', 'Lagartija (cadera y flexores)': 'yLagartija',
    'Piernas en la pared': 'yPared', 'Figura 4 acostado': 'yFigura4', 'Cuádriceps de lado': 'yCuadLado', 'Postura del niño en pareja': 'yNino2',
    'Torsión acostados': 'yTorsionAcost', 'Guerrero II': 'yGuerreroII', 'Triángulo': 'yTriangulo', 'Guerrero I': 'yGuerreroI', 'Guerrero III': 'yGuerreroIII', 'Mariposa reclinada': 'yMariposa', 'Isquiotibiales con banda': 'yIsquio', 'Esfinge': 'yEsfinge'
  };
  const norm = s => String(s || '').trim().toLowerCase();
  const IDX0 = {}; Object.keys(MAPA).forEach(k => IDX0[norm(k)] = MAPA[k]);
  const IDX = new Proxy(IDX0, { get: (o, k) => o[k] || (/^(trote|test 5 km)/.test(k) ? 'run' : undefined) });

  const lerp = (a, b, t) => (a == null || b == null) ? (t < .5 ? a : b) : Array.isArray(a) ? a.map((v, i) => Array.isArray(v) || typeof v === 'number' ? lerp(v, b[i], t) : (t < .5 ? v : b[i])) : typeof a === 'number' ? a + (b - a) * t : (t < .5 ? a : b);
  const DEF = { toeUpL: 0, toeUpR: 0, kneeL: null, kneeR: null, kneeN: null, kneeF: null, arch: 0, bend: 0, tlen: 1, lean: 0, tilt: 0, air: 0, armStraight: 0, wide: 0, footN: 0, footF: 0, elbowN: 1, elbowF: 1, headFront: 0, eyesClosed: 0 };
  function mix(A, B, t) { const o = {}; new Set([...Object.keys(A), ...Object.keys(B)]).forEach(k => { const a = A[k] != null ? A[k] : (k in DEF ? DEF[k] : B[k]), b = B[k] != null ? B[k] : (k in DEF ? DEF[k] : A[k]); o[k] = (k === 'eq') ? (t < .5 ? a : b) : lerp(a, b, t); }); return o; }

  function dibujo(id, t, flechas) {
    const f = F[id]; if (!f) return '';
    if (f.dibujar) return `<svg viewBox="${f.vb}" xmlns="http://www.w3.org/2000/svg" role="img">${DEFS}${STY}${f.dibujar(t)}</svg>`;
    const nz = (o, view) => {
      o = Object.assign({}, o); if (!o.handF) o.handF = o.handN;
      if ((view || f.view) !== 'front') {
        if (!o.sh) { const l = rad(o.lean || 0); o.sh = [o.hip[0] + L.torso * Math.sin(l), o.hip[1] - L.torso * Math.cos(l)]; if (!o.hd) { const hl = rad(o.headLean != null ? o.headLean : (o.lean || 0) * 0.6); o.hd = [o.sh[0] + 16 * Math.sin(hl), o.sh[1] - 16 * Math.cos(hl)]; } }
        if (!o.hd) { const u = unit(o.hip, o.sh); o.hd = [o.sh[0] + u[0] * 16, o.sh[1] + u[1] * 16]; }
      }
      return o;
    };
    let p;
    if (f.K) { const n = f.K.length - 1, x = Math.max(0, Math.min(n, t * n)), i = Math.min(n - 1, Math.floor(x)); p = mix(nz(f.K[i]), nz(f.K[i + 1]), x - i); }
    else p = mix(nz(f.A), nz(f.B), t);
    if (f.arc) {
      const h = f.arc * Math.sin(Math.PI * t), up = v => [v[0], v[1] - h];
      ['hip', 'sh', 'hd', 'ankN', 'ankF', 'handN', 'handF', 'ankL', 'ankR', 'handL', 'handR', 'kneeL', 'kneeR'].forEach(k => { if (p[k]) p[k] = up(p[k]); });
      p.air = Math.max(p.air || 0, Math.sin(Math.PI * t));
    }
    let fig = f.view === 'front' ? front(p) : side(p);
    if (f.A2 || f.K2) {
      const v2 = f.view2 || f.view;
      let q;
      if (f.K2) { const n = f.K2.length - 1, x = Math.max(0, Math.min(n, t * n)), i = Math.min(n - 1, Math.floor(x)); q = mix(nz(f.K2[i], v2), nz(f.K2[i + 1], v2), x - i); }
      else q = mix(nz(f.A2, v2), nz(f.B2 || f.A2, v2), t);
      const fig2 = `<g style="--fig-ink:var(--fig-ink2,#2a9d8f);--fig-far:var(--fig-far2,#93d1c8)"${f.mirror2 ? ' transform="translate(220,0) scale(-1,1)"' : ''}>${v2 === 'front' ? front(q) : side(q)}</g>`;
      fig = f.front2 ? fig + fig2 : fig2 + fig;
    }
    return `<svg viewBox="${f.vb || '0 -12 220 206'}" xmlns="http://www.w3.org/2000/svg" role="img">${DEFS}${STY}${floor}${f.scene || ''}${fig}${flechas === false ? '' : (f.arrows || []).map(a => arrow(a[0], a[1])).join('')}</svg>`;
  }
  window.Figuras = {
    tiene: n => !!IDX[norm(n)],
    svg: (n, t, op) => dibujo(IDX[norm(n)], t == null ? 1 : t, !(op && op.flechas === false)),
    info: n => { const f = F[IDX[norm(n)]]; return f ? { tag: f.tag, cues: f.cues } : null; },
    nombres: () => Object.keys(MAPA),
    version: '1.0',
    /* animación en bucle dentro de un elemento; devuelve una función para detenerla */
    animar(el, n, ms) {
      const id = IDX[norm(n)]; if (!id) return () => {};
      const f = F[id]; let raf, t0 = performance.now(); const T = ms || f.T || (f.animar ? 7200 : f.K ? 1500 * (f.K.length - 1) * 2 : 3200);
      const loop = now => {
        const u = (((now - t0) % T) + T) % T / T; let t;
        if (f.animar) { el.innerHTML = `<svg viewBox="${f.vb}" xmlns="http://www.w3.org/2000/svg" role="img">${DEFS}${STY}${f.animar(u)}</svg>`; raf = requestAnimationFrame(loop); return; }
        if (f.ritmo === 'rebote') { t = u < .5 ? u * 2 : 2 - u * 2; }
        else if (f.loop && f.K) { const n = f.K.length - 1, x = u * n, i = Math.min(n - 1, Math.floor(x)); let fr = Math.max(0, Math.min(1, (x - i - .15) / .7)); fr = fr < .5 ? 2 * fr * fr : 1 - Math.pow(-2 * fr + 2, 2) / 2; t = (i + fr) / n; }
        else if (f.ritmo === 'pausa') { t = u < .1 ? 0 : u < .35 ? (u - .1) / .25 : u < .72 ? 1 : u < .92 ? 1 - (u - .72) / .2 : 0; t = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
        else if (f.ritmo === 'pasos' || f.K) { const n = (f.K ? f.K.length : 2) - 1, half = u < .5 ? u * 2 : 2 - u * 2, x = half * n, i = Math.min(n - 1, Math.floor(x)); let fr = Math.max(0, Math.min(1, (x - i - .2) / .6)); fr = fr < .5 ? 2 * fr * fr : 1 - Math.pow(-2 * fr + 2, 2) / 2; t = (i + fr) / n; }
        else if (F[id].ritmo === 'salto') { t = u < .35 ? 0 : u < .5 ? (u - .35) / .15 : u < .58 ? 1 : u < .73 ? 1 - (u - .58) / .15 : 0; t = Math.sin(t * Math.PI / 2); }
        else { t = u < .15 ? 0 : u < .5 ? (u - .15) / .35 : u < .65 ? 1 : 1 - (u - .65) / .35; t = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
        el.innerHTML = dibujo(id, t, true); raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf);
    }
  };
})();
