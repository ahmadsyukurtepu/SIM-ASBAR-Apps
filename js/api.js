// GANTI dengan URL Web App yang Anda dapatkan setelah Deploy di Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbyrr0ho5ocfRvH2XzpK-5zJDxJxLsKj-veKmWDDViKLq4pY8lfTOeYu2-Q0zUe-EmVRNw/exec";

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
