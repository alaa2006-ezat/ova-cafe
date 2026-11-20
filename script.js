// 1) فلتر الأقسام (الكل / مشروبات / Desserts)
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.card[data-cat]');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const f = tab.dataset.filter;
    cards.forEach(c => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('hide', !show);
      if (show) {
        c.classList.add('show');
        c.classList.remove('pop'); void c.offsetWidth; c.classList.add('pop');
      }
    });
  });
});

// 2) ظهور العناصر مع السكرول
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 3) سويتش الوضع الليلي
const root = document.documentElement;
const sw = document.getElementById('themeSwitch');
function applyTheme(t) {
  root.setAttribute('data-theme', t);
  sw.setAttribute('aria-checked', t === 'dark');
}
let saved = null;
try { saved = localStorage.getItem('ova-theme'); } catch (e) {}
applyTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
sw.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try { localStorage.setItem('ova-theme', next); } catch (e) {}
});

// 4) تفاعل اللوجو: لفّة + فراولة طايرة
const logo = document.getElementById('heroLogo');
function berries(x, y) {
  for (let i = 0; i < 10; i++) {
    const b = document.createElement('span');
    b.className = 'berry';
    b.textContent = '🍓';
    b.style.left = x + 'px';
    b.style.top = y + 'px';
    b.style.setProperty('--dx', (Math.random() * 240 - 120) + 'px');
    b.style.setProperty('--r', (Math.random() * 360 - 180) + 'deg');
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 1500);
  }
}
logo.addEventListener('click', e => {
  logo.classList.add('spin');
  setTimeout(() => logo.classList.remove('spin'), 600);
  berries(e.clientX, e.clientY);
});

// 5) زرار لفوق + تمييز القسم الحالي
const toTop = document.getElementById('toTop');
const links = [...document.querySelectorAll('nav ul a')].filter(a => a.getAttribute('href').startsWith('#'));
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
addEventListener('scroll', () => {
  toTop.classList.toggle('visible', scrollY > 400);
  let cur = -1;
  sections.forEach((s, i) => { if (s && s.getBoundingClientRect().top < 120) cur = i; });
  links.forEach((a, i) => a.classList.toggle('current', i === cur));
});
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
const toBottom = document.getElementById('toBottom');
function toggleToBottom() {
  const maxScroll = document.documentElement.scrollHeight - innerHeight;
  toBottom.classList.toggle('visible', maxScroll > 400 && scrollY < maxScroll - 250);
}
addEventListener('scroll', toggleToBottom);
toggleToBottom();
toBottom.addEventListener('click', () => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }));

// 6) معاينة تفاصيل وصورة المشروب عند الضغط على الصورة
const prodModal = document.getElementById('prodModal');
const modalImg = document.getElementById('modalProdImg');
const modalTitle = document.getElementById('modalProdTitle');
const modalDesc = document.getElementById('modalProdDesc');
const modalOrder = document.getElementById('modalOrderBtn');

document.querySelectorAll('.prod-img-wrap').forEach(wrap => {
  wrap.addEventListener('click', () => {
    const title = wrap.dataset.title;
    modalImg.src = wrap.dataset.img;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalDesc.textContent = wrap.dataset.desc;
    modalOrder.href = `https://wa.me/201500504366?text=${encodeURIComponent('أهلاً اوفا، حابب أطلب: ' + title)}`;
    prodModal.hidden = false;
  });
});

document.getElementById('closeProdModal').addEventListener('click', () => { prodModal.hidden = true; });
prodModal.addEventListener('click', e => { if (e.target === prodModal) prodModal.hidden = true; });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !prodModal.hidden) prodModal.hidden = true; });

// 7) الفروع: فتح/قفل + نسخ العنوان
const branchEls = document.querySelectorAll('.branch');
branchEls.forEach(b => {
  const head = b.querySelector('.branch-head');
  head.addEventListener('click', () => {
    const willOpen = !b.classList.contains('open');
    branchEls.forEach(o => {
      o.classList.remove('open');
      o.querySelector('.branch-head').setAttribute('aria-expanded', 'false');
    });
    if (willOpen) {
      b.classList.add('open');
      head.setAttribute('aria-expanded', 'true');
    }
  });
});
document.querySelectorAll('.soc.copy').forEach(btn => {
  btn.addEventListener('click', async () => {
    const label = btn.querySelector('span');
    const old = label.textContent;
    try {
      await navigator.clipboard.writeText(btn.dataset.address);
      label.textContent = 'تم النسخ ✓';
      btn.classList.add('done');
    } catch (e) {
      label.textContent = 'انسخه يدوي';
    }
    setTimeout(() => { label.textContent = old; btn.classList.remove('done'); }, 1800);
  });
});