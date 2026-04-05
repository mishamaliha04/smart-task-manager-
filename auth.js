const USERS_KEY = "smartTaskManager.users.v2";
const SESSION_KEY = "smartTaskManager.session.v2";

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (hasSession() && (loginForm || registerForm)) {
  window.location.href = "index.html";
}

if (registerForm) {
  registerForm.addEventListener("submit", onRegister);
}

if (loginForm) {
  loginForm.addEventListener("submit", onLogin);
}

function onRegister(event) {
  event.preventDefault();

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    setFeedback("registerFeedback", "Please fill all fields.", true);
    return;
  }

  const users = loadUsers();
  if (users.some((user) => user.email === email)) {
    setFeedback("registerFeedback", "Email already exists.", true);
    return;
  }

  users.push({
    id: crypto.randomUUID(),
    name,
    email,
    password,
    createdAt: Date.now()
  });

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  window.location.href = "login.html";
}

function onLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const users = loadUsers();
  const found = users.find((user) => user.email === email && user.password === password);

  if (!found) {
    setFeedback("loginFeedback", "Invalid email or password.", true);
    return;
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: found.email,
      name: found.name,
      loginAt: Date.now()
    })
  );

  window.location.href = "index.html";
}

function loadUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function hasSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return false;
  }

  try {
    const parsed = JSON.parse(raw);
    return Boolean(parsed && parsed.email && parsed.name);
  } catch {
    return false;
  }
}

function setFeedback(id, text, isError) {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }

  el.classList.remove("hidden");
  el.classList.toggle("error", isError);
  el.classList.toggle("success", !isError);
  el.textContent = text;
}
