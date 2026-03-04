// Ambil data user dari session
const userData = JSON.parse(localStorage.getItem("user_simasbar"));
const urlParams = new URLSearchParams(window.location.search);
// Lembaga yang diminta dari URL (misal: tpa)
const lembagaRequest = urlParams.get('lembaga'); 

function initSurat() {
    // Update Judul Halaman
    const label = lembagaRequest ? lembagaRequest.toUpperCase() : userData.lembaga.toUpperCase();
    document.getElementById("labelLembaga").innerText = "- " + label;
    
    muatDataSurat();
}

async function muatDataSurat() {
    const tbody = document.getElementById("tableBodySurat");
    tbody.innerHTML = '<tr><td colspan="5" class="text-center p-5"><div class="spinner-border text-success"></div></td></tr>';

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "getSmartData",
                modul: "SURAT",
                level: userData.level,
                lembaga: lembagaRequest || userData.lembaga // Prioritas dari URL, lalu dari session
            })
        });
        
        const res = await response.json();

        if (res.status === "success") {
            renderTable(res.data);
        } else {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Akses Ditolak: ${res.message}</td></tr>`;
        }
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Koneksi Gagal.</td></tr>';
    }
}

function renderTable(data) {
    const tbody = document.getElementById("tableBodySurat");
    tbody.innerHTML = "";

    // Data dari getSmartData menyertakan header di index [0], kita buang
    if (data.length <= 1) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center p-4 text-muted">Data surat kosong.</td></tr>';
        return;
    }

    // Loop mulai dari index 1 (melewati header)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        // Urutan kolom GSheet Bapak: 0:Kategori, 1:Tanggal, 2:No Surat, 3:Perihal, 4:Asal/Tujuan, 5:Link
        tbody.innerHTML += `
            <tr class="align-middle">
                <td class="px-3">
                    <span class="small fw-bold d-block">${row[2]}</span>
                    <span class="badge ${row[0] === 'Masuk' ? 'bg-info' : 'bg-warning'} text-dark" style="font-size: 10px;">${row[0]}</span>
                </td>
                <td class="small">${formatTanggal(row[1])}</td>
                <td class="small fw-medium">${row[3]}</td>
                <td class="small text-muted">${row[4]}</td>
                <td class="text-center">
                    <a href="${row[5]}" target="_blank" class="btn btn-sm btn-outline-danger">
                        <i class="fa fa-file-pdf"></i>
                    </a>
                </td>
            </tr>`;
    }
}

function formatTanggal(tgl) {
    if(!tgl) return "-";
    const d = new Date(tgl);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

window.onload = initSurat;