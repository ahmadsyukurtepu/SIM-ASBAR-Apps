const API_URL = "https://script.google.com/macros/s/AKfycbwVvyAFPs2lkhXS3fbjEordrpg_ioSxG_usTv6zF4lUldSKmBcRQXEAxU615HfJ26LmtQ/exec"; // Tempel URL Web App Script di sini

async function fetchData(dbKey) {
    try {
        const response = await fetch(`${API_URL}?action=read&dbKey=${dbKey}`);
        const result = await response.json();
        if (result.status === "success") {
            return result.data;
        } else {
            console.error("Error API:", result.message);
            return null;
        }
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        return null;
    }
}