document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // Memanggil fungsi dari api.js
            const result = await fetchAPI({
                action: "login",
                username: username,
                password: password
            });

            if (result.status === "success") {
                // Simpan data user ke storage
                localStorage.setItem("userSimAsbar", JSON.stringify(result.user));
                alert("Selamat Datang, " + result.user.nama);
                window.location.href = "pages/dashboard.html";
            } else {
                document.getElementById("message").innerText = result.message;
            }
        });
    }
});

// Fungsi Logout
function logout() {
    localStorage.removeItem("userSimAsbar");
    window.location.href = "../index.html";
}
function checkSidebarAccess() {
    const user = JSON.parse(localStorage.getItem("userSimAsbar"));
    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    const level = user.level; // Lv1, Lv2, atau Lv3

    // Contoh menyembunyikan menu Dokumen jika bukan Lv1
    if (level !== "Lv1") {
        const menuDokumen = document.getElementById("menu-dokumen");
        if (menuDokumen) menuDokumen.style.display = "none";
    }

    // Tambahkan logika lainnya untuk level lainnya
}
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("userSimAsbar"));

    // 1. Cek apakah user sudah login
    if (!user) {
        // Jika tidak di halaman index, tendang ke login
        if (!window.location.pathname.endsWith("index.html")) {
            window.location.href = "../index.html";
        }
        return;
    }

    // 2. Update Tampilan Profil & Header
    const welcomeText = document.getElementById("welcome-text");
    const nameDisplay = document.getElementById("user-display-name");
    const levelBadge = document.getElementById("user-level-badge");
    const infoLembaga = document.getElementById("info-lembaga");

    if (nameDisplay) nameDisplay.innerText = user.nama;
    if (levelBadge) levelBadge.innerText = "Akses: " + user.level;
    if (welcomeText) welcomeText.innerText = "Halo, " + user.nama;
    if (infoLembaga) infoLembaga.innerText = "Lembaga: " + user.lembaga;

    // 3. Filter Menu Berdasarkan Level (Lv1, Lv2, Lv3)
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        const allowedLevels = item.getAttribute("data-level").split(",");
        if (!allowedLevels.includes(user.level)) {
            item.style.display = "none";
        }
    });
});

// Fungsi Dropdown Profil
function toggleDropdown() {
    document.getElementById("profile-dropdown").classList.toggle("show");
}

// Fungsi Logout
function logout() {
    localStorage.removeItem("userSimAsbar");
    window.location.href = "../index.html";
}