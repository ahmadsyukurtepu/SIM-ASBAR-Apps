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
    // Di dalam fungsi initDashboard()
const userNameEl = document.getElementById("userName");
if (userNameEl) userNameEl.innerText = userData.nama;

const userLevelEl = document.getElementById("userLevel");
if (userLevelEl) userLevelEl.innerText = userData.level;

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
    if(!side) return;

    side.innerHTML = "";
    const userLevelClean = userLevel.toLowerCase();

    menuData.forEach(menu => {
        const isAllowed = menu.level.some(l => l.toLowerCase() === userLevelClean);
        
        if (isAllowed) {
            let menuHTML = "";
            
            // Highlight menu aktif berdasarkan URL
            const isActive = window.location.pathname.includes(menu.path) ? "active" : "";

            if (userLevelClean === "admin utama" && menu.hasSub) {
                menuHTML = `
                    <li class="nav-item">
                        <a class="nav-link text-white d-flex justify-content-between align-items-center collapsed ${isActive}" 
                           data-bs-toggle="collapse" href="#sub${menu.id}">
                            <span><i class="fa ${menu.icon} me-2 text-white-50"></i> ${menu.title}</span>
                            <i class="fa fa-chevron-down small"></i>
                        </a>
                        <div class="collapse ms-3" id="sub${menu.id}">
                            <ul class="nav flex-column mb-2" style="border-left: 1px solid rgba(255,255,255,0.2); margin-left: 10px;">
                                ${menu.subs.map(s => `
                                    <li class="nav-item">
                                        <a class="nav-link small py-1 text-white-50" href="${s.path}">
                                            <i class="fa fa-circle me-2" style="font-size: 6px;"></i><span>${s.title}</span>
                                        </a>
                                    </li>`).join('')}
                            </ul>
                        </div>
                    </li>`;
            } else {
                menuHTML = `
                    <li class="nav-item">
                        <a class="nav-link text-white ${isActive}" href="${menu.path}">
                            <i class="fa ${menu.icon} me-2 text-white-50"></i> <span>${menu.title}</span>
                        </a>
                    </li>`;
            }
            side.innerHTML += menuHTML;
        }
    });
}

function logout() {
    localStorage.removeItem("user_simasbar");
    window.location.href = "../index.html";
}

window.onload = initDashboard;