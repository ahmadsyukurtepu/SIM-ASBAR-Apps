const menuData = [
    { id: "DOKUMEN", title: "Dokumen", icon: "fa-folder-open", path: "dokumen.html", level: ["Admin Utama", "Admin Lembaga"] },
    { 
        id: "SURAT", 
        title: "Persuratan", 
        icon: "fa-envelope-open-text", 
        path: "surat.html", 
        level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"],
        hasSub: true // Tandai bahwa ini punya sub-menu untuk Admin Utama
    },
    { 
        id: "KEUANGAN", 
        title: "Keuangan", 
        icon: "fa-wallet", 
        path: "keuangan.html", 
        level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"],
        hasSub: true 
    },
    { id: "PEGAWAI", title: "Data Pegawai", icon: "fa-id-card", path: "pegawai.html", level: ["Admin Utama", "Admin Lembaga"] },
    { 
        id: "SANTRI", 
        title: "Data Santri", 
        icon: "fa-user-graduate", 
        path: "santri.html", 
        level: ["Admin Utama", "Admin Lembaga"],
        hasSub: true 
    },
    { id: "ALUMNI", title: "Data Alumni", icon: "fa-users-cog", path: "alumni.html", level: ["Admin Utama", "Admin Alumni"] },
    { id: "GALERI", title: "Galeri", icon: "fa-images", path: "galeri.html", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] }
];

function initDashboard() {
    const rawData = localStorage.getItem("user_simasbar");
    if (!rawData) return window.location.href = "../index.html";

    const userData = JSON.parse(rawData);
    document.getElementById("userName").innerText = userData.nama;
    document.getElementById("userLevel").innerText = userData.level;
    document.getElementById("userLembaga").innerText = userData.lembaga;

    renderMenu(userData);
}

function renderMenu(user) {
    const grid = document.getElementById("dashboardGrid");
    const side = document.getElementById("mainMenu");
    grid.innerHTML = "";
    side.innerHTML = "";

    menuData.forEach(menu => {
        const isAllowed = menu.level.some(l => l.toLowerCase() === user.level.toLowerCase());
        
        if (isAllowed) {
            // Logika Link: Jika Admin Utama dan menu punya Sub-menu, arahkan ke pilihan lembaga
            // Jika bukan Admin Utama, langsung ke file .html masing-masing
            let actionAttr = `onclick="location.href='${menu.path}'"`;
            let dropdownHtml = "";

            if (user.level === "Admin Utama" && menu.hasSub) {
                actionAttr = `onclick="toggleSub('${menu.id}')"`;
                dropdownHtml = `
                    <div id="sub-${menu.id}" class="sub-menu-box shadow-sm" style="display:none;">
                        <button onclick="bukaLembaga('${menu.path}', 'TPA')" class="btn btn-sm btn-light w-100 mb-1 text-start">📌 ${menu.title} TPA</button>
                        <button onclick="bukaLembaga('${menu.path}', 'MDA')" class="btn btn-sm btn-light w-100 text-start">📌 ${menu.title} MDA</button>
                    </div>
                `;
            }

            // Render ke Grid
            grid.innerHTML += `
                <div class="col-6 col-md-4 col-lg-3 mb-3">
                    <div class="position-relative">
                        <div class="card card-menu h-100 shadow-sm" ${actionAttr}>
                            <div class="card-body p-3">
                                <i class="fa ${menu.icon} fa-2x mb-2 text-success"></i>
                                <h6 class="fw-bold mb-0" style="font-size: 0.8rem;">${menu.title}</h6>
                            </div>
                        </div>
                        ${dropdownHtml}
                    </div>
                </div>`;

            // Render ke Sidebar (Versi Sederhana)
            side.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link text-white" href="${menu.path}">
                        <i class="fa ${menu.icon} me-2 text-white-50"></i> ${menu.title}
                    </a>
                </li>`;
        }
    });
}

// Fungsi bantu untuk Admin Utama
function toggleSub(id) {
    const box = document.getElementById(`sub-${id}`);
    const semuaSub = document.querySelectorAll('.sub-menu-box');
    semuaSub.forEach(s => { if(s.id !== `sub-${id}`) s.style.display = 'none'; }); // Tutup sub lain
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function bukaLembaga(path, lembaga) {
    // Simpan pilihan lembaga sementara di sessionStorage agar API tahu file mana yang dibuka
    sessionStorage.setItem("pilihan_lembaga_admin", lembaga);
    location.href = path;
}

window.onload = initDashboard;
