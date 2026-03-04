const menuData = [
    { id: "SURAT", title: "Persuratan", icon: "fa-envelope-open-text", path: "surat.html", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
    { id: "KEUANGAN", title: "Keuangan", icon: "fa-wallet", path: "keuangan.html", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
    { id: "DOKUMEN", title: "Dokumen", icon: "fa-folder-open", path: "dokumen.html", level: ["Admin Utama", "Admin Lembaga"] },
    { id: "LEMBAGA", title: "Lembaga", icon: "fa-university", path: "lembaga.html", level: ["Admin Utama"] },
    { id: "PEGAWAI", title: "Data Pegawai", icon: "fa-id-card", path: "pegawai.html", level: ["Admin Utama", "Admin Lembaga"] },
    { id: "SANTRI", title: "Data Santri", icon: "fa-user-graduate", path: "santri.html", level: ["Admin Utama", "Admin Lembaga", "User"] },
    { id: "ALUMNI", title: "Data Alumni", icon: "fa-users-cog", path: "alumni.html", level: ["Admin Utama", "Admin Alumni", "User"] },
    { id: "GALERI", title: "Galeri", icon: "fa-images", path: "galeri.html", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni", "User"] }
];

function initDashboard() {
    const rawData = localStorage.getItem("user_simasbar");
    const grid = document.getElementById("dashboardGrid");

    if (!rawData) {
        window.location.href = "../index.html";
        return;
    }

    const userData = JSON.parse(rawData);
    
    // Tampilkan Nama dan Level di UI
    document.getElementById("userName").innerText = userData.nama || "User";
    document.getElementById("userLevel").innerText = userData.level || "No Level";
    document.getElementById("userLembaga").innerText = userData.lembaga || "No Lembaga";

    const side = document.getElementById("mainMenu");
    grid.innerHTML = ""; 
    side.innerHTML = "";

    // Bersihkan spasi dan buat jadi huruf kecil untuk perbandingan
    const userLevelClean = userData.level ? userData.level.trim().toLowerCase() : "";

    let menuCount = 0;

    menuData.forEach(menu => {
        const isAllowed = menu.level.some(l => l.trim().toLowerCase() === userLevelClean);
        
        if (isAllowed) {
            menuCount++;
            // Render Card ke Grid
            grid.innerHTML += `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card card-menu h-100 shadow-sm border-0" onclick="location.href='${menu.path}'" style="cursor:pointer; background: white;">
                        <div class="card-body text-center p-4">
                            <i class="fa ${menu.icon} fa-2x mb-3 text-success"></i>
                            <h6 class="fw-bold m-0" style="color: #333; font-size: 0.85rem;">${menu.title}</h6>
                        </div>
                    </div>
                </div>`;
            
            // Render ke Sidebar
            side.innerHTML += `
                <li class="nav-item mb-2">
                    <a class="nav-link text-white py-2" href="${menu.path}">
                        <i class="fa ${menu.icon} me-2 text-white-50"></i> ${menu.title}
                    </a>
                </li>`;
        }
    });

    // Jika tidak ada menu yang cocok, tampilkan pesan error di layar
    if (menuCount === 0) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    ⚠️ <b>Menu tidak muncul?</b><br>
                    Level user Bapak di GSheet adalah: <b>"${userData.level}"</b>.<br>
                    Pastikan tulisan tersebut sama dengan daftar level di kodingan.
                </div>
            </div>`;
    }
}

// Jalankan fungsi
window.onload = initDashboard;

function logout() {
    localStorage.removeItem("user_simasbar");
    window.location.href = "../index.html";
}
