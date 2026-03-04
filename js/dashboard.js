// Struktur Menu Baru
const menuData = [
    { id: "DOKUMEN", title: "Dokumen", icon: "fa-folder-open", level: ["Admin Utama", "Admin Lembaga"] },
    { id: "SURAT", title: "Persuratan", icon: "fa-envelope-open-text", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
    { id: "KEUANGAN", title: "Keuangan", icon: "fa-wallet", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
    { id: "LEMBAGA", title: "Lembaga", icon: "fa-university", level: ["Admin Utama"] },
    { id: "PEGAWAI", title: "Data Pegawai", icon: "fa-id-card", level: ["Admin Utama", "Admin Lembaga"] },
    { id: "SANTRI", title: "Data Santri", icon: "fa-user-graduate", level: ["Admin Utama", "Admin Lembaga", "User"] },
    { id: "ALUMNI", title: "Data Alumni", icon: "fa-users-cog", level: ["Admin Utama", "Admin Alumni", "User"] },
    { id: "GALERI", title: "Galeri", icon: "fa-images", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni", "User"] }
];

function initDashboard() {
    const userData = JSON.parse(localStorage.getItem("user_simasbar"));
    if (!userData) { window.location.href = "../index.html"; return; }

    document.getElementById("userName").innerText = userData.nama;
    document.getElementById("userLevel").innerText = userData.level;
    
    renderMenu(userData);
}

function renderMenu(user) {
    const grid = document.getElementById("dashboardGrid");
    const side = document.getElementById("mainMenu");
    
    menuData.forEach(menu => {
        if (menu.level.includes(user.level)) {
            // Logika Penentuan Path: Persuratan & Keuangan dilempar ke file yang sama
            // tapi dikirimkan parameter 'type'
            let targetPath = `modul.html?modul=${menu.id}`;
            
            // Render Grid
            grid.innerHTML += `
                <div class="col-md-3">
                    <div class="card card-menu h-100 shadow-sm" onclick="location.href='${targetPath}'">
                        <i class="fa ${menu.icon} fa-2x mb-2"></i>
                        <h6 class="fw-bold" style="font-size: 0.9rem;">${menu.title}</h6>
                    </div>
                </div>`;
            
            // Render Sidebar
            side.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link" href="${targetPath}">
                        <i class="fa ${menu.icon} me-2"></i> ${menu.title}
                    </a>
                </li>`;
        }
    });
}
