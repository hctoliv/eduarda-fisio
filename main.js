(() => {
  // WhatsApp da Eduarda (link da bio: beacons.ai/eduardacristina)
  const WA_NUMBER = '5591985666656';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

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
            const d = (i++ * .055) + 's';
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
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add('is-ready')));

  /* ================= nav ================= */
  const nav = $('.nav'), toggle = $('.nav__toggle'), float = $('.float');
  const closeMenu = () => { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  $$('.nav__links a').forEach(a => a.addEventListener('click', closeMenu));

  /* ================= revelar ao rolar ================= */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -12% 0px' });
  $$('[data-words], [data-clip], [data-reveal]').forEach((el, i) => {
    if (el.matches('[data-reveal]')) el.style.transitionDelay = (i % 3) * 90 + 'ms';
    io.observe(el);
  });

  /* ================= método: passo ativo ================= */
  const steps = $$('[data-step]'), now = $('[data-step-now]'), sbar = $('[data-step-bar]');
  const setStep = idx => {
    steps.forEach((s, k) => s.classList.toggle('is-active', k === idx));
    now.textContent = String(idx + 1).padStart(2, '0');
    sbar.style.transform = `scaleX(${(idx + 1) / steps.length})`;
  };
  setStep(0);

  /* ================= linha de pulso ================= */
  const draw = $('[data-draw]');
  const drawLen = draw.getTotalLength();
  draw.style.strokeDasharray = drawLen;
  draw.style.strokeDashoffset = reduce ? 0 : drawLen;

  /* ================= loop de rolagem ================= */
  const bar = $('[data-progress]');
  const hero = $('[data-hero]'), heroMedia = $('[data-hero-media]'), heroCopy = $('[data-hero-copy]');
  const scrub = $('[data-scrub]'), scrubWords = scrub ? $$('.w', scrub) : [];
  const areas = $('.areas');
  const desktop = matchMedia('(min-width: 761px)');

  let ticking = false;
  const frame = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('is-solid', y > vh * .7);
    float.classList.toggle('is-on', y > vh * .9);

    if (!reduce) {
      // hero: retrato desliza mais devagar, texto sobe e esmaece
      const hp = clamp(y / hero.offsetHeight, 0, 1);
      if (desktop.matches) heroMedia.style.transform = `translate3d(0, ${hp * 18}%, 0) scale(${1 + hp * .06})`;
      else heroMedia.style.transform = `translate3d(0, ${hp * 22}%, 0)`;
      heroCopy.style.transform = `translate3d(0, ${hp * -60}px, 0)`;
      heroCopy.style.opacity = 1 - hp * 1.3;

      // frase acende palavra por palavra
      if (scrub) {
        const r = scrub.getBoundingClientRect();
        const p = clamp((vh * .82 - r.top) / (r.height + vh * .35), 0, 1);
        const lit = Math.round(p * scrubWords.length);
        scrubWords.forEach((w, k) => w.classList.toggle('on', k < lit));
      }

      // pulso desenha conforme a seção passa
      const ar = areas.getBoundingClientRect();
      const ap = clamp((vh - ar.top) / (ar.height + vh * .2), 0, 1);
      draw.style.strokeDashoffset = drawLen * (1 - ap);
    }

    // passo do método mais próximo do centro
    let best = 0, bestD = Infinity;
    steps.forEach((s, k) => {
      const r = s.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - vh * .5);
      if (d < bestD) { bestD = d; best = k; }
    });
    if (!steps[best].classList.contains('is-active')) setStep(best);
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();

  /* ================= trilho do Instagram: arrastar ================= */
  const rail = $('[data-rail]');
  let down = false, sx = 0, sl = 0, moved = 0;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft;
  });
  addEventListener('pointermove', e => {
    if (!down) return;
    const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx));
    if (moved > 5) rail.classList.add('is-drag');
    rail.scrollLeft = sl - dx;
  });
  addEventListener('pointerup', () => { down = false; requestAnimationFrame(() => rail.classList.remove('is-drag')); });
  rail.addEventListener('click', e => { if (moved > 5) e.preventDefault(); }, true);
  rail.addEventListener('dragstart', e => e.preventDefault());

  /* ================= formulário -> WhatsApp ================= */
  const form = $('[data-form]'), err = $('[data-err]');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form);
    const nome = (f.get('nome') || '').trim();
    const nomeField = form.nome.closest('.field');
    if (!nome) {
      nomeField.classList.add('is-bad'); err.textContent = 'Informe seu nome para a Eduarda saber com quem está falando.'; form.nome.focus(); return;
    }
    nomeField.classList.remove('is-bad'); err.textContent = '';
    const quem = f.get('quem');
    const idade = (f.get('idade') || '').trim();
    const bairro = (f.get('bairro') || '').trim();
    const queixas = f.getAll('queixa');
    const msg = (f.get('msg') || '').trim();
    const lines = [
      `Olá, Eduarda! Meu nome é ${nome}.`,
      `Gostaria de agendar uma avaliação de fisioterapia domiciliar ${quem}.`,
      idade && `Idade do paciente: ${idade} anos.`,
      bairro && `Bairro: ${bairro}.`,
      queixas.length && `O que mais incomoda: ${queixas.join(', ')}.`,
      msg && `\n${msg}`
    ].filter(Boolean);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
  });
  form.nome.addEventListener('input', () => { form.nome.closest('.field').classList.remove('is-bad'); err.textContent = ''; });

  $('[data-year]').textContent = new Date().getFullYear();
})();
