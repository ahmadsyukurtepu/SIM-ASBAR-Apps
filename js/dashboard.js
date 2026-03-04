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
            { title: "Persuratan MDA", path: "surat.html?lembaga=mda" }
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
            { title: "Keuangan MDA", path: "keuangan.html?lembaga=mda" }
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

    document.getElementById("userName").innerText = userData.nama;
    document.getElementById("userLevel").innerText = userData.level;
    document.getElementById("userLembaga").innerText = userData.lembaga;

    renderMenu(userData.level);
}

function renderMenu(userLevel) {
    const grid = document.getElementById("dashboardGrid");
    const side = document.getElementById("mainMenu");
    grid.innerHTML = ""; side.innerHTML = "";

    menuData.forEach((menu, index) => {
        const isAllowed = menu.level.some(l => l.toLowerCase() === userLevel.toLowerCase());
        
        if (isAllowed) {
            // 1. RENDER GRID (Tampilan Tengah)
            grid.innerHTML += `
                <div class="col-6 col-md-4 col-lg-3">
                    <div class="card card-menu h-100 shadow-sm border-0" onclick="location.href='${menu.path}'">
                        <div class="card-body text-center p-4">
                            <i class="fa ${menu.icon} fa-2x mb-3 text-success"></i>
                            <h6 class="fw-bold m-0" style="font-size: 0.85rem;">${menu.title}</h6>
                        </div>
                    </div>
                </div>`;

            // 2. RENDER SIDEBAR (Dengan Dropdown jika Admin Utama & punya Sub)
            // RENDER SIDEBAR (Admin Utama dengan Sub Menu)
            if (userLevel.toLowerCase() === "admin utama" && menu.hasSub) {
                side.innerHTML += `
                    <li class="nav-item">
                        <a class="nav-link text-white d-flex justify-content-between align-items-center collapsed" 
                           data-bs-toggle="collapse" 
                           href="#sub${menu.id}" 
                           role="button" 
                           aria-expanded="false">
                            <span><i class="fa ${menu.icon} me-2 text-white-50"></i> ${menu.title}</span>
                            <i class="fa fa-chevron-down small"></i>
                        </a>
                        <div class="collapse" id="sub${menu.id}">
                            <ul class="nav flex-column" style="margin-left: 35px; border-left: 1px solid rgba(255,255,255,0.2);">
                                ${menu.subs.map(s => `
                                    <li class="nav-item">
                                        <a class="nav-link small py-1" href="${s.path}" style="font-size: 0.8rem; color: rgba(255,255,255,0.8) !important;">
                                            <i class="fa fa-circle me-2" style="font-size: 6px; vertical-align: middle;"></i> ${s.title}
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    </li>`;
            } else {
                // Menu biasa untuk non-admin utama atau menu tanpa sub
                side.innerHTML += `
                    <li class="nav-item">
                        <a class="nav-link text-white" href="${menu.path}">
                            <i class="fa ${menu.icon} me-2 text-white-50"></i> ${menu.title}
                        </a>
                    </li>`;
            }
        }
    });
}

window.onload = initDashboard;
