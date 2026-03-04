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
    const side = document.getElementById("mainMenu");
    const sideMobile = document.getElementById("mainMenuMobile");
    side.innerHTML = "";
    sideMobile.innerHTML = "";

    menuData.forEach(menu => {
        const isAllowed = menu.level.some(l => l.toLowerCase() === userLevel.toLowerCase());
        
        if (isAllowed) {
            let menuHTML = "";
            if (userLevel.toLowerCase() === "admin utama" && menu.hasSub) {
                // Dropdown HTML (Sama seperti sebelumnya)
                menuHTML = `
                    <li class="nav-item">
                        <a class="nav-link text-white d-flex justify-content-between align-items-center" 
                           data-bs-toggle="collapse" href="#sub${menu.id}">
                            <span><i class="fa ${menu.icon} me-2"></i> ${menu.title}</span>
                            <i class="fa fa-chevron-down small"></i>
                        </a>
                        <div class="collapse ms-3" id="sub${menu.id}">
                            <ul class="nav flex-column">
                                ${menu.subs.map(s => `<li class="nav-item"><a class="nav-link small py-1" href="${s.path}">${s.title}</a></li>`).join('')}
                            </ul>
                        </div>
                    </li>`;
            } else {
                menuHTML = `<li class="nav-item"><a class="nav-link text-white" href="${menu.path}"><i class="fa ${menu.icon} me-2"></i> ${menu.title}</a></li>`;
            }
            
            side.innerHTML += menuHTML;
            sideMobile.innerHTML += menuHTML;
        }
    });

    // Contoh Mengisi Angka Statistik (Nanti angka ini diambil dari GSheet)
    document.getElementById("countSurat").innerText = "124";
    document.getElementById("countDana").innerText = "45.5";
    document.getElementById("countSantri").innerText = "350";
    document.getElementById("countAlumni").innerText = "1.205"; // Total seluruhnya
}
window.onload = initDashboard;
