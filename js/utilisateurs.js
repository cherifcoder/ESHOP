function loadUsersPage() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    // Vérifier si l'utilisateur est admin
    if (currentUser.role !== 'admin') {
        alert('Accès non autorisé');
        window.location.href = 'dashboard.html';
        return;
    }
    
    document.getElementById('userName').textContent = currentUser.prenom + ' ' + currentUser.nom + ' (' + currentUser.role + ')';
    
    loadUsers();
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.getElementById('usersTable');
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Aucun utilisateur enregistré</td></tr>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.nom}</td>
            <td>${user.prenom}</td>
            <td>${getRoleLabel(user.role)}</td>
            <td class="actions">
                <button class="btn-warning" onclick="editUser(${user.id})" title="Modifier">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger" onclick="deleteUser(${user.id})" title="Supprimer" ${user.username === 'admin' ? 'disabled' : ''}>
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function getRoleLabel(role) {
    switch(role) {
        case 'admin': return 'Administrateur';
        case 'manager': return 'Manager';
        case 'livreur': return 'Livreur';
        default: return role;
    }
}

function openUserModal(user = null) {
    document.getElementById('userModal').classList.add('active');
    if (user) {
        document.getElementById('modalTitleUser').textContent = 'Modifier un Utilisateur';
        document.getElementById('userId').value = user.id;
        document.getElementById('userUsername').value = user.username;
        document.getElementById('userNom').value = user.nom;
        document.getElementById('userPrenom').value = user.prenom;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userPassword').value = user.password;
    } else {
        document.getElementById('modalTitleUser').textContent = 'Ajouter un Utilisateur';
        document.getElementById('userId').value = '';
        document.getElementById('userUsername').value = '';
        document.getElementById('userNom').value = '';
        document.getElementById('userPrenom').value = '';
        document.getElementById('userRole').value = '';
        document.getElementById('userPassword').value = '';
    }
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
}

function saveUser() {
    const id = document.getElementById('userId').value;
    const username = document.getElementById('userUsername').value;
    const nom = document.getElementById('userNom').value;
    const prenom = document.getElementById('userPrenom').value;
    const role = document.getElementById('userRole').value;
    const password = document.getElementById('userPassword').value;
    
    if (!username || !nom || !prenom || !role || !password) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const nextIdData = JSON.parse(localStorage.getItem('nextId'));
    
    // Vérifier si le nom d'utilisateur existe déjà
    const existingUser = users.find(u => u.username === username && u.id != id);
    if (existingUser) {
        alert('Ce nom d\'utilisateur existe déjà');
        return;
    }
    
    if (id) {
        const index = users.findIndex(u => u.id == id);
        if (index !== -1) {
            users[index] = {
                ...users[index],
                username,
                nom,
                prenom,
                role,
                password
            };
        }
    } else {
        const newUser = {
            id: nextIdData.users,
            username,
            nom,
            prenom,
            role,
            password
        };
        users.push(newUser);
        nextIdData.users++;
        localStorage.setItem('nextId', JSON.stringify(nextIdData));
    }
    
    localStorage.setItem('users', JSON.stringify(users));
    closeUserModal();
    loadUsers();
}

function editUser(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id == id);
    if (user) {
        openUserModal(user);
    }
}

function deleteUser(id) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id == id);
    if (user && user.username === 'admin') {
        alert('Impossible de supprimer l\'administrateur principal');
        return;
    }
    
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        let usersList = JSON.parse(localStorage.getItem('users')) || [];
        usersList = usersList.filter(u => u.id != id);
        localStorage.setItem('users', JSON.stringify(usersList));
        loadUsers();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadUsersPage();
});
