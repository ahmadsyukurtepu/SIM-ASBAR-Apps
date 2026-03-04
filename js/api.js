/**
 * API Connector SIM-ASBAR-Apps
 * Menghubungkan Frontend GitHub dengan Google Apps Script
 */

// 1. GANTI DENGAN URL WEB APP APPS SCRIPT BAPAK (YANG BERAKHIRAN /exec)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyoY4z019M-S7Gbz6fzOzL7InD4y4DmrI86tl98j62N649kIgXp0b1vONdqYUfSdb5kA/exec";

/**
 * Fungsi Utama untuk mengambil data dari GSheet secara cerdas
 * @param {string} modulName - Nama modul (SURAT, KEUANGAN, SANTRI, dll)
 * @param {string} sheetName - Nama tab di GSheet (Opsional)
 */
async function fetchModulData(modulName, sheetName = "") {
    // Ambil data user dari session (localStorage)
    const userData = JSON.parse(localStorage.getItem("user_simasbar"));
    
    if (!userData) {
        console.error("User tidak terautentikasi!");
        window.location.href = "../index.html";
        return { status: "error", message: "Sesi habis, silakan login kembali." };
    }

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // Penting untuk menghindari masalah CORS di Apps Script
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "getSmartData",
                modul: modulName,
                level: userData.level,
                lembaga: userData.lembaga,
                sheetName: sheetName
            })
        });

        /** * Catatan: Karena menggunakan 'no-cors', kita tidak bisa membaca response.json() secara langsung.
         * Untuk Apps Script, cara terbaik adalah menggunakan redirect atau 
         * membiarkan Apps Script mengirim response JSON yang valid.
         * Jika Bapak menemui kendala 'no-cors', hapus baris 'mode: no-cors' 
         * dan pastikan di Apps Script sudah terpasang header CORS yang benar.
         */
        
        // Versi Standar (Tanpa no-cors jika sudah di-set di Apps Script):
        const res = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getSmartData",
                modul: modulName,
                level: userData.level,
                lembaga: userData.lembaga,
                sheetName: sheetName
            })
        });
        
        return await res.json();

    } catch (error) {
        console.error("API Error:", error);
        return { status: "error", message: "Gagal terhubung ke server: " + error.message };
    }
}

/**
 * Fungsi untuk Logout (Bisa dipanggil dari mana saja)
 */
function logout() {
    localStorage.removeItem("user_simasbar");
    window.location.href = "../index.html";
}
