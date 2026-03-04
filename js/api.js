/**
 * API Connector SIM-ASBAR-Apps
 * Menghubungkan Frontend GitHub dengan Google Apps Script
 */

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyoY4z019M-S7Gbz6fzOzL7InD4y4DmrI86tl98j62N649kIgXp0b1vONdqYUfSdb5kA/exec";

/**
 * Fungsi Utama untuk mengambil data dari GSheet secara cerdas
 */
async function fetchModulData(modulName, lembagaInput = null, sheetName = "") {
    // 1. Ambil data user dari session
    const rawData = localStorage.getItem("user_simasbar");
    if (!rawData) {
        window.location.href = "../index.html";
        return;
    }
    const userData = JSON.parse(rawData);

    // 2. Siapkan Payload (Data yang dikirim ke Apps Script)
    const payload = {
        action: "getSmartData",
        modul: modulName,
        level: userData.level,
        // Jika ada lembagaInput (dari URL), gunakan itu. Jika tidak, gunakan lembaga user.
        lembaga: lembagaInput || userData.lembaga, 
        sheetName: sheetName
    };

    try {
        // 3. Lakukan Fetch (Hapus mode: 'no-cors' agar bisa membaca balasan JSON)
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        return result;

    } catch (error) {
        console.error("API Error:", error);
        return { status: "error", message: "Gagal terhubung ke server: " + error.message };
    }
}

/**
 * Fungsi untuk Logout
 */
function logout() {
    localStorage.removeItem("user_simasbar");
    window.location.href = "../index.html";
}