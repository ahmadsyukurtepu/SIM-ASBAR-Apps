// GANTI dengan URL Web App yang Anda dapatkan setelah Deploy di Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbzgYO390noTul09XuVh5tnIlZeIgD8k6U6d5EyGFxSUoAzakdFNG-dq1H_2NpOmG__7vw/exec";

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
