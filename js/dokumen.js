/** * LOGIKA UI & MODAL
 */
function toggleModal(show) {
    const modal = document.getElementById('modalInput');
    modal.classList.toggle('hidden', !show);
    modal.classList.toggle('flex', show);
}

/**
 * LOGIKA UPLOAD DOKUMEN
 */
document.getElementById('formDoc').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSimpan');
    const fileInput = document.getElementById('filePdf');
    
    if (!fileInput.files[0]) return alert("Pilih file terlebih dahulu!");

    btn.disabled = true;
    btn.innerText = "Sedang Mengupload...";

    const file = fileInput.files[0];
    const reader = new FileReader();

    // Ambil Data Form
    const tglRaw = document.getElementById('tanggal').value; 
    const tglFormatted = tglRaw.replace(/-/g, ""); 
    const kategori = document.getElementById('kategori').value;
    const judul = document.getElementById('judul').value;
    const nomor = document.getElementById('nomor').value;

    // Penamaan Otomatis
    const newFileName = `${tglFormatted}_${kategori}_${judul}.pdf`;

    reader.onload = async () => {
        const payload = {
            action: "upload",
            fileKey: "DOKUMEN_YAYASAN", // Nanti bisa dinamis sesuai lembaga
            fileName: newFileName,
            fileData: reader.result,
            kategori: kategori,
            nomor: nomor,
            tanggal: tglRaw,
            judul: judul
        };

        const res = await postData(payload);
        if (res.status === "success") {
            alert("Berhasil Upload!");
            location.reload();
        } else {
            alert("Gagal: " + res.message);
            btn.disabled = false;
            btn.innerText = "Simpan & Upload";
        }
    };

    // Membaca file sebagai base64
    reader.readAsDataURL(file);
});

/**
 * LOGIKA TAMPIL DATA
 */
document.addEventListener('DOMContentLoaded', () => {
    loadData();
});

async function loadData() {
    const tableBody = document.getElementById('tableBody');
    if(!tableBody) return; // Guard clause jika elemen tidak ada

    tableBody.innerHTML = '<tr><td colspan="5" class="p-6 text-center italic text-slate-400">Memuat data...</td></tr>';

    const payload = {
        action: "getSmartData",
        modul: "DOKUMEN",
        level: userData.level,
        lembaga: userData.lembaga
    };

    const res = await postData(payload);

    if (res.status === "success") {
        let html = "";
        // Mulai index 1 (melewati header sheet)
        for (let i = 1; i < res.data.length; i++) {
            const row = res.data[i];
            const [kategori, nomor, tanggal, judul, link] = row;

            html += `
            <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                <td class="px-6 py-4"><span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase">${kategori}</span></td>
                <td class="px-6 py-4 font-mono text-[11px]">${nomor}</td>
                <td class="px-6 py-4 text-xs">${tanggal}</td>
                <td class="px-6 py-4 font-medium text-slate-800">${judul}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center justify-center space-x-2">
                        <a href="${link}" target="_blank" class="p-2 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-lg transition">
                            <i data-lucide="eye" class="w-4 h-4"></i>
                        </a>
                        <button onclick="shareWA('${judul}', '${link}')" class="p-2 bg-slate-100 hover:bg-green-100 text-slate-600 hover:text-green-600 rounded-lg transition">
                            <i data-lucide="share-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            </tr>`;
        }
        tableBody.innerHTML = html || '<tr><td colspan="5" class="p-6 text-center text-slate-400">Tidak ada data ditemukan.</td></tr>';
        lucide.createIcons();
    } else {
        tableBody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-red-500">${res.message}</td></tr>`;
    }
}

function shareWA(judul, link) {
    const text = `*DOKUMEN SIM-ASBAR*\n\nJudul: ${judul}\nLink: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}
