/**
 * GLOBAL.JS - SIM-ASBAR
 * Mengatur Navigasi, Login, dan Hak Akses
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cek Sesi Login saat halaman dimuat
    const savedUser = localStorage.getItem('userSimAsbar');
    
    if (savedUser) {
        const userData = JSON.parse(savedUser);
        startApp(userData);
    }

    // 2. Event Listener Sidebar (Mobile)
    const sidebarBtn = document.getElementById('sidebarCollapse');
    if (sidebarBtn) {
        sidebarBtn.onclick = () => {
            document.getElementById('sidebar').classList.toggle('active');
        };
    }
});

// --- FUNGSI LOGIN ---
async function prosesLogin() {
    const userIn = document.getElementById('username').value;
    const passIn = document.getElementById('password').value;
    const msg = document.getElementById('login-msg');
    const btn = document.getElementById('btn-login');

    if (!userIn || !passIn) {
        msg.innerText = "Isi username dan password!";
        return;
    }

    try {
        btn.innerText = "Mengecek...";
        btn.disabled = true;

        // Memanggil fungsi dari api.js untuk mengambil data GSheet
        const users = await fetchData('DAFTAR_USER');

        if (users) {
            // Cocokkan data (Sesuaikan nama kolom GSheet: username & password)
            const userFound = users.find(u => u.username == userIn && u.password == passIn);

            if (userFound) {
                // Simpan data ke localStorage
                localStorage.setItem('userSimAsbar', JSON.stringify(userFound));
                startApp(userFound);
            } else {
                msg.innerText = "Username atau Password salah!";
                btn.innerText = "Masuk";
                btn.disabled = false;
            }
        } else {
            msg.innerText = "Gagal terhubung ke database.";
            btn.innerText = "Masuk";
            btn.disabled = false;
        }
    } catch (err) {
        console.error("Login Error:", err);
        msg.innerText = "Terjadi kesalahan koneksi.";
        btn.innerText = "Masuk";
        btn.disabled = false;
    }
}

// --- JALANKAN APLIKASI ---
function startApp(userData) {
    // Sembunyikan login, tampilkan app
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');

    // Update info profil di header
    document.getElementById('user-name').innerText = userData.nama;
    const roleEl = document.getElementById('user-role');
    if (roleEl) roleEl.innerText = "Akses: " + userData.role;

    // Terapkan filter menu berdasarkan role (Lv1, Lv2, Lv3)
    terapkanHakAkses(userData.role);

    // Load halaman pertama kali
    loadPage('dashboard');
}

// --- FILTER MENU BERDASARKAN ROLE ---
function terapkanHakAkses(role) {
    const elemenTerbatas = document.querySelectorAll('[data-role]');
    
    elemenTerbatas.forEach(el => {
        const rolesAllowed = el.getAttribute('data-role').split(',');
        if (!rolesAllowed.includes(role)) {
            el.style.display = 'none';
        } else {
            el.style.display = 'block'; // Pastikan terlihat jika diizinkan
        }
    });
}

// --- NAVIGASI HALAMAN (SPA) ---
function loadPage(pageName) {
    const mainBody = document.getElementById('main-body');
    mainBody.innerHTML = `<div style="padding:20px;">Memuat halaman ${pageName}...</div>`;

    fetch(`pages/${pageName}.html`)
        .then(response => {
            if (!response.ok) throw new Error("Halaman tidak ditemukan");
            return response.text();
        })
        .then(html => {
            mainBody.innerHTML = html;
        })
        .catch(err => {
            mainBody.innerHTML = `<div style="padding:20px;">Halaman <b>${pageName}</b> belum tersedia.</div>`;
        });
}

// --- PROFIL DROPDOWN ---
function toggleDropdownProfil() {
    const dropdown = document.getElementById('profile-dropdown');
    dropdown.classList.toggle('hidden');
}

// --- LOGOUT ---
function logout() {
    localStorage.removeItem('userSimAsbar');
    location.reload();
}