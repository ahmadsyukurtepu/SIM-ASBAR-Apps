/**
 * GLOBAL.JS - SIM-ASBAR
 * Logika Navigasi, Hak Akses, dan Sesi
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cek Sesi Login
    const savedUser = localStorage.getItem('userSimAsbar');
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        startApp(userData);
    }

    // 2. Klik di luar profil untuk menutup dropdown
    window.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
            document.getElementById('profileMenu').classList.add('hidden');
        }
    });
});

// --- FUNGSI LOGIN ---
async function handleLogin() {
    const userIn = document.getElementById('loginID').value;
    const pinIn = document.getElementById('loginPIN').value;
    const btn = document.getElementById('btnLogin');

    if (!userIn || !pinIn) {
        alert("Masukkan User ID dan PIN!");
        return;
    }

    try {
        btn.innerText = "MENGOTENTIKASI...";
        btn.disabled = true;

        // Memanggil fungsi dari api.js (pastikan fetchData sudah ada di api.js)
        const users = await fetchData('DAFTAR_USER'); 

        if (users) {
            const userFound = users.find(u => u.username === userIn && u.password === pinIn);

            if (userFound) {
                localStorage.setItem('userSimAsbar', JSON.stringify(userFound));
                startApp(userFound);
            } else {
                alert("User ID atau PIN salah!");
            }
        }
    } catch (err) {
        console.error(err);
        alert("Gagal terhubung ke database.");
    } finally {
        btn.innerText = "MASUK";
        btn.disabled = false;
    }
}

// --- JALANKAN APLIKASI ---
function startApp(userData) {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('sidebar').classList.remove('hidden');
    document.getElementById('sidebar').classList.add('flex');

    // Update Identitas
    document.getElementById('adminName').innerText = userData.nama;
    document.getElementById('displayUsername').innerText = "@" + userData.username;
    document.getElementById('adminLevelDisplay').innerText = userData.role; // Lv1, Lv2, dst

    // Filter Menu & Submenu berdasarkan Role
    filterMenuByRole(userData.role);

    // Load Dashboard Pertama Kali
    loadPage('dashboard', 'Dashboard');
}

// --- FILTER HAK AKSES ---
function filterMenuByRole(role) {
    const allProtectedElements = document.querySelectorAll('[data-level]');
    
    allProtectedElements.forEach(el => {
        const allowedLevels = el.getAttribute('data-level').split(',');
        if (allowedLevels.includes(role)) {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });
}

// --- NAVIGASI SPA ---
function loadPage(pageName, title, element = null) {
    const contentArea = document.getElementById('contentArea');
    const titleDisplay = document.getElementById('currentMenuTitle');

    titleDisplay.innerText = title;
    contentArea.innerHTML = `<div class="flex items-center justify-center h-64 text-green-900">
                                <i class="fas fa-circle-notch animate-spin text-3xl"></i>
                             </div>`;

    // Hilangkan highlight menu sebelumnya
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('bg-white/10', 'border-l-4', 'border-amber-400'));
    
    // Tambah highlight ke menu yang diklik
    if (element) {
        element.classList.add('bg-white/10', 'border-l-4', 'border-amber-400');
    }

    fetch(`pages/${pageName}.html`)
        .then(res => {
            if (!res.ok) throw new Error();
            return res.text();
        })
        .then(html => {
            contentArea.innerHTML = html;
            // Tutup sidebar di mobile setelah klik menu
            if (window.innerWidth < 1024) toggleSidebar();
        })
        .catch(() => {
            contentArea.innerHTML = `<div class="p-10 text-center">Halaman <b>${pageName}</b> sedang dalam pengembangan.</div>`;
        });
}

// --- FUNGSI UI ---
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
}

function toggleSubMenu(id) {
    document.getElementById(id).classList.toggle('hidden');
}

function toggleProfileMenu() {
    document.getElementById('profileMenu').classList.toggle('hidden');
}

function handleLogout() {
    if (confirm("Keluar dari aplikasi?")) {
        localStorage.removeItem('userSimAsbar');
        location.reload();
    }
}