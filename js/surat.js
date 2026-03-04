/**
 * Logika Modul Persuratan SIM-ASBAR
 */

// 1. Ambil Parameter Lembaga dari URL (tpa, mda, atau alumni)
const urlParams = new URLSearchParams(window.location.search);
const lembagaTujuan = urlParams.get('lembaga'); // Hasilnya: 'tpa', 'mda', atau 'alumni'

async function initHalamanSurat() {
    // Tampilkan loading spinner di tabel
    const tbody = document.getElementById("tableBodySurat");
    tbody.innerHTML = `<tr><td colspan="5" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Memuat Arsip ${lembagaTujuan.toUpperCase()}...</p>
    </td></tr>`;

    // 2. Ambil data dari API (api.js)
    // Parameter: Modul "SURAT", Lembaga dari URL
    const res = await fetchModulData("SURAT", lembagaTujuan);

    if (res && res.status === "success") {
        tampilkanTabel(res.data);
    } else {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-5">
            <i class="fa fa-exclamation-triangle fa-2x mb-3"></i><br>
            Gagal mengambil data: ${res.message}
        </td></tr>`;
    }
}

function tampilkanTabel(data) {
    const tbody = document.getElementById("tableBodySurat");
    tbody.innerHTML = "";

    // Data index [0] biasanya header GSheet, jadi kita mulai dari index 1
    if (data.length <= 1) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-5 text-muted">Belum ada arsip surat.</td></tr>`;
        return;
    }

    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        // Struktur kolom: 0:Kategori, 1:Tanggal, 2:NoSurat, 3:Perihal, 4:Asal/Tujuan, 5:Link
        
        // Warna Badge Kategori
        const badgeClass = row[0].toLowerCase() === 'masuk' ? 'bg-info' : 'bg-warning text-dark';

        tbody.innerHTML += `
            <tr class="align-middle">
                <td class="ps-3">
                    <span class="badge ${badgeClass} mb-1" style="font-size: 0.7rem;">${row[0]}</span>
                    <div class="fw-bold small">${row[2]}</div>
                </td>
                <td class="small">${formatTanggalIndo(row[1])}</td>
                <td class="small fw-medium text-wrap" style="max-width: 250px;">${row[3]}</td>
                <td class="small text-muted">${row[4]}</td>
                <td class="text-center pe-3">
                    <a href="${row[5]}" target="_blank" class="btn btn-sm btn-outline-danger shadow-sm">
                        <i class="fa fa-file-pdf"></i> Lihat
                    </a>
                </td>
            </tr>
        `;
    }
}

function formatTanggalIndo(tglStr) {
    if (!tglStr) return "-";
    const d = new Date(tglStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Jalankan saat halaman selesai dimuat
window.addEventListener('load', initHalamanSurat);