/**
 * Global Logic SIM-ASBAR
 * Mengatur Menu Sidebar dan Sesi User
 */

const menuData = [
    { id: "DASHBOARD", title: "Dashboard", icon: "fa-th-large", path: "dashboard.html", level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"] },
    { id: "DOKUMEN", title: "Dokumen", icon: "fa-folder-open", path: "dokumen.html", level: ["Admin Utama", "Admin Lembaga"] },
    { 
        id: "SURAT", title: "Persuratan", icon: "fa-envelope-open-text", path: "surat.html", 
        level: ["Admin Utama", "Admin Lembaga", "Admin Alumni"],
        hasSub: true,
        subs: [
            { title: "Persuratan TPA", path: "surat.html?lembaga=tpa" },
            { title: "Persuratan MDA", path: "surat.html?lembaga=mda" },
            { title: "Persuratan Alumni", path: "surat.html?lembaga=alumni" }
        ]
    },
    { id: "SANTRI", title: "Data Santri", icon: "fa-user-graduate", path: "santri.html", level: ["Admin Utama", "Admin Lembaga"] },
    { id: "ALUMNI", title: "Data Alumni", icon: "fa-users", path: "alumni.html", level: ["Admin Utama", "Admin Alumni"] }
];

function initGlobal() {
    const rawData = localStorage.getItem("user_simasbar");
    if (!rawData) {
        window.location.href = "../index.html";
        return;
    }
    const userData = JSON.parse(rawData);

    // Update elemen profil jika ada di halaman tersebut
    const elId = {
        name: document.getElementById("userName"),
        level: document.getElementById("userLevel"),
        lembaga: document.getElementById("userLembaga")
    };

    if (elId.name) elId.name.innerText = userData.nama;
    if (elId.level) elId.level.innerText = userData.level;
    if (elId.lembaga) elId.lembaga.innerText = userData.lembaga;

    renderSidebarMenu(userData.level);
}

function renderSidebarMenu(userLevel) {
    const menuContainer = document.getElementById("mainMenu");
    if (!menuContainer) return;

    menuContainer.innerHTML = "";
    const levelLower = userLevel.toLowerCase();

    menuData.forEach(menu => {
        const isAllowed = menu.level.some(l => l.toLowerCase() === levelLower);
        if (!isAllowed) return;

        const isActive = window.location.pathname.includes(menu.path) ? "active" : "";
        
        // Cek jika Admin Utama, tampilkan Sub-menu jika ada
        if (levelLower === "admin utama" && menu.hasSub) {
            let subHTML = menu.subs.map(s => `
                <li><a class="nav-link small ps-4 py-1" href="${s.path}">
                    <i class="fa fa-circle me-2" style="font-size: 6px;"></i><span>${s.title}</span>
                </a></li>`).join('');

            menuContainer.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link text-white d-flex justify-content-between ${isActive}" 
                       data-bs-toggle="collapse" href="#sub${menu.id}">
                        <span><i class="fa ${menu.icon} me-2"></i><span>${menu.title}</span></span>
                        <i class="fa fa-chevron-down small"></i>
                    </a>
                    <ul class="collapse list-unstyled bg-dark-subtle rounded-3 mt-1 mx-2" id="sub${menu.id}">
                        ${subHTML}
                    </ul>
                </li>`;
        } else {
            menuContainer.innerHTML += `
                <li class="nav-item">
                    <a class="nav-link ${isActive}" href="${menu.path}">
                        <i class="fa ${menu.icon} me-2"></i><span>${menu.title}</span>
                    </a>
                </li>`;
        }
    });
}

function logout() {
    localStorage.removeItem("user_simasbar");
    window.location.href = "../index.html";
}

// Jalankan fungsi otomatis
window.addEventListener('DOMContentLoaded', initGlobal);