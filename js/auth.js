/* ===================================================================
   auth.js — Authentication (Login / Register / Logout / Profile)
   =================================================================== */

let currentUser = null;

function toggleAuth(mode) {
    document.getElementById('loginForm').style.display    = mode==='login' ? 'block':'none';
    document.getElementById('registerForm').style.display = mode==='register' ? 'block':'none';
}

function register() {
    const name  = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const emailC= document.getElementById('regEmailConfirm').value.trim();
    const pw    = document.getElementById('regPassword').value;
    const pwC   = document.getElementById('regPasswordConfirm').value;

    if (!name||!email||!pw) return alert('Preencha todos os campos!');
    if (email!==emailC)     return alert('Os e-mails não coincidem!');
    if (pw!==pwC)           return alert('As senhas não coincidem!');
    if (pw.length<6)        return alert('Senha deve ter no mínimo 6 caracteres!');

    const users = JSON.parse(localStorage.getItem(SK.USERS)||'[]');
    if (users.find(u=>u.email===email)) return alert('E-mail já cadastrado!');

    const u = {id:Date.now().toString(), name, email, password:pw, createdAt:new Date().toISOString()};
    users.push(u);
    localStorage.setItem(SK.USERS, JSON.stringify(users));
    alert('Cadastro realizado! Faça login.');
    toggleAuth('login');
}

function login() {
    const email = document.getElementById('loginEmail').value.trim();
    const pw    = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem(SK.USERS)||'[]');
    const u     = users.find(u=>u.email===email&&u.password===pw);
    if (!u) return alert('E-mail ou senha inválidos!');
    currentUser = u;
    localStorage.setItem(SK.USER, JSON.stringify(u));
    showDashboard();
}

function logout() {
    currentUser = null;
    localStorage.removeItem(SK.USER);
    document.getElementById('mainScreen').classList.remove('active');
    document.getElementById('authScreen').classList.add('active');
}

function saveProfile() {
    const n = document.getElementById('editName').value.trim();
    if (!n) return alert('Nome não pode ficar vazio!');
    currentUser.name = n;
    localStorage.setItem(SK.USER, JSON.stringify(currentUser));
    const users = JSON.parse(localStorage.getItem(SK.USERS)||'[]');
    const i = users.findIndex(u=>u.id===currentUser.id);
    if (i!==-1){users[i]=currentUser;localStorage.setItem(SK.USERS,JSON.stringify(users));}
    document.getElementById('userName').textContent = n.split(' ')[0];
    closeModal('editProfileModal');
    alert('Perfil atualizado!');
}
