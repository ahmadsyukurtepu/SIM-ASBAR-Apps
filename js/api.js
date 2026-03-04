const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzgYO390noTul09XuVh5tnIlZeIgD8k6U6d5EyGFxSUoAzakdFNG-dq1H_2NpOmG__7vw/exec";

async function fetchModulData(modulName, lembagaInput = null) {
    const rawData = localStorage.getItem("user_simasbar");
    if (!rawData) { window.location.href = "../index.html"; return; }
    
    const userData = JSON.parse(rawData);
    const payload = {
        action: "getSmartData",
        modul: modulName,
        level: userData.level,
        lembaga: lembagaInput || userData.lembaga
    };

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return { status: "error", message: "Gagal terhubung ke server" };
    }
}