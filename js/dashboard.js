const menuData = [
    { id: "DOKUMEN", title: "Dokumen", icon: "fa-folder-open", path: "dokumen.html", level: ["Admin Utama", "Admin Lembaga"] },
    
    // Modul dengan Sub-Menu untuk Admin Utama
    { 
        id: "SURAT", title: "Persuratan", icon: "fa-envelope-open-text", path: "surat.html", 
        level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"],
        hasSub: true 
    },
    { 
        id: "KEUANGAN", title: "Keuangan", icon: "fa-wallet", path: "keuangan.html", 
        level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"],
        hasSub: true 
    },
    { 
        id: "PEGAWAI", title: "Data Pegawai", icon: "fa-id-card", path: "pegawai.html", 
        level: ["Admin Utama", "Admin Lembaga"] 
    },
    { 
        id: "SANTRI", title: "Data Santri", icon: "fa-user-graduate", path: "santri.html", 
        level: ["Admin Utama", "Admin Lembaga"],
        hasSub: true 
    },
    { id: "ALUMNI", title: "Data Alumni", icon: "fa-users-cog", path: "alumni.html", level: ["Admin Utama", "Admin Alumni"] },
    { id: "GALERI", title: "Galeri", icon: "fa-images", path: "galeri.html", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] }
];

function initDashboard() {
    const rawData = localStorage.getItem("user_simasbar");
    if (!rawData) { window.location.href = "../index.html"; return; }

    const userData = JSON.parse(rawData);
    document.getElementById("userName").innerText = userData.nama;
    document.getElementById("userLevel").innerText = userData.level;
    document.getElementById("userLembaga").innerText = userData.lembaga;

    renderMenu(userData);
}

function renderMenu(user) {
    const grid = document.getElementById("dashboardGrid");
    const side = document.getElementById("mainMenu");
    const userLevel = user.level.trim().toLowerCase();
    
    grid.innerHTML = "";
    side.innerHTML = "";

    menuData.forEach(menu => {
        const isAllowed = menu.level.some(l => l.trim().toLowerCase() === userLevel);
        
        if (isAllowed) {
            // Logika Link: Jika Admin Utama dan menu punya Sub-Menu
            let clickAction = `location.href='${menu.path}'`;
            let subText = "";

            if (userLevel === "admin utama" && menu.hasSub) {
                // Tampilkan opsi Sub-Menu jika Admin Utama klik
                clickAction = `pilihLembaga('${menu.id}', '${menu.title}')`;
                subText = `<div class="mt-1 small text-success" style="font-size:0.7rem">Multi-Lembaga</div>`;
            }

            // Render ke Grid
            grid.innerHTML += `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card card-menu h-100 shadow-sm border-0" onclick="${clickAction}">
                        <div class="card-body text-center">
                            <i class="fa ${menu.icon} fa-2x mb-3 text-success"></i>
                            <h6 class="fw-bold mb-0" style="font-size: 0.85rem;">${menu.title}</h6>
                            ${subText}
                        </div>
                    </div>
                </div>`;
            
            // Render ke Sidebar
            side.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link text-white" href="#" onclick="${clickAction}">
                        <i class="fa ${menu.icon} me-2 text-white-50"></i> ${menu.title}
                    </a>
                </li>`;
        }
    });
}

/**
 * Fungsi Modal / Popup untuk Admin Utama memilih Lembaga
 */
function pilihLembaga(modulId, modulNama) {
    // Kita buat popup sederhana menggunakan library default browser agar cepat
    const pilihan = confirm(`Buka ${modulNama} untuk lembaga apa?\n\nKlik OK untuk TPA\nKlik CANCEL untuk MDA`);
    
    const lembagaPilihan = pilihan ? "TPA" : "MDA";
    
    // Simpan sementara pilihan lembaga ke session agar halaman tujuan tahu data mana yang diambil
    localStorage.setItem("filter_lembaga", lembagaPilihan);
    
    // Arahkan ke halaman tujuan (misal: surat.html)
    window.location.href = modulId.toLowerCase() + ".html";
}

window.onload = initDashboard;

function logout() {
    localStorage.removeItem("user_simasbar");
    localStorage.removeItem("filter_lembaga");
    window.location.href = "../index.html";
}
