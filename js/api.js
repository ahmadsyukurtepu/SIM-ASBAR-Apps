// Gantilah URL ini dengan URL Web App yang Anda salin tadi
const API_URL = "https://script.google.com/macros/s/AKfycby0vYsgTAgCwgVngtqWdrhd2bKhsmSusMLcTL0fmXfhluXm30c1FD-hc3Iy2CFSpv52/exec";

async function fetchAPI(data) {
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