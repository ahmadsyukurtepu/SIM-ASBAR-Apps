// GANTI dengan URL Web App yang Anda dapatkan setelah Deploy di Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbyhDVs0q_Y0m_ezoBUWzDleWOfmz-xyV8Z_I12Ui4LxzkpTzUFxKt5NfSsAkx3ay8ZiAQ/exec";

async function postData(data) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error("Error API:", error);
        return { status: "error", message: "Gagal terhubung ke server" };
    }
}
