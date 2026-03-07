/**
 * DOKUMEN.JS
 * Logika khusus untuk halaman Dokumen
 */

// Jalankan saat file ini dimuat
(function initDokumen() {
    loadDokumenData();
    
    // Handle Form Submit
    const form = document.getElementById('formDoc');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleUploadDoc();
        });
    }
})();

async function loadDokumenData() {
    const tableBody = document.getElementById('tableBodyDoc');
    
    // Panggil fungsi fetchData dari api.js dengan key DOKUMEN_YAYASAN
    const data = await fetchData('DOKUMEN_YAYASAN');

    if (!data || data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-400">Tidak ada dokumen ditemukan.</td></tr>`;
        return;
    }

    tableBody.innerHTML = ''; // Bersihkan loading

    data.forEach(doc => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 transition-colors";
        row.innerHTML = `
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 uppercase border border-blue-100">
                    ${doc.kategori}
                </span>
            </td>
            <td class="px-6 py-4 text-sm font-medium text-slate-700">${doc.nomor}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${doc.tanggal}</td>
            <td class="px-6 py-4 text-sm font-bold text-slate-800">${doc.judul}</td>
            <td class="px-6 py-4 text-center">
                <a href="${doc.link_file}" target="_blank" class="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-400 hover:text-white transition-all shadow-sm">
                    <i class="fas fa-eye"></i>
                </a>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function toggleModalDoc(show) {
    const modal = document.getElementById('modalInputDoc');
    if (show) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

async function handleUploadDoc() {
    const btn = document.getElementById('btnSimpanDoc');
    const fileInput = document.getElementById('filePdf');
    const file = fileInput.files[0];
    
    if (!file) return alert("Pilih file PDF!");

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-circle-notch animate-spin"></i> PROSES UPLOAD...`;

    // 1. Ubah File ke Base64 agar bisa dikirim via JSON
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const payload = {
            action: "upload",
            dbKey: "DOKUMEN_YAYASAN",
            kategori: document.getElementById('kategori').value,
            nomor: document.getElementById('nomor').value,
            tanggal: document.getElementById('tanggal').value,
            judul: document.getElementById('judul').value,
            fileName: file.name,
            fileData: reader.result
        };

        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            
            if (result.status === "success") {
                alert("Dokumen Berhasil Disimpan!");
                toggleModalDoc(false);
                loadDokumenData(); // Refresh tabel
            }
        } catch (error) {
            alert("Gagal upload!");
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<span>SIMPAN & UPLOAD</span>`;
        }
    };
}
async function renderTable(data) {
    const tableBody = document.getElementById('tableBodyDoc');
    tableBody.innerHTML = '';

    data.forEach(doc => {
        const row = document.createElement('tr');
        row.className = "hover:bg-slate-50 transition-colors";
        row.innerHTML = `
            <td class="px-6 py-4"><span class="px-3 py-1 rounded-full text-[10px] font-black bg-blue-50 text-blue-600 uppercase">${doc.kategori}</span></td>
            <td class="px-6 py-4 text-sm font-medium text-slate-700">${doc.nomor}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${doc.tanggal}</td>
            <td class="px-6 py-4 text-sm font-bold text-slate-800">${doc.judul}</td>
            <td class="px-6 py-4">
                <div class="flex justify-center gap-2">
                    <button onclick="previewDoc('${doc.link_file}', '${doc.judul}')" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                        <i class="fas fa-eye text-xs"></i>
                    </button>
                    <button onclick="shareWA('${doc.link_file}', '${doc.judul}')" class="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all">
                        <i class="fab fa-whatsapp text-xs"></i>
                    </button>
                    <button onclick="editDoc('${doc.id}')" class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button onclick="deleteDoc('${doc.id}')" class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function previewDoc(link, title) {
    const modal = document.getElementById('modalViewDoc');
    const iframe = document.getElementById('docIframe');
    document.getElementById('viewTitle').innerText = title;
    
    // Ubah link view Google Drive agar bisa masuk Iframe
    const previewLink = link.replace('/view?usp=drivesdk', '/preview');
    iframe.src = previewLink;
    
    // Set tombol WA di dalam modal
    document.getElementById('btnSendWA').onclick = () => shareWA(link, title);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function toggleModalView(show) {
    const modal = document.getElementById('modalViewDoc');
    if(!show) {
        document.getElementById('docIframe').src = ''; // Stop loading iframe
        modal.classList.add('hidden');
    }
}

function shareWA(link, title) {
    const text = `Assalamu Alaikum, Berikut adalah Dokumen Yayasan:\n\n*Judul:* ${title}\n*Link:* ${link}\n\n_SIM-ASBAR System_`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}