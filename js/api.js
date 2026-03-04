const CONFIG = {
    URL: "https://script.google.com/macros/s/AKfycbzgYO390noTul09XuVh5tnIlZeIgD8k6U6d5EyGFxSUoAzakdFNG-dq1H_2NpOmG__7vw/exec", // GANTI DENGAN URL BAPAK
    USER_KEY: "user_simasbar"
};

async function callAPI(payload) {
    try {
        const response = await fetch(CONFIG.URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return { status: "error", message: "Koneksi terputus" };
    }
}
