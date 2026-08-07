/* ===================================================================
   auth.js — Authentication Module
   Login, Register, Logout — uses localStorage for user persistence
   =================================================================== */

let currentUser = null;

/**
 * Toggle between login and register forms.
 */
function toggleAuth(mode) {
    document.getElementById('loginForm').style.display    = mode === 'login'    ? 'block' : 'none';
    document.getElementById('registerForm').style.display = mode === 'register' ? 'block' : 'none';
}

/**
 * Register a new user account.
 * Validates all fields, checks for duplicates, saves to localStorage.
 */
function register() {
    const name   = document.getElementById('regName').value.trim();
    const email  = document.getElementById('regEmail').value.trim();
    const emailC = document.getElementById('regEmailConfirm').value.trim();
    const pw     = document.getElementById('regPassword').value;
    const pwC    = document.getElementById('regPasswordConfirm').value;

    if (!name || !email || !pw) return alert('Preencha todos os campos!');
    if (email !== emailC)       return alert('Os e-mails não coincidem!');
    if (pw !== pwC)             return alert('As senhas não coincidem!');
    if (pw.length < 6)          return alert('A senha deve ter pelo menos 6 caracteres!');

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (users.find(u => u.email === email)) return alert('E-mail já cadastrado!');

    const user = {
        id: Date.now().toString(),
        name,
        email,
        password: pw,
        createdAt: new Date().toISOString()
    };

    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    alert('Cadastro realizado! Faça login.');
    toggleAuth('login');
}

/**
 * Authenticate user with email + password.
 * On success, saves session and shows dashboard.
 */
function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const pw    = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const user  = users.find(u => u.email === email && u.password === pw);

    if (!user) return alert('E-mail ou senha inválidos!');

    currentUser = user;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    showDashboard(); // defined in app.js
}

/**
 * Log out current user, clear session, show auth screen.
 */
function logout() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.USER);
    document.getElementById('mainScreen').classList.remove('active');
    document.getElementById('authScreen').classList.add('active');
}

/**
 * Save edited profile data.
 */
function saveProfile() {
    const newName = document.getElementById('editName').value.trim();
    if (!newName) return alert('Nome não pode ficar vazio!');

    currentUser.name = newName;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));

    // Update in users list too
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
        users[idx] = currentUser;
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    document.getElementById('userName').textContent = newName.split(' ')[0];
    closeModal('editProfileModal');
    alert('Perfil atualizado!');
}
