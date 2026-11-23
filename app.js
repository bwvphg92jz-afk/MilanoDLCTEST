const scrollProgress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');
const navEl = document.getElementById('nav');
const navSectionLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = Array.prototype.map.call(navSectionLinks, function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
function onScroll() { const st = window.scrollY; const h = document.documentElement.scrollHeight - window.innerHeight; if (scrollProgress) scrollProgress.style.width = (h > 0 ? (st / h) * 100 : 0) + '%'; if (backTop) backTop.classList.toggle('show', st > 600); if (navEl) navEl.classList.toggle('scrolled', st > 24); let current = null; sections.forEach(function (s) { if (s.getBoundingClientRect().top <= 140) current = s; }); navSectionLinks.forEach(function (a) { a.classList.toggle('active', current && a.getAttribute('href') === '#' + current.id); }); const mobileCta = document.getElementById('mobileCta'); if (mobileCta) mobileCta.classList.toggle('show', st > 700); }
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
if (backTop) backTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
const burger = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');
if (burger && navLinks) { burger.addEventListener('click', function () { const open = burger.classList.toggle('open'); navLinks.classList.toggle('open', open); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); }); navLinks.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { burger.classList.remove('open'); navLinks.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }); }); }
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && burger && navLinks && navLinks.classList.contains('open')) { burger.classList.remove('open'); navLinks.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); burger.focus(); } });
document.addEventListener('click', function (e) { if (burger && navLinks && navLinks.classList.contains('open') && !e.target.closest('.nav-inner')) { burger.classList.remove('open'); navLinks.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
window.addEventListener('resize', function () { document.querySelectorAll('.faq-item.open .faq-a').forEach(function (a) { a.style.maxHeight = a.scrollHeight + 'px'; }); });
const revealObserver = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } }); }, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });
document.querySelectorAll('.faq-item').forEach(function (item) { const q = item.querySelector('.faq-q'); const a = item.querySelector('.faq-a'); q.addEventListener('click', function () { const open = item.classList.contains('open'); document.querySelectorAll('.faq-item.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.faq-a').style.maxHeight = '0px'; o.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); }); if (!open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; q.setAttribute('aria-expanded', 'true'); } }); });
const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(msg) { if (!toast) return; toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 1600); }
document.querySelectorAll('[data-tabs]').forEach(function (tabs) { var btns = tabs.querySelectorAll('.tab-btn'); var panels = tabs.querySelectorAll('.tab-panel'); btns.forEach(function (btn, i) { btn.addEventListener('click', function () { btns.forEach(function (b) { b.classList.remove('active'); }); panels.forEach(function (p) { p.classList.remove('active'); }); btn.classList.add('active'); if (panels[i]) panels[i].classList.add('active'); }); }); });
document.querySelectorAll('.tabs, .voices, .start-flow, .pricing-grid, .info-list, .def-list, .steps-list').forEach(function (g) { Array.prototype.forEach.call(g.querySelectorAll('.reveal'), function (el, i) { el.style.transitionDelay = (i * 60) + 'ms'; }); });
