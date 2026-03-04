// 1. Cek apakah user sudah login
const userData = JSON.parse(localStorage.getItem('userSimAsbar'));

if (!userData) {
    window.location.href = "../index.html";
}

// 2. Mapping Menu Berdasarkan Level
// Level: Admin Utama (Lv1), Admin Lembaga (Lv2), Admin Alumni (Lv3)
const menuConfig = [
    { name: "Dashboard", icon: "layout-dashboard", path: "dashboard.html", access: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
    { name: "Dokumen", icon: "folder-closed", path: "dokumen.html", access: ["Admin Utama"] },
    { name: "Persuratan", icon: "mail", path: "surat.html", access: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
    { name: "Keuangan", icon: "wallet", path: "keuangan.html", access: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
    { name: "Data Santri", icon: "users", path: "santri.html", access: ["Admin Utama", "Admin Lembaga"] },
    { name: "Data Pegawai", icon: "contact-2", path: "pegawai.html", access: ["Admin Utama", "Admin Lembaga"] },
    { name: "Data Alumni", icon: "graduation-cap", path: "alumni.html", access: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
    { name: "Galeri", icon: "image", path: "galeri.html", access: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
];

// 3. Render Menu ke Sidebar
function renderMenu() {
    const sidebar = document.getElementById('sidebarMenu');
    let menuHTML = "";

    menuConfig.forEach(item => {
        if (item.access.includes(userData.level)) {
            menuHTML += `
                <a href="${item.path}" class="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition group">
                    <i data-lucide="${item.icon}" class="w-5 h-5 text-slate-400 group-hover:text-blue-400"></i>
                    <span class="text-sm font-medium">${item.name}</span>
                </a>
            `;
        }
    });
    sidebar.innerHTML = menuHTML;
    lucide.createIcons(); // Render ulang icon
}

// 4. Update UI Profile & Informasi
function updateUI() {
    document.getElementById('userName').innerText = userData.nama;
    document.getElementById('welcomeName').innerText = userData.nama;
    document.getElementById('userLevel').innerText = userData.level;
    document.getElementById('welcomeLevel').innerText = userData.level;
    document.getElementById('labelLembaga').innerText = userData.lembaga;
    document.getElementById('userInitial').innerText = userData.nama.charAt(0).toUpperCase();
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function logout() {
    localStorage.removeItem('userSimAsbar');
    window.location.href = "../index.html";
}

// Jalankan saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    renderMenu();
});
