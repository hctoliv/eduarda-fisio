(() => {
  // WhatsApp da Eduarda (link da bio: beacons.ai/eduardacristina)
  const WA_NUMBER = '5591985666656';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGsap && !reduce;

  /* ================= regiões do corpo (mapa + formulário) ================= */
  const SPOTS = {
    pescoco:    { r: 'Pescoço', t: 'Tensão e dor cervical', p: 'Rigidez, dor que sobe para a cabeça, dificuldade para girar o pescoço. Trabalhamos mobilidade, postura e fortalecimento.', chip: 'Pescoço' },
    ombro:      { r: 'Ombro', t: 'Dor e limitação no ombro', p: 'Dificuldade para levantar o braço, pentear o cabelo ou alcançar o armário. Recuperação de amplitude e de força.', chip: 'Ombro' },
    folego:     { r: 'Fôlego', t: 'Fôlego e condicionamento', p: 'Cansaço em atividades simples, falta de ar ao esforço. Fisioterapia cardiorrespiratória com exercício dosado e acompanhado.', chip: 'Fôlego' },
    coluna:     { r: 'Coluna', t: 'Dor lombar e postura', p: 'Dor ao levantar, ao ficar muito tempo sentado ou em pé. Movimento orientado e fortalecimento do tronco.', chip: 'Coluna' },
    quadril:    { r: 'Quadril', t: 'Quadril e marcha', p: 'Dor ao caminhar, ao levantar da cadeira ou da cama. Treino de força e de marcha no próprio ambiente da casa.', chip: 'Quadril' },
    joelho:     { r: 'Joelho', t: 'Joelho e degraus', p: 'Dor ou insegurança para subir degraus, agachar ou sentar. Fortalecimento e treino funcional no próprio ambiente.', chip: 'Joelho' },
    tornozelo:  { r: 'Tornozelo e pés', t: 'Tornozelo e pés', p: 'Entorses, rigidez, instabilidade ao pisar. Mobilidade, propriocepção e força para pisar com segurança.', chip: 'Tornozelo' },
    equilibrio: { r: 'Equilíbrio', t: 'Equilíbrio e quedas', p: 'Medo de cair, passos inseguros, tontura ao se levantar. Treino de equilíbrio para mais independência no dia a dia.', chip: 'Equilíbrio' }
  };

  /* ================= texto em palavras ================= */
  const split = (el, inner) => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span');
            w.className = 'w';
            const d = (i++ * .06) + 's';
            if (inner) { const s = document.createElement('span'); s.textContent = part; s.style.setProperty('--d', d); w.append(s); }
            else { w.textContent = part; w.style.setProperty('--d', d); }
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) walk(n);
      });
    };
    walk(el);
  };
  $$('[data-split]').forEach(el => split(el, true));
  $$('[data-words], [data-scrub]').forEach(el => split(el, false));

  /* ================= revelar por interseção ================= */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -12% 0px' });
  $$('[data-words], [data-clip]').forEach(el => io.observe(el));

  // vídeos só tocam quando aparecem
  const vio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting && !reduce) e.target.play().catch(() => {}); else e.target.pause();
  }), { threshold: .1 });
  $$('video').forEach(v => vio.observe(v));

  /* ================= nav ================= */
  const nav = $('.nav'), toggle = $('.nav__toggle'), float = $('.float');
  const closeMenu = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  /* ================= rolagem suave ================= */
  let lenis = null;
  if (motion && window.Lenis) {
    lenis = new Lenis({ lerp: .085, smoothWheel: true });
    lenis.stop();
  }
  const scrollToEl = target => {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const t = id === '#top' ? document.body : $(id);
    if (!t) return;
    e.preventDefault(); closeMenu(); scrollToEl(id === '#top' ? 0 : t);
  }));

  /* ================= mapa do corpo ================= */
  const chipsBox = $('[data-chips]');
  Object.entries(SPOTS).forEach(([k, s]) => {
    const l = document.createElement('label');
    l.innerHTML = `<input type="checkbox" name="queixa" value="${s.chip}" data-chip="${k}"><span>${s.chip}</span>`;
    chipsBox.append(l);
  });
  const card = $('.body__card'), bRegion = $('[data-b-region]'), bTitle = $('[data-b-title]'), bText = $('[data-b-text]');
  let current = 'joelho';
  const pick = k => {
    if (!SPOTS[k]) return;
    current = k;
    $$('.spot').forEach(s => s.classList.toggle('is-active', s.dataset.spot === k));
    card.classList.add('is-swap');
    setTimeout(() => {
      bRegion.textContent = SPOTS[k].r; bTitle.textContent = SPOTS[k].t; bText.textContent = SPOTS[k].p;
      card.classList.remove('is-swap');
    }, 220);
  };
  $$('.spot').forEach(s => {
    s.addEventListener('click', () => pick(s.dataset.spot));
    s.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(s.dataset.spot); } });
  });
  $('.spot[data-spot="joelho"]').classList.add('is-active');
  const form = $('[data-form]');
  $('[data-b-cta]').addEventListener('click', () => {
    const chip = $(`[data-chip="${current}"]`);
    if (chip) chip.checked = true;
    scrollToEl($('#agendar'));
    setTimeout(() => { form.classList.remove('is-pulse'); void form.offsetWidth; form.classList.add('is-pulse'); }, 1300);
  });

  /* ================= formulário -> WhatsApp ================= */
  const err = $('[data-err]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const nome = (f.get('nome') || '').trim();
    const nomeField = form.nome.closest('.field');
    if (!nome) {
      nomeField.classList.add('is-bad'); err.textContent = 'Informe seu nome para a Eduarda saber com quem está falando.'; form.nome.focus(); return;
    }
    nomeField.classList.remove('is-bad'); err.textContent = '';
    const idade = (f.get('idade') || '').trim();
    const bairro = (f.get('bairro') || '').trim();
    const queixas = f.getAll('queixa');
    const msg = (f.get('msg') || '').trim();
    const lines = [
      `Olá, Eduarda! Meu nome é ${nome}.`,
      `Gostaria de agendar uma avaliação de fisioterapia domiciliar ${f.get('quem')}.`,
      idade && `Idade do paciente: ${idade} anos.`,
      bairro && `Bairro: ${bairro}.`,
      queixas.length && `Onde incomoda: ${queixas.join(', ')}.`,
      msg && `\n${msg}`
    ].filter(Boolean);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
  form.nome.addEventListener('input', () => { form.nome.closest('.field').classList.remove('is-bad'); err.textContent = ''; });

  $('[data-year]').textContent = new Date().getFullYear();

  /* ================= cursor + magnético ================= */
  if (fine && !reduce) {
    document.documentElement.classList.add('has-cursor');
    const cur = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring'), label = $('[data-cursor-label]');
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      const lab = e.target.closest('[data-cursor]');
      cur.classList.toggle('is-label', !!lab);
      if (lab) label.textContent = lab.dataset.cursor;
      cur.classList.toggle('is-hover', !lab && !!e.target.closest('a, button, .spot, label'));
    });
    const loop = () => { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px, ${ry}px)`; requestAnimationFrame(loop); };
    loop();
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transition = 'transform .6s cubic-bezier(.2,.7,.1,1)'; el.style.transform = ''; setTimeout(() => el.style.transition = '', 600); });
    });
  }

  /* ================= trilho do Instagram: infinito + arrastar ================= */
  const rail = $('[data-rail]'), track = $('[data-rail-track]');
  [...track.children].forEach(n => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); c.tabIndex = -1; track.append(c); });
  const posts = $$('.post', track);
  let tx = 0, vel = 0, dragging = false, lastX = 0, moved = 0, half = 0, railOn = false;
  const measure = () => { half = track.scrollWidth / 2; };
  measure(); addEventListener('resize', measure);
  new IntersectionObserver(([e]) => { railOn = e.isIntersecting; }).observe(rail);
  rail.addEventListener('pointerdown', e => { dragging = true; moved = 0; lastX = e.clientX; rail.classList.add('is-drag'); rail.setPointerCapture(e.pointerId); });
  rail.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); tx += dx; vel = dx; });
  const endDrag = () => { dragging = false; rail.classList.remove('is-drag'); };
  rail.addEventListener('pointerup', endDrag); rail.addEventListener('pointercancel', endDrag);
  rail.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  rail.addEventListener('dragstart', e => e.preventDefault());
  let scrollVel = 0;
  const railLoop = () => {
    if (railOn) {
      if (!dragging) { vel *= .92; tx += vel - (reduce ? 0 : .6) - scrollVel * .4; }
      if (half) { while (tx <= -half) tx += half; while (tx > 0) tx -= half; }
      track.style.transform = `translate3d(${tx}px,0,0)`;
      const sk = clamp((dragging ? vel : vel + scrollVel) * -.25, -8, 8);
      posts.forEach(p => p.style.setProperty('--skew', sk.toFixed(2) + 'deg'));
    }
    requestAnimationFrame(railLoop);
  };
  railLoop();

  /* ================= ticker ================= */
  const tick = $('.ticker__track');
  tick.innerHTML += tick.innerHTML;
  let tk = 0;
  const tickLoop = () => {
    tk -= (reduce ? 0 : .5) + Math.abs(scrollVel) * .5;
    const w = tick.scrollWidth / 2;
    if (w && tk <= -w) tk += w;
    tick.style.transform = `translate3d(${tk}px,0,0)`;
    requestAnimationFrame(tickLoop);
  };
  tickLoop();

  /* ================= barra, nav, flutuante ================= */
  const bar = $('[data-progress]');
  let lastY = 0, heroEnd = innerHeight;
  const onScroll = y => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    const past = y > heroEnd - 90;
    nav.classList.toggle('is-solid', past);
    nav.classList.toggle('is-hidden', past && y > lastY + 2 && !nav.classList.contains('is-open'));
    if (y < lastY - 2) nav.classList.remove('is-hidden');
    float.classList.toggle('is-on', past);
    lastY = y;
  };

  /* ================= sem GSAP / movimento reduzido ================= */
  if (!motion) {
    $('.loader').remove();
    document.body.classList.remove('is-loading');
    $('.hero').classList.add('is-in');
    $('[data-split]').classList.add('is-in');
    heroEnd = innerHeight;
    addEventListener('scroll', () => onScroll(scrollY), { passive: true });
    onScroll(scrollY);
    return;
  }

  /* ================= GSAP ================= */
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on('scroll', e => { ScrollTrigger.update(); scrollVel = clamp(e.velocity || 0, -60, 60); onScroll(e.scroll); });
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    addEventListener('scroll', () => onScroll(scrollY), { passive: true });
  }
  gsap.ticker.add(() => { scrollVel *= .9; });

  const mm = gsap.matchMedia();

  /* ---------- HERO ---------- */
  const hero = $('[data-hero]'), fig = $('[data-hero-fig]'), word = $('[data-hero-word]'), wordIn = $('.hero__word-in');
  gsap.set(fig, { xPercent: -50, x: 0 });
  const stage = $('.hero__stage');
  const heroTl = gsap.timeline({
    scrollTrigger: { trigger: hero, start: 'top top', end: () => '+=' + innerHeight, scrub: true,
      onRefresh: () => { heroEnd = hero.offsetHeight - innerHeight; } }
  });
  heroTl
    .to(wordIn, { xPercent: -38, ease: 'none', duration: 1 }, 0)
    .to(fig, { scale: .86, yPercent: 3, ease: 'none', duration: 1 }, 0)
    .fromTo('[data-hero-tag]', { y: 0, opacity: 1 }, { y: -90, opacity: 0, ease: 'power1.in', duration: .55, immediateRender: false }, 0)
    .fromTo('[data-hero-side], .hero__hint', { y: 0, opacity: 1 }, { y: -60, opacity: 0, ease: 'power1.in', duration: .45, immediateRender: false }, 0)
    .to('.hero__rings', { scale: 1.35, opacity: .3, ease: 'none', duration: 1 }, 0);
  // a próxima seção sobe por cima e o palco recua
  gsap.fromTo(stage, { scale: 1, borderRadius: 0, filter: 'brightness(1)' }, { scale: .9, borderRadius: 28, filter: 'brightness(.45)', ease: 'none',
    scrollTrigger: { trigger: '[data-manifesto]', start: 'top bottom', end: 'top top', scrub: true } });

  if (fine) {
    const qfx = gsap.quickTo(fig, 'x', { duration: 1.2, ease: 'power3' });
    const qwx = gsap.quickTo(word, 'x', { duration: 1.6, ease: 'power3' });
    const qwy = gsap.quickTo(word, 'y', { duration: 1.6, ease: 'power3' });
    const glow = $('[data-glow]');
    hero.addEventListener('pointermove', e => {
      const x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
      qfx(x * 26); qwx(x * -60); qwy(y * -24);
      glow.style.setProperty('--gx', (e.clientX / innerWidth * 100).toFixed(1) + '%');
      glow.style.setProperty('--gy', (e.clientY / innerHeight * 100).toFixed(1) + '%');
    });
  }

  /* ---------- MANIFESTO ---------- */
  const scrubWords = $$('.w', $('.manifesto [data-scrub]'));
  const light = (words, p) => { const lit = Math.round(p * words.length); words.forEach((w, k) => w.classList.toggle('on', k < lit)); };
  const orb = $('[data-orb]');
  mm.add('(min-width: 761px)', () => {
    gsap.fromTo(orb, { scale: .55, opacity: 0, rotate: -8, yPercent: -50 }, {
      scale: 1, opacity: 1, rotate: 0, yPercent: -50, ease: 'none',
      scrollTrigger: { trigger: '[data-manifesto]', start: 'top 60%', end: 'top top', scrub: true }
    });
  });
  mm.add('(max-width: 760px)', () => {
    gsap.fromTo(orb, { scale: .55, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none',
      scrollTrigger: { trigger: '[data-manifesto]', start: 'top 60%', end: 'top top', scrub: true } });
  });
  ScrollTrigger.create({
    trigger: '[data-manifesto]', start: 'top top', end: 'bottom bottom', scrub: true,
    onUpdate: s => light(scrubWords, clamp(s.progress * 1.15, 0, 1))
  });

  /* ---------- EM CASA (horizontal) ---------- */
  const house = $('[data-house]'), htrack = $('[data-track]'), hbar = $('[data-house-bar]');
  const dist = () => Math.max(0, htrack.scrollWidth - innerWidth);
  const hTween = gsap.to(htrack, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: house, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: s => { hbar.style.transform = `scaleX(${s.progress})`; } }
  });
  $$('[data-par]').forEach(v => {
    gsap.fromTo(v, { xPercent: -6 }, { xPercent: 6, ease: 'none',
      scrollTrigger: { trigger: v.closest('.panel'), containerAnimation: hTween, start: 'left right', end: 'right left', scrub: true } });
  });
  $$('.panel--card, .panel--media').forEach(p => {
    gsap.from(p, { y: 60, opacity: 0, rotate: 1.5, ease: 'power2.out',
      scrollTrigger: { trigger: p, containerAnimation: hTween, start: 'left 95%', end: 'left 60%', scrub: true } });
  });

  /* ---------- MAPA DO CORPO: desenhar o esqueleto ---------- */
  const bones = $$('[data-bones] > *, .skel__head');
  bones.forEach(b => { const L = b.getTotalLength ? b.getTotalLength() : 300; b.style.strokeDasharray = L; b.style.strokeDashoffset = L; b.dataset.len = L; });
  gsap.to(bones, { strokeDashoffset: 0, duration: 1.6, stagger: .05, ease: 'power2.inOut',
    scrollTrigger: { trigger: '.body', start: 'top 65%', once: true },
    onComplete: () => bones.forEach(b => { if (b.classList.contains('skel__ground')) b.style.strokeDasharray = '3 6'; b.style.strokeDashoffset = 0; }) });
  gsap.from('.skel__joints circle, .spot', { scale: 0, transformOrigin: 'center', duration: .6, stagger: .05, ease: 'back.out(2)',
    scrollTrigger: { trigger: '.body', start: 'top 55%', once: true }, delay: .8 });

  /* ---------- ÁREAS: cartas empilhadas ---------- */
  const scards = $$('[data-scard]');
  scards.forEach((c, i) => {
    const next = scards[i + 1];
    if (!next) return;
    gsap.fromTo(c, { scale: 1, filter: 'brightness(1)' }, { scale: .9, filter: 'brightness(.6)', ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true } });
  });
  scards.forEach(c => {
    gsap.from(c.querySelectorAll('h3, p, .scard__tags, .scard__art'), { y: 50, opacity: 0, stagger: .08, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: c, start: 'top 70%' } });
  });

  /* ---------- MÉTODO ---------- */
  const steps = $$('[data-mstep]'), mnum = $('[data-m-num]'), dial = $('[data-dial]');
  let mIdx = 0;
  ScrollTrigger.create({
    trigger: '[data-method]', start: 'top top', end: '+=260%', pin: true, scrub: true,
    onUpdate: s => {
      dial.style.strokeDashoffset = 565.5 * (1 - s.progress);
      const idx = Math.min(steps.length - 1, Math.floor(s.progress * steps.length * .999));
      if (idx === mIdx) return;
      mIdx = idx;
      steps.forEach((st, k) => { st.classList.toggle('is-active', k === idx); st.classList.toggle('is-past', k < idx); });
      gsap.fromTo(mnum, { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .5, ease: 'power3.out' });
      mnum.textContent = String(idx + 1).padStart(2, '0');
    }
  });

  /* ---------- SOBRE: parallax da foto ---------- */
  gsap.fromTo('[data-par-y]', { yPercent: -7 }, { yPercent: 7, ease: 'none',
    scrollTrigger: { trigger: '.about__photo', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* ---------- CITAÇÃO ---------- */
  const qWords = $$('.w', $('.quote [data-scrub]'));
  ScrollTrigger.create({ trigger: '[data-quote]', start: 'top 70%', end: 'bottom 75%', scrub: true, onUpdate: s => light(qWords, s.progress) });

  /* ---------- RODAPÉ ---------- */
  gsap.from('.foot__big', { xPercent: -12, ease: 'none', scrollTrigger: { trigger: '.foot', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* ================= ABERTURA ================= */
  const count = $('[data-count]');
  const heroImg = $('.hero__figure img');
  const ready = Promise.all([
    heroImg.complete ? Promise.resolve() : new Promise(r => { heroImg.onload = heroImg.onerror = r; }),
    document.fonts ? document.fonts.ready : Promise.resolve()
  ]);
  const cap = new Promise(r => setTimeout(r, 4000));
  const counter = { v: 0 };
  const intro = gsap.timeline({ paused: true });
  intro
    .to('.loader__inner', { y: -30, opacity: 0, duration: .6, ease: 'power2.in' })
    .to('.loader__count', { opacity: 0, duration: .4 }, '<')
    .to('.loader__panel', { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '-=.15')
    .from(fig, { yPercent: 18, scale: 1.12, opacity: 0, duration: 1.8, ease: 'expo.out' }, '-=.7')
    .from(wordIn, { yPercent: 70, opacity: 0, duration: 1.6, ease: 'expo.out' }, '<.1')
    .add(() => {
      hero.classList.add('is-in'); $('[data-split]').classList.add('is-in');
      document.body.classList.remove('is-loading');
      $('.loader').style.display = 'none';
      if (lenis) lenis.start();
      ScrollTrigger.refresh();
    }, '<.2');

  gsap.to('.loader__mark circle', { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' });
  const countTween = gsap.to(counter, { v: 92, duration: 1.4, ease: 'power2.out', onUpdate: () => { count.textContent = Math.round(counter.v); } });
  Promise.race([Promise.all([ready, new Promise(r => setTimeout(r, 1400))]), cap]).then(() => {
    countTween.kill();
    gsap.to(counter, { v: 100, duration: .35, ease: 'power1.out', onUpdate: () => { count.textContent = Math.round(counter.v); }, onComplete: () => intro.play() });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
