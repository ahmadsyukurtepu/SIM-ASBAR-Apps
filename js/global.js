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

// Fungsi Navigasi Direct untuk Operator (Auto-Detect Lembaga)
function loadPageDirect(type, element) {
    const user = JSON.parse(localStorage.getItem('userSimAsbar'));
    const lembaga = user.lembaga.toLowerCase(); // tpa, mda, atau alumni
    
    // Contoh: Jika type='surat' dan lembaga='tpa', akan load 'surat-tpa'
    const pageTarget = `${type}-${lembaga}`;
    const titleTarget = `${type.toUpperCase()} ${user.lembaga}`;
    
    loadPage(pageTarget, titleTarget, element);
}

// Update filterMenu agar lebih akurat
function filterMenuByRole(userRole, userLembaga) {
    const allProtected = document.querySelectorAll('[data-level]');
    
    allProtected.forEach(el => {
        const levels = el.getAttribute('data-level').split(',');
        const targetLembaga = el.getAttribute('data-lembaga');

        let isLevelMatch = levels.includes(userRole);
        let isLembagaMatch = true;

        if (targetLembaga) {
            const allowedLembaga = targetLembaga.split(',');
            // Admin Yayasan tembus semua filter lembaga
            if (userRole === "ADMIN" && userLembaga === "YAYASAN") {
                isLembagaMatch = true;
            } else {
                isLembagaMatch = allowedLembaga.includes(userLembaga);
            }
        }

        if (isLevelMatch && isLembagaMatch) {
            el.classList.remove('hidden');
            // Jika element ini adalah div, jangan pakai flex agar tidak berantakan
            if(el.tagName === 'DIV') el.style.display = 'block'; 
        } else {
            el.classList.add('hidden');
            el.style.display = 'none';
        }
    });
}

// Jangan lupa update fungsi startApp agar mengirim dua parameter
function startApp(userData) {
    document.getElementById('loginOverlay').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    
    document.getElementById('adminName').innerText = userData.nama;
    document.getElementById('adminLevelDisplay').innerText = userData.role;

    // Filter Menu berdasarkan Role dan Lembaga
    filterMenuByRole(userData.role, userData.lembaga);

    loadPage('dashboard', 'Dashboard');
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

/**
 * Fungsi Toggle Submenu (Accordion Style)
 * Menutup menu lain saat satu menu dibuka
 */
function toggleSubMenu(id) {
    const targetMenu = document.getElementById(id);
    const allSubMenus = document.querySelectorAll('.menu-group div[id^="sub-"]');
    const allChevrons = document.querySelectorAll('.menu-group i.fa-chevron-down');

    // 1. Cek apakah menu yang diklik saat ini sudah terbuka atau belum
    const isAlreadyOpen = !targetMenu.classList.contains('hidden');

    // 2. Tutup SEMUA submenu yang ada dan reset rotasi ikon chevron
    allSubMenus.forEach(menu => {
        menu.classList.add('hidden');
    });
    
    allChevrons.forEach(chevron => {
        chevron.style.transform = "rotate(0deg)";
    });

    // 3. Jika menu yang diklik sebelumnya tertutup, maka sekarang buka
    if (!isAlreadyOpen) {
        targetMenu.classList.remove('hidden');
        
        // Putar ikon chevron pada tombol yang diklik (opsional agar lebih cantik)
        const btnChevron = targetMenu.parentElement.querySelector('.fa-chevron-down');
        if (btnChevron) {
            btnChevron.style.transform = "rotate(180deg)";
            btnChevron.style.transition = "transform 0.3s ease";
        }
    }
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