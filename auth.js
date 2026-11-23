const AUTH_KEY = 'milano_auth';
const PLAN_KEY = 'milano_plan';
const USERS_KEY = 'milano_users';
const USED_KEYS_KEY = 'milano_used_keys';
const ADMIN_LOGIN = '123';
const ADMIN_PASSWORD = '123';
function getUser() { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch (e) { return null; } }
function isLoggedIn() { return !!getUser(); }
function getUsers() { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; } }
function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
function updateAuthButtons() {
  const user = getUser();
  const navBtn = document.getElementById('navAuthBtn');
  if (navBtn) { navBtn.textContent = user ? 'Аккаунт' : 'Войти'; navBtn.setAttribute('href', user ? 'account.html' : 'login.html'); }
  const mobileCta = document.getElementById('mobileCta');
  if (mobileCta) { mobileCta.textContent = user ? 'Аккаунт' : 'Войти'; mobileCta.setAttribute('href', user ? 'account.html' : 'login.html'); }
}
document.addEventListener('DOMContentLoaded', function () {
  updateAuthButtons();
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const title = document.getElementById('authTitle');
  const lead = document.getElementById('authLead');
  const prefix = document.getElementById('authSwitchPrefix');
  const switchBtn = document.getElementById('authSwitchBtn');
  let currentMode = 'login';
  function showTab(mode) {
    currentMode = mode;
    const isRegister = mode === 'register';
    document.querySelectorAll('.auth-tab-btn').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-auth-tab') === mode); });
    if (loginForm) loginForm.hidden = isRegister;
    if (registerForm) registerForm.hidden = !isRegister;
    if (title) title.textContent = isRegister ? 'Регистрация' : 'Вход в аккаунт';
    if (lead) lead.textContent = isRegister ? 'Создай аккаунт, чтобы купить клиент и скачать лаунчер.' : 'Введи логин и пароль, чтобы скачать лаунчер и играть.';
    if (prefix) prefix.textContent = isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?';
    if (switchBtn) switchBtn.textContent = isRegister ? 'Войти' : 'Зарегистрироваться';
  }
  document.querySelectorAll('.auth-tab-btn').forEach(function (btn) { btn.addEventListener('click', function () { showTab(btn.getAttribute('data-auth-tab')); }); });
  if (switchBtn) switchBtn.addEventListener('click', function () { showTab(currentMode === 'register' ? 'login' : 'register'); });
  if (loginForm) {
    if (isLoggedIn()) { window.location.href = 'account.html'; return; }
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const login = document.getElementById('loginInput').value.trim();
      const password = document.getElementById('passwordInput').value;
      const err = document.getElementById('loginError');
      const user = getUsers().find(function (u) { return u.login === login; });
      if ((user && user.password === password) || (login === ADMIN_LOGIN && password === ADMIN_PASSWORD)) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ login: login }));
        window.location.href = 'account.html';
      } else if (err) { err.textContent = 'Неверный логин или пароль.'; }
    });
  }
  if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const login = document.getElementById('registerLoginInput').value.trim();
      const email = document.getElementById('registerEmailInput').value.trim();
      const password = document.getElementById('registerPasswordInput').value;
      const confirm = document.getElementById('registerPasswordConfirmInput').value;
      const err = document.getElementById('registerError');
      if (login.length < 3) { if (err) err.textContent = 'Логин — минимум 3 символа.'; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { if (err) err.textContent = 'Введи корректную почту.'; return; }
      if (password.length < 4) { if (err) err.textContent = 'Пароль — минимум 4 символа.'; return; }
      if (password !== confirm) { if (err) err.textContent = 'Пароли не совпадают.'; return; }
      const users = getUsers();
      if (users.some(function (u) { return u.login === login; }) || login === ADMIN_LOGIN) { if (err) err.textContent = 'Такой логин уже занят.'; return; }
      if (users.some(function (u) { return u.email === email; })) { if (err) err.textContent = 'Такая почта уже зарегистрирована.'; return; }
      users.push({ login: login, email: email, password: password });
      saveUsers(users);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ login: login }));
      window.location.href = 'account.html';
    });
  }
  const loginEl = document.getElementById('accountLogin');
  if (loginEl) {
    const user = getUser();
    if (!user) { window.location.href = 'login.html'; return; }
    loginEl.textContent = user.login;
    const planEl = document.getElementById('accountPlan');
    if (planEl) planEl.textContent = localStorage.getItem(PLAN_KEY) || 'Не выбран';
  }
  const keyForm = document.getElementById('keyForm');
  const keyInput = document.getElementById('keyInput');
  const keyMessage = document.getElementById('keyMessage');
  const keyHistory = document.getElementById('keyHistory');
  const keyHistoryWrap = document.getElementById('keyHistoryWrap');
  function getUsedKeys() { try { return JSON.parse(localStorage.getItem(USED_KEYS_KEY)) || []; } catch (e) { return []; } }
  function renderKeys() { if (!keyHistory || !keyHistoryWrap) return; const used = getUsedKeys(); keyHistoryWrap.hidden = used.length === 0; keyHistory.innerHTML = ''; used.forEach(function (k) { const li = document.createElement('li'); li.textContent = k.key + ' — ' + k.plan + ' · ' + k.date; keyHistory.appendChild(li); }); }
  function planForKey(key) { if (/^MILANO-MONTH-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)) return 'Месяц — 299 ₽'; if (/^MILANO-3MON-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)) return '3 месяца — 799 ₽'; if (/^MILANO-LIFE-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)) return 'Навсегда — 1199 ₽'; return null; }
  renderKeys();
  if (keyForm) { keyForm.addEventListener('submit', function (e) { e.preventDefault(); const raw = keyInput.value.trim().toUpperCase(); const plan = planForKey(raw); if (!plan) { if (keyMessage) { keyMessage.textContent = 'Неверный ключ. Пример: MILANO-MONTH-AB12-CD34'; keyMessage.style.color = '#ff9a9a'; } return; } const used = getUsedKeys(); if (used.some(function (k) { return k.key === raw; })) { if (keyMessage) { keyMessage.textContent = 'Этот ключ уже активирован.'; keyMessage.style.color = '#ff9a9a'; } return; } used.push({ key: raw, plan: plan, date: new Date().toLocaleDateString('ru-RU') }); localStorage.setItem(USED_KEYS_KEY, JSON.stringify(used)); localStorage.setItem(PLAN_KEY, plan); const planEl = document.getElementById('accountPlan'); if (planEl) planEl.textContent = plan; const desc = document.getElementById('accountPlanDesc'); if (desc) desc.textContent = plan.indexOf('Месяц') === 0 ? 'Доступ на 30 дней — все функции клиента и лаунчер.' : plan.indexOf('3 месяца') === 0 ? 'Доступ на 90 дней — все функции клиента и лаунчер.' : 'Доступ навсегда — все функции клиента и лаунчер.'; if (keyMessage) { keyMessage.textContent = 'Ключ активирован: ' + plan; keyMessage.style.color = '#fff'; } if (keyInput) keyInput.value = ''; renderKeys(); }); }
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', function () { localStorage.removeItem(AUTH_KEY); window.location.href = 'index.html'; });
  document.querySelectorAll('.plan-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      localStorage.setItem(PLAN_KEY, btn.getAttribute('data-plan'));
      window.location.href = isLoggedIn() ? 'account.html' : 'login.html';
    });
  });
});
