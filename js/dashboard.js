const menuData = [
    { id: "DOKUMEN", title: "Dokumen", icon: "fa-folder-open", path: "dokumen.html", level: ["Admin Utama", "Admin Lembaga"] },
    { 
        id: "SURAT", 
        title: "Persuratan", 
        icon: "fa-envelope-open-text", 
        path: "surat.html", 
        level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"],
        hasSub: true,
        subs: [
            { title: "Persuratan TPA", path: "surat.html?lembaga=tpa" },
            { title: "Persuratan MDA", path: "surat.html?lembaga=mda" },
            { title: "Persuratan Alumni", path: "surat.html?lembaga=alumni" } // Tambahan Alumni
        ]
    },
    { 
        id: "KEUANGAN", 
        title: "Keuangan", 
        icon: "fa-wallet", 
        path: "keuangan.html", 
        level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"],
        hasSub: true,
        subs: [
            { title: "Keuangan TPA", path: "keuangan.html?lembaga=tpa" },
            { title: "Keuangan MDA", path: "keuangan.html?lembaga=mda" },
            { title: "Keuangan Alumni", path: "keuangan.html?lembaga=alumni" } // Tambahan Alumni
        ]
    },
    { id: "PEGAWAI", title: "Data Pegawai", icon: "fa-id-card", path: "pegawai.html", level: ["Admin Utama", "Admin Lembaga"] },
    { 
        id: "SANTRI", 
        title: "Data Santri", 
        icon: "fa-user-graduate", 
        path: "santri.html", 
        level: ["Admin Utama", "Admin Lembaga"],
        hasSub: true,
        subs: [
            { title: "Santri TPA", path: "santri.html?lembaga=tpa" },
            { title: "Santri MDA", path: "santri.html?lembaga=mda" }
        ]
    },
    { id: "ALUMNI", title: "Data Alumni", icon: "fa-users-cog", path: "alumni.html", level: ["Admin Utama", "Admin Alumni"] },
    { id: "GALERI", title: "Galeri", icon: "fa-images", path: "galeri.html", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] }
];

function initDashboard() {
    const rawData = localStorage.getItem("user_simasbar");
    if (!rawData) { window.location.href = "../index.html"; return; }
    const userData = JSON.parse(rawData);

    // Update Profil Desktop
    document.getElementById("userName").innerText = userData.nama;
    document.getElementById("userLevel").innerText = userData.level;
    document.getElementById("userLembaga").innerText = userData.lembaga;

    // Update Profil Mobile (Jika elemennya ada di HTML)
    const nameMob = document.getElementById("userNameMobile");
    const lembMob = document.getElementById("userLembagaMobile");
    if(nameMob) nameMob.innerText = userData.nama;
    if(lembMob) lembMob.innerText = userData.lembaga;

    renderMenu(userData.level);
}

function renderMenu(userLevel) {
    const side = document.getElementById("mainMenu");
    const sideMobile = document.getElementById("mainMenuMobile");
    if(!side || !sideMobile) return;

    side.innerHTML = "";
    sideMobile.innerHTML = "";

    const userLevelClean = userLevel.toLowerCase();

    menuData.forEach(menu => {
        const isAllowed = menu.level.some(l => l.toLowerCase() === userLevelClean);
        
        if (isAllowed) {
            let menuHTML = "";
            
            // Logika Dropdown untuk Admin Utama
            if (userLevelClean === "admin utama" && menu.hasSub) {
                menuHTML = `
                    <li class="nav-item">
                        <a class="nav-link text-white d-flex justify-content-between align-items-center collapsed" 
                           data-bs-toggle="collapse" href="#sub${menu.id}" role="button">
                            <span><i class="fa ${menu.icon} me-2 text-white-50"></i> ${menu.title}</span>
                            <i class="fa fa-chevron-down small"></i>
                        </a>
                        <div class="collapse ms-3" id="sub${menu.id}">
                            <ul class="nav flex-column mb-2" style="border-left: 1px solid rgba(255,255,255,0.2); margin-left: 10px;">
                                ${menu.subs.map(s => `
                                    <li class="nav-item">
                                        <a class="nav-link small py-1 text-white-50" href="${s.path}">
                                            <i class="fa fa-circle me-2" style="font-size: 6px;"></i>${s.title}
                                        </a>
                                    </li>`).join('')}
                            </ul>
                        </div>
                    </li>`;
            } else {
                // Menu Biasa (Tanpa Dropdown)
                menuHTML = `
                    <li class="nav-item">
                        <a class="nav-link text-white" href="${menu.path}">
                            <i class="fa ${menu.icon} me-2 text-white-50"></i> ${menu.title}
                        </a>
                    </li>`;
            }
            
            side.innerHTML += menuHTML;
            sideMobile.innerHTML += menuHTML;
        }
    });

    // Mengisi Angka Statistik (Placeholder)
    // Nanti ini akan dihubungkan ke getSmartData khusus statistik
    if(document.getElementById("countSurat")) {
        document.getElementById("countSurat").innerText = "124";
        document.getElementById("countDana").innerText = "45.5";
        document.getElementById("countPegawai").innerText = "28";
        document.getElementById("countSantri").innerText = "350";
        document.getElementById("countAlumni").innerText = "1.205";
    }
}

function logout() {
    localStorage.removeItem("user_simasbar");
    window.location.href = "../index.html";
}

window.onload = initDashboard;