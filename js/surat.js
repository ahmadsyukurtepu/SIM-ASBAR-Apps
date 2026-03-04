async function initSurat() {
    const raw = localStorage.getItem("user_simasbar");
    if (!raw) return;
    const user = JSON.parse(raw);

    // Deteksi lembaga dari URL (untuk Admin Utama) atau dari profil (untuk Admin Lembaga)
    const params = new URLSearchParams(window.location.search);
    const target = params.get('lembaga') || user.lembaga;

    document.getElementById("namaLembaga").innerText = target.toUpperCase();
    document.getElementById("subJudul").innerText = "Arsip Digital Unit " + target.toUpperCase();

    loadSuratData(target);
}

async function loadSuratData(target) {
    const tbody = document.getElementById("isiTabelSurat");
    const loader = document.getElementById("loader");

    const res = await fetchModulData("SURAT", target);
    if(loader) loader.style.display = "none";

    if(res && res.status === "success") {
        const data = res.data;
        if(data.length <= 1) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-muted">Data kosong.</td></tr>`;
            return;
        }

        let html = "";
        for(let i=1; i < data.length; i++) {
            const row = data[i];
            const isMasuk = row[0].toUpperCase() === "MASUK";
            html += `
                <tr>
                    <td class="px-3"><span class="badge ${isMasuk ? 'badge-masuk' : 'badge-keluar'} w-100">${row[0]}</span></td>
                    <td class="text-muted">${row[1]}</td>
                    <td class="fw-bold">${row[2]}</td>
                    <td>${row[3]}</td>
                    <td class="hide-mobile">${row[4]}</td>
                    <td class="text-center">
                        ${row[5] ? `<a href="${row[5]}" target="_blank" class="text-danger"><i class="fa fa-file-pdf fa-lg"></i></a>` : '-'}
                    </td>
                    <td class="text-center">
                        <button class="btn btn-sm btn-light border" onclick="alert('Fitur edit segera hadir')"><i class="fa fa-edit text-success"></i></button>
                    </td>
                </tr>`;
        }
        tbody.innerHTML = html;
    }
}

window.addEventListener('DOMContentLoaded', initSurat);