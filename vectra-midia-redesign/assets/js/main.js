/**
 * VECTRA MÍDIA — JAVASCRIPT (redesign "Design 5")
 * Cada função cuida de uma parte do site. Se uma falhar, as outras continuam funcionando.
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CAN_HOVER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('DOMContentLoaded', () => {
  [
    initWhatsAppLinks,
    initHeader,
    initMobileMenu,
    initActiveNav,
    initScrollReveal,
    initBlurReveal,
    initScrollPortal,
    initTypewriter,
    initAurora,
    initCursorGlow,
    initHeroSpotlight,
    initLiveDash,
    initCounters,
    initStatsGlow,
    initCeoStage,
    initProofsLoop,
    initServiceGlow,
    initMagneticButtons,
    initFaq,
    initModals,
    initVideoModal,
    initAutoplayVideos,
    initFeaturedPlayer,
    initImageModal,
    initCookieBanner
  ].forEach(fn => {
    try { fn(); } catch (err) { console.error('[Vectra]', fn.name, err); }
  });
});

/* ---------- WHATSAPP: liga todos os botões ao número do config.js ---------- */
function initWhatsAppLinks() {
  const cfg = window.VECTRA_CONFIG;
  if (!cfg) return;

  const msgs = cfg.whatsappMessages || {};
  const pick = (key) => {
    if (key && key.startsWith('service-')) {
      const s = key.replace('service-', '');
      return (msgs.services && msgs.services[s]) || msgs.default;
    }
    return msgs[key] || msgs.default;
  };

  document.querySelectorAll('[data-wa]').forEach(link => {
    const url = window.getWhatsAppUrl(pick(link.getAttribute('data-wa')));
    link.setAttribute('href', url);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });
}

/* ---------- CABEÇALHO: fundo ao rolar, some ao descer e volta ao subir ---------- */
function initHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);
    const menuOpen = document.body.classList.contains('menu-locked');
    header.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 480);
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
}

/* ---------- MENU DO CELULAR ---------- */
function initMobileMenu() {
  const btn = document.getElementById('hamburgerBtn');
  const menu = document.getElementById('navMenu');
  const header = document.getElementById('siteHeader');
  if (!btn || !menu) return;

  const setOpen = (open) => {
    btn.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    header && header.classList.toggle('menu-open', open);
    document.body.classList.toggle('menu-locked', open);
    document.body.style.overflow = open ? 'hidden' : '';
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  btn.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  window.addEventListener('resize', () => { if (window.innerWidth > 960) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
}

/* ---------- MARCA NO MENU A SEÇÃO QUE ESTÁ NA TELA ---------- */
function initActiveNav() {
  const links = [...document.querySelectorAll('.nav-link')];
  const map = new Map();
  links.forEach(l => {
    const el = document.querySelector(l.getAttribute('href'));
    if (el) map.set(el, l);
  });
  if (!map.size || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('is-active'));
        map.get(entry.target).classList.add('is-active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  map.forEach((_, el) => io.observe(el));
}

/* ---------- ANIMAÇÃO DE ENTRADA DOS BLOCOS ---------- */
function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
      const idx = Math.max(0, siblings.indexOf(el));
      el.style.transitionDelay = (idx % 3) * 90 + 'ms';
      el.classList.add('is-revealed');
      // depois de aparecer, tira o atraso para o hover responder na hora
      setTimeout(() => { el.style.transitionDelay = ''; }, 1200);
      io.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ---------- FOTOS DOS BASTIDORES: saem do desfoque conforme a página rola ----------
   Quando a foto entra pela parte de baixo da tela ela está embaçada e transparente;
   à medida que sobe, vai ficando nítida, e fica 100% revelada antes do meio da tela. */
function initBlurReveal() {
  const cards = [...document.querySelectorAll('.backstage .photo-card')];
  if (!cards.length) return;
  if (REDUCED_MOTION) { cards.forEach(c => { c.style.setProperty('--blur', '0px'); c.style.setProperty('--fade', '1'); c.style.setProperty('--zoom', '1'); }); return; }

  let ticking = false;
  const update = () => {
    const vh = innerHeight;
    cards.forEach(card => {
      const top = card.getBoundingClientRect().top;
      // 0 quando o topo da foto está no pé da tela; 1 quando chega a 45% da altura
      let p = (vh - top) / (vh * 0.55);
      p = Math.max(0, Math.min(1, p));
      const e = 1 - Math.pow(1 - p, 2);            // suaviza o final
      card.style.setProperty('--blur', (14 * (1 - e)).toFixed(2) + 'px');
      card.style.setProperty('--fade', (0.25 + 0.75 * e).toFixed(3));
      card.style.setProperty('--zoom', (1.08 - 0.08 * e).toFixed(4));
    });
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  addEventListener('resize', update);
  update();
}

/* ---------- SCROLL PORTAL ("Quem Somos") ----------
   Inspirado no Scroll Portal da React Bits Pro (feito do zero, sem o código pago).
   Os quadros ficam encaixados um atrás do outro em profundidade (3D). A rolagem move a "câmera"
   para frente: o quadro atual voa para fora e o próximo vem ficando grande e nítido.
   Opções (atributos data-* no #scrollPortal): frame-depth, perspective, scroll-length, scrub, dim. */
function initScrollPortal() {
  const portal = document.getElementById('scrollPortal');
  if (!portal || REDUCED_MOTION) return;              // sem animação: os quadros aparecem empilhados
  const frames = [...portal.querySelectorAll('.portal-frame')];
  const N = frames.length;
  if (N < 2) return;
  const idxEl = document.getElementById('portalIndex');
  const barEl = document.getElementById('portalBar');

  const opt = (k, d) => parseFloat(portal.dataset[k] ?? d);
  const frameDepth = opt('frameDepth', 1), scrollLength = opt('scrollLength', 1);
  const scrub = opt('scrub', 0.35), dim = opt('dim', 0.55);
  const mobile = () => innerWidth < 768;
  const depth = () => (mobile() ? 520 : 820) * frameDepth;
  const persp = () => (mobile() ? 0.75 : 1) * opt('perspective', 1000);

  const layout = () => {
    portal.style.setProperty('--portal-height', ((N - 1) * scrollLength * 100 + 100) + 'vh');
    portal.style.setProperty('--portal-perspective', persp() + 'px');
  };
  portal.classList.add('is-live');
  layout();
  addEventListener('resize', layout);

  let cur = 0, last = performance.now(), raf = 0, shown = -1;

  const target = () => {
    const r = portal.getBoundingClientRect();
    const span = r.height - innerHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    return p * (N - 1);
  };

  const render = () => {
    const D = depth();
    frames.forEach((f, i) => {
      const rel = i - cur;                       // 0 = quadro na frente; >0 = mais fundo; <0 = já passou
      const z = -rel * D;
      let op = 1, content;
      if (rel < 0) { op = Math.max(0, 1 + rel / 0.55); content = Math.max(0, 1 + rel * 2.2); }
      else content = Math.max(0, 1 - rel * 1.7);
      f.style.setProperty('--z', z.toFixed(1) + 'px');
      f.style.opacity = op.toFixed(3);
      f.style.visibility = op <= 0.01 ? 'hidden' : '';
      f.style.setProperty('--portal-content', content.toFixed(3));
      f.style.setProperty('--portal-dim', (dim * Math.min(1, Math.max(0, rel) / 2)).toFixed(3));
      f.style.pointerEvents = Math.abs(rel) < 0.35 ? 'auto' : 'none';
      f.style.zIndex = String(N - i);
    });
    const active = Math.min(N - 1, Math.max(0, Math.round(cur)));
    if (active !== shown) { shown = active; if (idxEl) idxEl.textContent = String(active + 1).padStart(2, '0'); }
    if (barEl) barEl.style.width = (cur / (N - 1) * 100).toFixed(1) + '%';
  };

  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = target();
    cur = scrub > 0 ? cur + (t - cur) * (1 - Math.exp(-dt / scrub)) : t;
    if (Math.abs(t - cur) < 0.0005) cur = t;
    render();
    raf = Math.abs(t - cur) > 0.0005 ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  addEventListener('scroll', wake, { passive: true });
  addEventListener('resize', wake);
  cur = target(); render();
}

/* ---------- PALAVRAS QUE SE ALTERNAM NO TÍTULO ---------- */
function initTypewriter() {
  const el = document.getElementById('typewriterTarget');
  if (!el || REDUCED_MOTION) return;

  const words = ['clientes de verdade', 'vendas', 'leads qualificados', 'reconhecimento', 'lucro'];
  let w = 0, i = words[0].length, deleting = true;

  const tick = () => {
    const word = words[w];
    if (deleting) {
      i--;
      el.textContent = word.slice(0, i);
      if (i === 0) { deleting = false; w = (w + 1) % words.length; return setTimeout(tick, 350); }
      return setTimeout(tick, 38);
    }
    const next = words[w];
    i++;
    el.textContent = next.slice(0, i);
    if (i === next.length) { deleting = true; return setTimeout(tick, 2200); }
    setTimeout(tick, 75);
  };

  setTimeout(tick, 2600);
}

/* ---------- FUNDO ANIMADO: as cores se movem conforme a página rola ---------- */
function initAurora() {
  const aurora = document.querySelector('.aurora');
  if (!aurora || REDUCED_MOTION) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    aurora.style.setProperty('--p', p.toFixed(4));
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ---------- LUZ QUE ACOMPANHA O MOUSE PELO SITE INTEIRO (com leve atraso, mais natural) ---------- */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || !CAN_HOVER) return;
  let tx = innerWidth / 2, ty = innerHeight / 3, x = tx, y = ty, running = false;

  const loop = () => {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    glow.style.setProperty('--cx', x.toFixed(1) + 'px');
    glow.style.setProperty('--cy', y.toFixed(1) + 'px');
    if (Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) requestAnimationFrame(loop);
    else running = false;
  };

  window.addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    glow.classList.add('is-on');
    if (REDUCED_MOTION) { x = tx; y = ty; loop(); return; }
    if (!running) { running = true; requestAnimationFrame(loop); }
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => glow.classList.remove('is-on'));
}

/* ---------- LUZ AZUL QUE SEGUE O MOUSE NO TOPO ---------- */
function initHeroSpotlight() {
  const hero = document.getElementById('hero');
  if (!hero || !CAN_HOVER) return;
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    hero.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
}

/* ---------- PAINEL DE LEADS "AO VIVO" (demonstração) ---------- */
function initLiveDash() {
  const list = document.getElementById('dashList');
  const bars = document.getElementById('dashBars');
  const kLeads = document.getElementById('kpiLeads');
  const kConv = document.getElementById('kpiConversa');
  const kSales = document.getElementById('kpiVendas');
  if (!list || REDUCED_MOTION) return;

  const pool = [
    ['Lucas M.', 'Anúncio Meta · Imóveis'],
    ['Ana B.', 'Google Ads · Consórcio'],
    ['Pedro H.', 'Anúncio Meta · Veículos'],
    ['Camila R.', 'Anúncio Meta · Clínica'],
    ['Bruno T.', 'Google Ads · Crédito'],
    ['Fernanda L.', 'Anúncio Meta · Loja'],
    ['Diego A.', 'Anúncio Meta · Consórcio'],
    ['Larissa V.', 'Google Ads · Imóveis']
  ];
  const statuses = [
    ['Novo', 'dash-status--new'],
    ['Em conversa', 'dash-status--talk'],
    ['Fechou', 'dash-status--won']
  ];
  let p = 0, timer = null, visible = false;

  const bump = (el, delta) => {
    if (!el) return;
    el.textContent = String(parseInt(el.textContent, 10) + delta);
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  };

  const step = () => {
    const [name, src] = pool[p % pool.length];
    p++;
    const initials = name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
    const li = document.createElement('li');
    li.className = 'is-new';
    li.innerHTML = `<span class="dash-avatar">${initials}</span><span class="dash-who"><b>${name}</b><small>${src}</small></span><span class="dash-status ${statuses[0][1]}">${statuses[0][0]}</span>`;
    list.prepend(li);

    // o lead anterior avança uma etapa
    const prev = list.children[1];
    if (prev) {
      const st = prev.querySelector('.dash-status');
      prev.classList.remove('is-new');
      if (st && st.textContent === 'Novo') { st.textContent = statuses[1][0]; st.className = 'dash-status ' + statuses[1][1]; bump(kConv, 1); }
    }
    const third = list.children[2];
    if (third && p % 2 === 0) {
      const st = third.querySelector('.dash-status');
      if (st && st.textContent === 'Em conversa') { st.textContent = statuses[2][0]; st.className = 'dash-status ' + statuses[2][1]; bump(kSales, 1); bump(kConv, -1); }
    }
    while (list.children.length > 3) list.lastElementChild.remove();
    bump(kLeads, 1);

    // a última barra do gráfico cresce
    if (bars) {
      const last = bars.lastElementChild;
      const h = Math.min(100, parseFloat(getComputedStyle(last).getPropertyValue('--h')) + 3);
      if (h >= 100) {
        bars.firstElementChild.remove();
        const nb = document.createElement('span');
        nb.style.setProperty('--h', '22%');
        bars.appendChild(nb);
      } else {
        last.style.setProperty('--h', h + '%');
      }
    }
  };

  const start = () => { if (!timer) timer = setInterval(step, 3200); };
  const stop = () => { clearInterval(timer); timer = null; };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }, { threshold: 0.2 }).observe(list);
  } else start();
  document.addEventListener('visibilitychange', () => { document.hidden ? stop() : (visible && start()); });
}

/* ---------- NÚMEROS QUE CONTAM ATÉ O VALOR FINAL ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const fmt = (v, dec) => v.toFixed(dec).replace('.', ',');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const pre = el.dataset.prefix || '';
      const suf = el.dataset.suffix || '';
      if (isNaN(end) || REDUCED_MOTION) return;

      const dur = 1600;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + fmt(end * eased, dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => io.observe(c));
}

/* ---------- NÚMEROS: brilho que segue o mouse (e acende sozinho no celular) ---------- */
function initStatsGlow() {
  const stats = document.querySelectorAll('.stat');
  stats.forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // no celular não existe "passar o mouse": o cartão acende quando chega ao centro da tela
  if (!CAN_HOVER && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('is-lit', e.isIntersecting));
    }, { rootMargin: '-40% 0px -40% 0px' });
    stats.forEach(s => io.observe(s));
  }
}

/* ---------- FOTO DO CEO: inclina e a luz acompanha o mouse ---------- */
function initCeoStage() {
  const stage = document.getElementById('ceoStage');
  if (!stage || !CAN_HOVER || REDUCED_MOTION) return;

  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    stage.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg');
    stage.style.setProperty('--rx', ((0.5 - y) * 6).toFixed(2) + 'deg');
  });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--rx', '0deg');
    stage.style.setProperty('--ry', '0deg');
  });
}

/* ---------- CARROSSEL CONTÍNUO DOS PRINTS ---------- */
function initProofsLoop() {
  const track = document.getElementById('proofsTrack');
  if (!track || REDUCED_MOTION) return;

  [...track.children].forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('button').forEach(b => b.setAttribute('tabindex', '-1'));
    track.appendChild(clone);
  });
  track.classList.add('is-looping');
}

/* ---------- BRILHO QUE SEGUE O MOUSE NOS CARTÕES DE SERVIÇO ---------- */
function initServiceGlow() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
}

/* ---------- BOTÕES "MAGNÉTICOS": acompanham levemente o mouse ---------- */
function initMagneticButtons() {
  if (!CAN_HOVER || REDUCED_MOTION) return;
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.12}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

/* ---------- DÚVIDAS: abre uma por vez ---------- */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) items.forEach(o => { if (o !== item) o.open = false; });
    });
  });
}

/* ---------- JANELAS (abrir / fechar) ---------- */
const Modal = {
  open(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    const close = m.querySelector('.modal-close');
    close && close.focus({ preventScroll: true });
  },
  close(m) {
    if (!m) return;
    m.classList.remove('is-open');
    document.body.style.overflow = '';
    m.dispatchEvent(new CustomEvent('modal:closed'));
  }
};

function initModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m || e.target.closest('[data-close]')) Modal.close(m);
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal.is-open').forEach(m => Modal.close(m));
  });
  document.querySelectorAll('[data-open-privacy]').forEach(el => {
    el.addEventListener('click', e => { e.preventDefault(); Modal.open('privacyModal'); });
  });
}

/* ---------- VÍDEOS DO INSTAGRAM ---------- */
function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const holder = document.getElementById('videoFrameHolder');
  const igLink = document.getElementById('modalIgLink');
  if (!modal || !holder) return;

  document.querySelectorAll('[data-video-url]').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const url = trigger.getAttribute('data-video-url');
      const match = url.match(/instagram\.com\/(?:reels?|p)\/([^/?#]+)/i);
      if (!match) { window.open(url, '_blank', 'noopener'); return; }

      holder.innerHTML = '';
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.instagram.com/reel/${match[1]}/embed/`;
      iframe.title = 'Vídeo do Instagram';
      iframe.setAttribute('allowtransparency', 'true');
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      iframe.setAttribute('scrolling', 'no');
      holder.appendChild(iframe);
      if (igLink) igLink.href = url;
      Modal.open('videoModal');
    });
  });

  modal.addEventListener('modal:closed', () => { holder.innerHTML = ''; });
}

/* ---------- VÍDEOS QUE TOCAM SOZINHOS ----------
   Tocam mudos (regra dos navegadores) e só quando aparecem na tela.
   O botão (ou um toque no vídeo) liga o som; só um vídeo fica com som por vez. */
function initAutoplayVideos() {
  const videos = [...document.querySelectorAll('.reel-video')];
  if (!videos.length) return;

  const setSound = (video, on) => {
    const btn = video.parentElement.querySelector('.sound-btn');
    video.muted = !on;
    if (btn) {
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', String(on));
      btn.setAttribute('aria-label', on ? 'Desligar som do vídeo' : 'Ativar som do vídeo');
      const label = btn.querySelector('.sound-label');
      if (label) label.textContent = on ? 'Som ligado' : 'Ativar som';
    }
  };

  const toggle = (video) => {
    const turnOn = video.muted;
    videos.forEach(v => { if (v !== video) setSound(v, false); });
    setSound(video, turnOn);
    if (turnOn) { video.currentTime = 0; }
    video.play().catch(() => {});
  };

  videos.forEach(video => {
    const wrap = video.parentElement;
    const btn = wrap.querySelector('.sound-btn');
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); toggle(video); });
    wrap.addEventListener('click', () => toggle(video));
  });

  if (REDUCED_MOTION || !('IntersectionObserver' in window)) return;   // sem autoplay: toca ao clicar

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting) {
        if (v.preload === 'none') { v.preload = 'auto'; }
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, { threshold: 0.45 });
  videos.forEach(v => io.observe(v));
}

/* ---------- VÍDEO EM DESTAQUE: não toca sozinho, só quando a pessoa clica ---------- */
function initFeaturedPlayer() {
  const wrap = document.getElementById('featuredPlayer');
  const btn = document.getElementById('featuredPlayBtn');
  if (!wrap || !btn) return;
  const video = wrap.querySelector('video');

  btn.addEventListener('click', () => {
    // desliga o som dos outros vídeos para não tocarem juntos
    document.querySelectorAll('.reel-video').forEach(v => {
      v.muted = true;
      const b = v.parentElement.querySelector('.sound-btn');
      if (b) { b.classList.remove('is-on'); b.setAttribute('aria-pressed', 'false'); const l = b.querySelector('.sound-label'); if (l) l.textContent = 'Ativar som'; }
    });
    wrap.classList.add('is-playing');
    video.controls = true;
    video.muted = false;
    video.play().catch(() => {});
  });

  video.addEventListener('ended', () => {
    wrap.classList.remove('is-playing');
    video.controls = false;
    video.currentTime = 0;
    video.load();               // volta a mostrar a capa
  });
}

/* ---------- PRINTS AMPLIADOS ---------- */
function openImageModal(src, caption) {
  const img = document.getElementById('imageModalSrc');
  const cap = document.getElementById('imageModalCaption');
  if (!img) return;
  img.src = src;
  if (cap) cap.textContent = caption || '';
  Modal.open('imageModal');
}
window.openImageModal = openImageModal;

function initImageModal() {
  const track = document.getElementById('proofsTrack');
  if (!track) return;
  track.addEventListener('click', e => {
    const btn = e.target.closest('[data-image]');
    if (btn) openImageModal(btn.dataset.image, btn.dataset.caption);
  });
}

/* ---------- AVISO DE COOKIES (LGPD) ---------- */
function initCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const btn = document.getElementById('acceptCookiesBtn');
  if (!banner || !btn) return;

  let accepted = false;
  try { accepted = !!localStorage.getItem('vectra_cookie_consent'); } catch (e) {}
  if (!accepted) setTimeout(() => { banner.hidden = false; }, 1200);

  btn.addEventListener('click', () => {
    try { localStorage.setItem('vectra_cookie_consent', 'true'); } catch (e) {}
    banner.hidden = true;
  });
}
