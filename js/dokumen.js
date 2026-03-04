document.addEventListener('DOMContentLoaded', () => {
    // Proteksi Lv1: Jika bukan Admin Utama, tendang ke dashboard
    if (userData.level !== "Admin Utama") {
        alert("Akses Ditolak! Menu ini khusus Admin Utama.");
        window.location.href = "dashboard.html";
        return;
    }

    muatDataDokumen();
});

async function muatDataDokumen() {
    const tbody = document.getElementById('tabelDokumen');
    
    // Request ke Apps Script
    const payload = {
        action: "getSmartData",
        modul: "DOKUMEN",
        level: userData.level,
        lembaga: userData.lembaga,
        sheetName: "Sheet1" // Sesuaikan dengan nama sheet di GSheet Anda
    };

    const response = await postData(payload);

    if (response.status === "success") {
        renderTabel(response.data);
    } else {
        tbody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-red-500 font-medium">Gagal memuat data: ${response.message}</td></tr>`;
    }
}

function renderTabel(data) {
    const tbody = document.getElementById('tabelDokumen');
    tbody.innerHTML = "";

    // Mulai dari index 1 untuk skip Header GSheet
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const [kategori, nomor, tanggal, judul, linkPdf] = row;

        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 transition">
                <td class="px-6 py-4 text-sm"><span class="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold uppercase">${kategori}</span></td>
                <td class="px-6 py-4 text-sm text-slate-600 font-mono">${nomor}</td>
                <td class="px-6 py-4 text-sm text-slate-600">${tanggal}</td>
                <td class="px-6 py-4 text-sm font-medium text-slate-800">${judul}</td>
                <td class="px-6 py-4 text-sm text-center">
                    <div class="flex justify-center space-x-2">
                        <button onclick="shareWA('${judul}', '${linkPdf}')" class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Share WA"><i data-lucide="message-circle" class="w-4 h-4"></i></button>
                        <a href="${linkPdf}" target="_blank" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Lihat PDF"><i data-lucide="file-text" class="w-4 h-4"></i></a>
                        <button onclick="editDokumen(${i})" class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Edit"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                        <button onclick="hapusDokumen(${i})" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Hapus"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                    </div>
                </td>
            </tr>
        `;
    }
    lucide.createIcons();
}

// FUNGSI AKSI
function shareWA(judul, link) {
    const teks = encodeURIComponent(`Halo, berikut adalah dokumen *${judul}* dari SIM-ASBAR: ${link}`);
    window.open(`https://wa.me/?text=${teks}`, '_blank');
}

function editDokumen(id) {
    alert("Fungsi Edit untuk baris ke-" + id + " sedang disiapkan.");
}

function hapusDokumen(id) {
    if(confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
        alert("Fungsi Hapus untuk baris ke-" + id + " sedang disiapkan.");
    }
}
