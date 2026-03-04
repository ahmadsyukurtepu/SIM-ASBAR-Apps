// Data Menu (Simpan di sini agar tidak perlu ambil dari server tiap detik)
const APP_MENU = [
    { title: "Dashboard", icon: "fa-th-large", path: "dashboard.html" },
    { title: "Persuratan", icon: "fa-envelope", path: "surat.html" },
    { title: "Data Santri", icon: "fa-user-graduate", path: "santri.html" },
    { title: "Keuangan", icon: "fa-wallet", path: "keuangan.html" }
];

function checkAuth() {
    const user = JSON.parse(localStorage.getItem(CONFIG.USER_KEY));
    if (!user) {
        window.location.href = "../index.html";
        return null;
    }
    return user;
}

function renderSidebar() {
    const container = document.getElementById("mainMenu");
    if (!container) return;

    const currentPath = window.location.pathname;
    container.innerHTML = APP_MENU.map(menu => `
        <li class="nav-item">
            <a class="nav-link ${currentPath.includes(menu.path) ? 'active' : ''}" href="${menu.path}">
                <i class="fa ${menu.icon}"></i>
                <span>${menu.title}</span>
            </a>
        </li>
    `).join('');
}

function logout() {
    localStorage.removeItem(CONFIG.USER_KEY);
    window.location.href = "../index.html";
}

// EKSEKUSI INSTAN
const activeUser = checkAuth();
if (activeUser) {
    // Jalankan render menu tanpa menunggu window.onload agar tidak berkedip
    document.addEventListener("DOMContentLoaded", () => {
        renderSidebar();
        if (document.getElementById("userName")) document.getElementById("userName").innerText = activeUser.nama;
        if (document.getElementById("userLevel")) document.getElementById("userLevel").innerText = activeUser.level;
    });
}
