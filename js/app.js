/* Sucré & Salé — site logic: language, menu, builders, cart and checkout. */
(function () {
  const CFG = window.SITE_CONFIG;
  const MENU = window.MENU;
  const I18N = window.I18N;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } }
  };

  let lang = store.get('ss_lang', null) || ((navigator.language || 'fr').startsWith('fr') ? 'fr' : 'en');
  let cart = store.get('ss_cart', []).filter((l) => { try { MENU.priceLine(l); return true; } catch { return false; } });

  const t = (k, vars) => {
    let s = (I18N.ui[lang] && I18N.ui[lang][k]) || I18N.ui.fr[k] || k;
    if (vars) Object.keys(vars).forEach((v) => { s = s.replace('{' + v + '}', vars[v]); });
    return s;
  };
  const money = (n) => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { style: 'currency', currency: 'EUR' }).format(n);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Config-driven content ---------- */
  function applyConfig() {
    $$('.js-phone').forEach((a) => { a.href = 'tel:' + CFG.phoneIntl; });
    $$('.js-phone-text').forEach((s) => { s.textContent = CFG.phone; });
    $$('.js-uber').forEach((a) => { a.href = CFG.uberEatsUrl; });
    $$('[data-href="maps"]').forEach((a) => { a.href = CFG.mapsUrl; });
    $$('.js-address').forEach((p) => { p.textContent = CFG.address; });
    $('#reviewCount').textContent = CFG.googleReviews;
    $('#year').textContent = new Date().getFullYear();
    $('#demoNote').hidden = CFG.paymentMode !== 'demo';
  }

  /* ---------- Language ---------- */
  const frOriginals = new Map();
  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (!frOriginals.has(el)) frOriginals.set(el, el.innerHTML);
      el.innerHTML = lang === 'en' && I18N.en[key] ? I18N.en[key] : frOriginals.get(el);
    });
    $$('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    const h = CFG.hours;
    $('#hoursText').textContent = h.close ? t('hoursRange', { o: fmtTime(h.open), c: fmtTime(h.close) }) : t('hours', { o: fmtTime(h.open) });
    updateOpenStatus();
    $('#marquee').innerHTML = [0, 1].map(() => t('marquee').map((w) => `<span>${esc(w)}</span><i>✦</i>`).join('')).join('');
    const promo = $('#promo');
    promo.hidden = !CFG.promo.enabled;
    $('#promoText').textContent = CFG.promo[lang] || CFG.promo.fr;
    renderMenu();
    renderBuilders();
    renderCart();
    fillPickup();
  }

  /* ---------- Opening hours ---------- */
  const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
  function fmtTime(hhmm) {
    if (hhmm === '24:00' || hhmm === '00:00') return t('midnight');
    return lang === 'fr' ? hhmm.replace(':', 'h') : hhmm;
  }
  // Minutes since midnight in the restaurant's time zone
  function parisMinutes() {
    try {
      const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      const get = (k) => Number(parts.find((x) => x.type === k).value);
      return get('hour') * 60 + get('minute');
    } catch { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
  }
  function isOpenNow() {
    const h = CFG.hours;
    const now = parisMinutes();
    const o = toMin(h.open);
    const c = h.close ? (toMin(h.close) || 1440) : 1440;
    return now >= o && now < c;
  }
  function updateOpenStatus() {
    const open = isOpenNow();
    const el = $('#openStatus');
    el.classList.toggle('eyebrow--closed', !open);
    $('#openText').textContent = open
      ? t('openNow', { c: fmtTime(CFG.hours.close || '24:00') })
      : t('closedNow', { o: fmtTime(CFG.hours.open) });
  }

  /* ---------- Menu ---------- */
  let activeCat = 'signatures';
  const tagLabel = { hot: 'tagHot', star: 'tagStar', veg: 'tagVeg' };

  function itemCard(it, i) {
    const price = it.menuPrice ? `${money(it.price)} <small>/ ${money(it.menuPrice)}</small>` : money(it.price);
    const tag = it.tag ? `<span class="tag tag--${it.tag}">${t(tagLabel[it.tag])}</span>` : '';
    const img = it.img ? `<img class="card__img" src="assets/img/${it.img}.jpg" alt="" loading="lazy">` : '';
    return `<article class="card${it.img ? ' card--img' : ''}" style="--i:${i}">
      ${img}
      <div class="card__body">
        <div class="card__top"><h3>${esc(it.name)}</h3>${tag}</div>
        <p>${esc(it[lang])}</p>
        <div class="card__foot">
          <span class="price">${price}</span>
          <button type="button" class="btn btn--add" data-add="${it.id}" aria-label="${t('add')} ${esc(it.name)}">
            <span aria-hidden="true">+</span> ${t('add')}
          </button>
        </div>
      </div>
    </article>`;
  }

  function sweetPanel() {
    const s = MENU.sucreeBuilder;
    return `<div class="grid">
      <article class="card card--img">
        <img class="card__img" src="assets/img/sweets.jpg" alt="" loading="lazy">
        <div class="card__body">
          <div class="card__top"><h3>${lang === 'fr' ? 'Crêpe sucrée à composer' : 'Build-your-own sweet crêpe'}</h3></div>
          <p>${s.toppings.map((x) => (lang === 'fr' ? x[1] : x[2])).join(' · ')}</p>
          <div class="card__foot"><span class="price">${lang === 'fr' ? 'dès' : 'from'} ${money(s.base)}</span>
            <a class="btn btn--add" href="#builderSucree">${lang === 'fr' ? 'Composer' : 'Build'} →</a></div>
        </div>
      </article>
      <article class="card card--img">
        <img class="card__img" src="assets/img/cakes.jpg" alt="" loading="lazy">
        <div class="card__body">
          <div class="card__top"><h3>${lang === 'fr' ? 'Gâteaux & pâtisseries' : 'Cakes & pastries'}</h3></div>
          <p>${lang === 'fr' ? 'Gâteaux entiers, douceurs orientales et pâtisseries : découvrez notre vitrine en boutique. Gâteaux sur commande : appelez-nous.' : 'Whole cakes, oriental sweets and pastries: see our display in store. Cakes to order: give us a call.'}</p>
          <div class="card__foot"><span class="price small">${lang === 'fr' ? 'En boutique' : 'In store'}</span>
            <a class="btn btn--add js-phone" href="tel:${CFG.phoneIntl}">${lang === 'fr' ? 'Appeler' : 'Call'}</a></div>
        </div>
      </article>
    </div>`;
  }

  function renderMenu() {
    const tabs = $('#menuTabs');
    tabs.innerHTML = MENU.categories.map((c) =>
      `<button type="button" role="tab" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${c.id === activeCat}" data-cat="${c.id}">${esc(c[lang])}</button>`
    ).join('');
    $('#menuPanels').innerHTML = MENU.categories.map((c) => {
      const note = lang === 'fr' ? c.noteFr : c.noteEn;
      const body = c.id === 'sucrees' ? sweetPanel()
        : `<div class="grid">${MENU.items.filter((i) => i.cat === c.id).map((it, i) => itemCard(it, i)).join('')}</div>`;
      return `<div class="panel" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}" ${c.id === activeCat ? '' : 'hidden'}>
        <div class="panel__head"><h3>${esc(c[lang])}</h3>${note ? `<p>${esc(note)}</p>` : ''}</div>${body}</div>`;
    }).join('');
  }

  $('#menuTabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    activeCat = b.dataset.cat;
    $$('#menuTabs [role=tab]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    $$('#menuPanels .panel').forEach((p) => { p.hidden = p.id !== 'panel-' + activeCat; });
    b.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  });

  $('#menuPanels').addEventListener('click', (e) => {
    const b = e.target.closest('[data-add]');
    if (!b) return;
    const it = MENU.byId[b.dataset.add];
    if (it.drink || it.menuPrice) { modalSource = b; openItemModal(it); }
    else addLine({ id: it.id, qty: 1, opts: {} }, b);
  });

  /* ---------- Item options dialog ---------- */
  const modal = $('#itemModal');
  let modalItem = null;
  let modalQty = 1;
  let modalSource = null;

  function modalOpts() {
    const opts = {};
    const v = $('input[name=variant]:checked', modal);
    if (v) opts.variant = v.value;
    const d = $('input[name=drink]', modal);
    if (d && d.checked) opts.drink = true;
    return opts;
  }
  function updateModalPrice() {
    const p = MENU.priceLine({ id: modalItem.id, opts: modalOpts() }).unit * modalQty;
    $('#imAdd').textContent = t('addFor', { p: money(p) });
    $('#imQty').textContent = modalQty;
  }
  function openItemModal(it) {
    modalItem = it;
    modalQty = 1;
    $('#imTitle').textContent = it.name;
    $('#imDesc').textContent = it[lang];
    let html = '';
    if (it.menuPrice) {
      html += `<div class="opt-list">
        <label class="opt"><input type="radio" name="variant" value="seul" checked><span>${t('solo')}</span><b>${money(it.price)}</b></label>
        <label class="opt"><input type="radio" name="variant" value="menu"><span>${t('meal')}</span><b>${money(it.menuPrice)}</b></label></div>`;
    }
    if (it.drink) {
      html += `<div class="opt-list"><label class="opt"><input type="checkbox" name="drink"><span>${t('drink')}</span><b>+${money(MENU.DRINK_PRICE)}</b></label></div>`;
    }
    $('#imOptions').innerHTML = html;
    updateModalPrice();
    modal.showModal();
  }
  modal.addEventListener('change', updateModalPrice);
  modal.addEventListener('click', (e) => {
    const s = e.target.closest('[data-step]');
    if (s) { modalQty = Math.max(1, Math.min(20, modalQty + Number(s.dataset.step))); updateModalPrice(); }
    if (e.target === modal) modal.close('cancel');
  });
  modal.addEventListener('close', () => {
    if (modal.returnValue === 'add' && modalItem) addLine({ id: modalItem.id, qty: modalQty, opts: modalOpts() }, modalSource);
    modal.returnValue = '';
  });

  /* ---------- Builders ---------- */
  const bs = { size: 'classic', extras: new Set() };
  const bsw = { toppings: new Set() };

  function renderBuilders() {
    const B = MENU.saleeBuilder;
    $('#bsSizes').innerHTML = B.sizes.map((s) =>
      `<label><input type="radio" name="bsSize" value="${s.id}" ${bs.size === s.id ? 'checked' : ''}><span>${s[lang]} · ${money(s.price)}</span></label>`).join('');
    $('#bsGroups').innerHTML = B.groups.map((g) => {
      const hint = g.id === 'sauces' ? t('sauces') : '';
      return `<fieldset class="bgroup"><legend>${g[lang]} ${hint ? `<small>(${hint})</small>` : ''}</legend><div class="chips">
        ${g.options.map((o) => `<label class="chip"><input type="checkbox" value="${o[0]}" data-group="${g.id}" ${bs.extras.has(o[0]) ? 'checked' : ''}>
          <span>${esc(lang === 'fr' ? o[1] : o[2])}${o[3] ? ` <small>+${money(o[3])}</small>` : ''}</span></label>`).join('')}
      </div></fieldset>`;
    }).join('');
    $('#bswToppings').innerHTML = MENU.sucreeBuilder.toppings.map((o) =>
      `<label class="chip"><input type="checkbox" value="${o[0]}" ${bsw.toppings.has(o[0]) ? 'checked' : ''}>
        <span>${esc(lang === 'fr' ? o[1] : o[2])} <small>+${money(o[3])}</small></span></label>`).join('');
    updateBuilderPrices();
  }
  function setPrice(el, text) {
    if (el.textContent === text) return;
    el.textContent = text;
    el.classList.remove('tick'); void el.offsetWidth; el.classList.add('tick');
  }
  function updateBuilderPrices() {
    setPrice($('#bsPrice'), money(MENU.priceLine({ id: 'build-salee', opts: { size: bs.size, extras: [...bs.extras] } }).unit));
    setPrice($('#bswPrice'), money(MENU.priceLine({ id: 'build-sucree', opts: { toppings: [...bsw.toppings] } }).unit));
  }
  $('#builderSalee').addEventListener('change', (e) => {
    const el = e.target;
    if (el.name === 'bsSize') bs.size = el.value;
    else if (el.type === 'checkbox') {
      if (el.checked && el.dataset.group === 'sauces') {
        const n = $$('input[data-group=sauces]:checked', $('#builderSalee')).length;
        if (n > 2) { el.checked = false; toast(t('sauces')); return; }
      }
      el.checked ? bs.extras.add(el.value) : bs.extras.delete(el.value);
    }
    updateBuilderPrices();
  });
  $('#builderSucree').addEventListener('change', (e) => {
    const el = e.target;
    if (el.type !== 'checkbox') return;
    el.checked ? bsw.toppings.add(el.value) : bsw.toppings.delete(el.value);
    updateBuilderPrices();
  });
  $('#bsAdd').addEventListener('click', () => {
    if (!bs.extras.size) { toast(t('chooseOne')); return; }
    addLine({ id: 'build-salee', qty: 1, opts: { size: bs.size, extras: [...bs.extras] } }, $('#bsAdd'));
    bs.extras.clear(); renderBuilders();
  });
  $('#bswAdd').addEventListener('click', () => {
    addLine({ id: 'build-sucree', qty: 1, opts: { toppings: [...bsw.toppings] } }, $('#bswAdd'));
    bsw.toppings.clear(); renderBuilders();
  });

  /* ---------- Cart ---------- */
  const keyOf = (l) => l.id + '|' + JSON.stringify(l.opts || {});
  function saveCart() { store.set('ss_cart', cart); }
  function addLine(line, sourceEl) {
    const k = keyOf(line);
    const ex = cart.find((l) => keyOf(l) === k);
    if (ex) ex.qty = Math.min(20, ex.qty + line.qty);
    else cart.push(line);
    saveCart();
    const done = () => {
      renderCart();
      const cnt = $('#cartCount');
      cnt.classList.remove('bump'); void cnt.offsetWidth; cnt.classList.add('bump');
      const btn = $('#cartOpen');
      btn.classList.remove('wiggle'); void btn.offsetWidth; btn.classList.add('wiggle');
    };
    flyToCart(sourceEl, done);
    toast(t('added', { n: MENU.priceLine(line, lang).name }));
  }
  // Little crêpe flying from the button into the basket
  function flyToCart(from, done) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!from || reduce || !from.getBoundingClientRect) { done(); return; }
    const a = from.getBoundingClientRect();
    const b = $('#cartOpen').getBoundingClientRect();
    if (!a.width) { done(); return; }
    const dot = document.createElement('span');
    dot.className = 'fly';
    dot.textContent = '🥞';
    document.body.appendChild(dot);
    const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
    const x1 = b.left + b.width / 2, y1 = b.top + b.height / 2;
    const anim = dot.animate([
      { transform: `translate(${x0}px, ${y0}px) translate(-50%, -50%) scale(.6)`, opacity: 0 },
      { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 120}px) translate(-50%, -50%) scale(1.4) rotate(180deg)`, opacity: 1, offset: .5 },
      { transform: `translate(${x1}px, ${y1}px) translate(-50%, -50%) scale(.4) rotate(360deg)`, opacity: .9 }
    ], { duration: 750, easing: 'cubic-bezier(.5, 0, .3, 1)' });
    anim.onfinish = () => { dot.remove(); done(); };
  }
  const cartTotal = () => cart.reduce((s, l) => s + MENU.priceLine(l).unit * l.qty, 0);

  function renderCart() {
    const count = cart.reduce((s, l) => s + l.qty, 0);
    $('#cartCount').textContent = count;
    $('#cartCount').hidden = !count;
    $('#cartEmpty').hidden = !!cart.length;
    $('#checkoutForm').hidden = !cart.length;
    $('#drawerFoot').hidden = !cart.length;
    $('#cartLines').innerHTML = cart.map((l, i) => {
      const p = MENU.priceLine(l, lang);
      return `<li class="line">
        <div class="line__info"><strong>${esc(p.name)}</strong>${p.details ? `<small>${esc(p.details)}</small>` : ''}</div>
        <div class="qty"><button type="button" data-q="${i}" data-d="-1" aria-label="−">−</button><output>${l.qty}</output><button type="button" data-q="${i}" data-d="1" aria-label="+">+</button></div>
        <span class="line__price">${money(p.unit * l.qty)}</span>
      </li>`;
    }).join('');
    const total = money(cartTotal());
    $('#cartTotal').textContent = total;
    $('#payLabel').textContent = t('pay', { p: total });
  }
  $('#cartLines').addEventListener('click', (e) => {
    const b = e.target.closest('[data-q]');
    if (!b) return;
    const l = cart[Number(b.dataset.q)];
    l.qty += Number(b.dataset.d);
    if (l.qty <= 0) cart.splice(Number(b.dataset.q), 1);
    l.qty = Math.min(20, l.qty);
    saveCart(); renderCart();
  });

  const drawer = $('#drawer');
  const overlay = $('#overlay');
  function openCart() {
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
    overlay.hidden = false; document.body.classList.add('lock');
    $('#cartClose').focus();
  }
  function closeCart() {
    drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');
    overlay.hidden = true; document.body.classList.remove('lock');
  }
  $('#cartOpen').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  overlay.addEventListener('click', closeCart);
  $$('.js-close-cart').forEach((a) => a.addEventListener('click', closeCart));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeCart(); });

  /* ---------- Checkout ---------- */
  function fillPickup() {
    const sel = $('#pickupSelect');
    const prev = sel.value;
    const [oh, om] = CFG.hours.open.split(':').map(Number);
    const now = new Date();
    const start = new Date(now.getTime() + 30 * 60000);
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
    const opening = new Date(now); opening.setHours(oh, om, 0, 0);
    if (start < opening) start.setTime(opening.getTime() + 15 * 60000);
    const opts = [`<option value="asap">${t('asap')}</option>`];
    for (let i = 0; i < 12; i++) {
      const d = new Date(start.getTime() + i * 15 * 60000);
      if (d.getDate() !== now.getDate()) break;
      if (CFG.hours.close && d.getHours() * 60 + d.getMinutes() >= (toMin(CFG.hours.close) || 1440)) break;
      const hm = d.toTimeString().slice(0, 5);
      opts.push(`<option value="${hm}">${hm}</option>`);
    }
    sel.innerHTML = opts.join('');
    if (prev && $$('option', sel).some((o) => o.value === prev)) sel.value = prev;
  }

  function showError(msg) { const e = $('#formError'); e.textContent = msg; e.hidden = !msg; }

  $('#checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const data = Object.fromEntries(new FormData(f));
    data.name = (data.name || '').trim();
    if (data.name.length < 2) { showError(t('errName')); f.name.focus(); return; }
    if (!/^[0-9 +().-]{8,20}$/.test((data.phone || '').trim())) { showError(t('errPhone')); f.phone.focus(); return; }
    showError('');
    const pickupLabel = data.pickup === 'asap' ? t('asap') : data.pickup;
    const payload = { lang, lines: cart.map(({ id, qty, opts }) => ({ id, qty, opts })),
      customer: { name: data.name, phone: data.phone.trim(), mode: data.mode, pickup: pickupLabel, notes: (data.notes || '').trim() } };

    if (CFG.paymentMode !== 'stripe') {
      store.set('ss_last', { name: data.name, mode: data.mode, pickup: pickupLabel, total: cartTotal(), lines: payload.lines });
      showConfirmation(true);
      return;
    }
    const btn = $('#payBtn');
    btn.disabled = true; $('#payLabel').textContent = t('paying');
    try {
      store.set('ss_last', { name: data.name, mode: data.mode, pickup: pickupLabel, total: cartTotal(), lines: payload.lines });
      const res = await fetch(CFG.checkoutEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error || 'checkout');
      window.location.href = json.url;
    } catch (err) {
      showError(t('errPay'));
      btn.disabled = false; renderCart();
    }
  });

  function showConfirmation(isDemo) {
    const last = store.get('ss_last', null);
    if (!last) return;
    closeCart();
    $('#cfTitle').textContent = t('okTitle');
    $('#cfText').textContent = t('okText', { n: last.name.split(' ')[0] });
    $('#cfDemo').textContent = t('okDemo');
    $('#cfDemo').hidden = !isDemo;
    $('#cfRecap').innerHTML = last.lines.map((l) => {
      const p = MENU.priceLine(l, lang);
      return `<div><span>${l.qty}× ${esc(p.name)}${p.details ? ` <small>(${esc(p.details)})</small>` : ''}</span><b>${money(p.unit * l.qty)}</b></div>`;
    }).join('') + `<div class="recap__meta"><span>${t('mode')}: ${t(last.mode)} · ${t('pickupAt')}: ${esc(last.pickup)}</span></div>
      <div class="recap__total"><span>${t('total')}</span><b>${money(last.total)}</b></div>`;
    $('#confirmModal').showModal();
    cart = []; saveCart(); renderCart(); $('#checkoutForm').reset();
  }

  function handleReturn() {
    const p = new URLSearchParams(location.search);
    const status = p.get('order');
    if (!status) return;
    history.replaceState(null, '', location.pathname + location.hash);
    if (status === 'success') showConfirmation(false);
    else if (status === 'cancel') {
      $('#cfTitle').textContent = t('cancelTitle');
      $('#cfText').textContent = t('cancelText');
      $('#cfRecap').innerHTML = '';
      $('#cfDemo').hidden = true;
      $('#confirmModal').showModal();
    }
  }

  /* ---------- UI bits ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  $$('.lang button').forEach((b) => b.addEventListener('click', () => {
    lang = b.dataset.lang; store.set('ss_lang', lang); applyLang();
  }));

  const burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#nav a').forEach((a) => a.addEventListener('click', () => {
    document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false');
  }));

  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const lb = $('#lightbox');
  $('#galleryGrid').addEventListener('click', (e) => {
    const g = e.target.closest('[data-src]');
    if (!g) return;
    $('#lightboxImg').src = g.dataset.src;
    $('#lightboxImg').alt = $('img', g).alt;
    lb.showModal();
  });
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.tagName === 'IMG') lb.close(); });

  /* ---------- Animations ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Count-up numbers
  function countUp(el) {
    const target = Number(el.dataset.count);
    const dec = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const fmt = (n) => n.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
    if (reduceMotion) { el.textContent = fmt(target); return; }
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / 1400);
      el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Reveal-on-scroll (+ staggered children)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('[data-count]', en.target).forEach(countUp);
      io.unobserve(en.target);
    }), { threshold: 0.15 });
    $$('.hl, .stat, .section__head, .builder, .about__media, .about__text, .g, .icard, .reviews__inner, .panel__head').forEach((el, i) => {
      el.classList.add('reveal');
      if (el.matches('.hl, .stat, .g, .icard')) el.style.setProperty('--d', (i % 4) * 90 + 'ms');
      io.observe(el);
    });
  } else {
    $$('[data-count]').forEach(countUp);
  }

  // Rising embers in the hero
  if (!reduceMotion) {
    const embers = $('#embers');
    for (let i = 0; i < 22; i++) {
      const e = document.createElement('span');
      e.style.left = Math.random() * 100 + '%';
      e.style.setProperty('--s', (2 + Math.random() * 4).toFixed(1) + 'px');
      e.style.setProperty('--dur', (6 + Math.random() * 8).toFixed(1) + 's');
      e.style.setProperty('--delay', (-Math.random() * 12).toFixed(1) + 's');
      e.style.setProperty('--drift', (Math.random() * 80 - 40).toFixed(0) + 'px');
      embers.appendChild(e);
    }
  }

  // Hero parallax + card tilt
  const heroBg = $('.hero__bg');
  const heroCard = $('#heroCard');
  if (!reduceMotion) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900);
        heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
        ticking = false;
      });
    }, { passive: true });
    if (window.matchMedia('(hover: hover)').matches) {
      const vis = $('.hero__visual');
      vis.addEventListener('pointermove', (e) => {
        const r = vis.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        heroCard.style.setProperty('--rx', (-py * 10).toFixed(2) + 'deg');
        heroCard.style.setProperty('--ry', (px * 12).toFixed(2) + 'deg');
      });
      vis.addEventListener('pointerleave', () => { heroCard.style.setProperty('--rx', '0deg'); heroCard.style.setProperty('--ry', '0deg'); });
    }
  }

  // Intro screen
  const loader = $('#loader');
  const hideLoader = () => { document.body.classList.add('ready'); setTimeout(() => loader.remove(), 900); };
  if (document.readyState === 'complete') setTimeout(hideLoader, 900);
  else window.addEventListener('load', () => setTimeout(hideLoader, 700));
  setTimeout(hideLoader, 2600); // never block the page

  applyConfig();
  applyLang();
  handleReturn();
  setInterval(() => { fillPickup(); updateOpenStatus(); }, 60000);
})();
