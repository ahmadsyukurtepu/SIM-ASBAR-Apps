/**
 * Logika Khusus Modul Persuratan SIM-ASBAR
 */

async function initHalamanSurat() {
    // 1. Ambil data user dan parameter URL
    const raw = localStorage.getItem("user_simasbar");
    if (!raw) { window.location.href = "../index.html"; return; }
    const user = JSON.parse(raw);

    const urlParams = new URLSearchParams(window.location.search);
    const lembagaReq = urlParams.get('lembaga'); 
    
    // 2. Tentukan target lembaga (prioritas dari URL, lalu dari data user)
    const targetLembaga = lembagaReq ? lembagaReq.toUpperCase() : user.lembaga.toUpperCase();
    
    // 3. Update Label UI
    const subJudul = document.getElementById("subJudul");
    const namaLembaga = document.getElementById("namaLembaga");
    const userLevelDisplay = document.getElementById("userLevelDisplay");

    if(subJudul) subJudul.innerText = "Unit Kerja: " + targetLembaga;
    if(namaLembaga) namaLembaga.innerText = targetLembaga;
    if(userLevelDisplay) userLevelDisplay.innerText = user.level;

    // 4. Ambil Data dari API
    loadDataSurat(targetLembaga);
}

async function loadDataSurat(targetLembaga) {
    const tbody = document.getElementById("isiTabelSurat");
    const loader = document.getElementById("loader");
    if(!tbody) return;

    // Reset tabel dan tampilkan loader
    tbody.innerHTML = "";
    if(loader) loader.style.display = "block";

    try {
        const result = await fetchModulData("SURAT", targetLembaga);
        if(loader) loader.style.display = "none";

        if (result && result.status === "success") {
            const data = result.data;
            
            // Cek jika data hanya berisi header atau kosong
            if (!data || data.length <= 1) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-muted fst-italic">Belum ada arsip surat untuk unit ini.</td></tr>`;
                return;
            }

            let html = "";
            // Mulai dari index 1 (melewati header GSheet)
            for (let i = 1; i < data.length; i++) {
                const row = data[i];
                const kat = row[0] ? row[0].toUpperCase() : "N/A";
                const badgeClass = kat === "MASUK" ? "badge-masuk" : "badge-keluar";
                const pdfLink = row[5];
                
                html += `
                    <tr>
                        <td class="px-3">
                            <span class="badge ${badgeClass} p-2 w-100" style="font-size:10px">${kat}</span>
                        </td>
                        <td class="small text-muted">${formatTglIndo(row[1])}</td>
                        <td class="fw-bold small text-truncate" style="max-width:150px">${row[2] || '-'}</td>
                        <td class="small fw-medium">${row[3] || '-'}</td>
                        <td class="hide-mobile small text-muted">${row[4] || '-'}</td>
                        <td class="text-center">
                            ${pdfLink ? 
                                `<a href="${pdfLink}" target="_blank" class="btn-pdf"><i class="fa fa-file-pdf fa-lg"></i></a>` : 
                                '<span class="text-muted small">-</span>'}
                        </td>
                        <td class="text-center">
                            <button class="btn btn-sm btn-light border shadow-sm" onclick="editSurat(${i})">
                                <i class="fa fa-edit text-success"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }
            tbody.innerHTML = html;
        } else {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-danger small">Gagal memuat: ${result.message}</td></tr>`;
        }
    } catch (err) {
        if(loader) loader.style.display = "none";
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5 text-danger">Terjadi kesalahan sistem.</td></tr>`;
    }
}

function formatTglIndo(str) {
    if(!str) return "-";
    const d = new Date(str);
    if(isNaN(d.getTime())) return str; // Jika bukan format tanggal, kembalikan teks asli
    return d.toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' });
}

function tambahSurat() {
    alert("Fitur Form Input sedang disiapkan, Pak Guru!");
}

function editSurat(index) {
    alert("Fitur Edit Baris ke-" + index + " sedang disiapkan!");
}

// Jalankan saat halaman dimuat
window.addEventListener('load', initHalamanSurat);