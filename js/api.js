/**
 * API.JS - SIM-ASBAR
 * Penghubung antara Frontend dan Google Apps Script
 */

// Ganti dengan URL Deployment Apps Script kamu
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwt2ypw1HAqbXL7TgnNT49O6-bsjT-EEVTdp7_oEKNgFnPwWIcYfbNqf2mXitDWKFbQTQ/exec"; 

/**
 * Fungsi untuk mengambil data dari Google Sheets
 * @param {string} dbKey - Nama database sesuai DATABASE_MAP di Apps Script
 */
async function fetchData(dbKey) {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=read&dbKey=${dbKey}`);
        
        if (!response.ok) {
            throw new Error("Jaringan bermasalah atau URL salah.");
        }

        const result = await response.json();

        if (result.status === "success") {
            return result.data; // Mengembalikan array of objects (data dari sheet)
        } else {
            console.error("Apps Script Error:", result.message);
            return null;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        return null;
    }
}

/**
 * Fungsi pembantu untuk memfilter data berdasarkan kolom tertentu
 * Berguna untuk sinkronisasi Profil atau filter Lembaga
 */
function filterByValue(data, column, value) {
    return data.filter(item => item[column] === value);
}