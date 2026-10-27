// Données utilisateurs par défaut
const defaultUsers = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', nom: 'Administrateur', prenom: 'Système' },
    { id: 2, username: 'manager', password: 'manager123', role: 'manager', nom: 'Manager', prenom: 'Boutique' },
    { id: 3, username: 'livreur', password: 'livreur123', role: 'livreur', nom: 'Livreur', prenom: 'Rapide' }
];

// Initialiser les données dans localStorage si elles n'existent pas
function initData() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
    if (!localStorage.getItem('articles')) {
        localStorage.setItem('articles', JSON.stringify([]));
    }
    if (!localStorage.getItem('clients')) {
        localStorage.setItem('clients', JSON.stringify([]));
    }
    if (!localStorage.getItem('ventes')) {
        localStorage.setItem('ventes', JSON.stringify([]));
    }
    if (!localStorage.getItem('depenses')) {
        localStorage.setItem('depenses', JSON.stringify([]));
    }
    if (!localStorage.getItem('nextId')) {
        localStorage.setItem('nextId', JSON.stringify({
            users: 4,
            articles: 1,
            clients: 1,
            ventes: 1,
            depenses: 1
        }));
    }
}

// Vérifier la connexion
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser && !window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        window.location.href = 'index.html';
    }
    return currentUser;
}

// Obtenir l'utilisateur actuel
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Gérer le formulaire de connexion
document.addEventListener('DOMContentLoaded', function() {
    initData();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');
            
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                errorDiv.textContent = 'Nom d\'utilisateur ou mot de passe incorrect';
            }
        });
    }
    
    // Vérifier l'authentification sur les pages protégées
    if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') {
        checkAuth();
    }
});

// Déconnexion
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
