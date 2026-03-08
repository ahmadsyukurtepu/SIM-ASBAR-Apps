/**
 * API.JS - SIM-ASBAR
 * Penghubung antara Frontend dan Google Apps Script
 */

// Ganti dengan URL Deployment Apps Script kamu
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxeHiMLhzZRd5bccOtabjRPYNvzvhzmeZaUoBvUzM-AXV4ckyGG-LPwC-WZBGlZ0Yl7Zg/exec"; 

/**
 * Fungsi untuk mengambil data dari Google Sheets
 * @param {string} dbKey - Nama database sesuai DATABASE_MAP di Apps Script
 */
async function fetchData(dbKey) {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=read&dbKey=${dbKey}`);
        const result = await response.json();
        if (result.status === "success") {
            return result.data; // Mengembalikan array data
        } else {
            console.error(result.message);
            return [];
        }
    } catch (error) {
        console.error("Gagal koneksi API:", error);
        return [];
    }
}

/**
 * Fungsi pembantu untuk memfilter data berdasarkan kolom tertentu
 * Berguna untuk sinkronisasi Profil atau filter Lembaga
 */
function filterByValue(data, column, value) {
    return data.filter(item => item[column] === value);
}