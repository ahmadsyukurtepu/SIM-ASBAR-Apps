/**
 * DOKUMEN.JS - SIM ASBAR
 * Fokus: Tema Hijau-Kuning & Perbaikan Tombol
 */

let currentEditId = null; 
let currentExistingUrl = null; 

// 1. DAFTARKAN FUNGSI KE WINDOW (Agar onclick di HTML jalan)
window.toggleModalDoc = function(show) {
    const modal = document.getElementById('modalInputDoc');
    const form = document.getElementById('formDoc');
    const modalTitle = document.getElementById('modalTitle');
    const btnSubmit = document.getElementById('btnSimpanDoc');

    if (show) {
        if (!currentEditId) {
            form.reset();
            modalTitle.innerText = "Upload Dokumen Baru";
            btnSubmit.innerHTML = `<i class="fas fa-cloud-upload-alt mr-2"></i> SIMPAN & UPLOAD`;
            document.getElementById('filePdf').required = true;
        } else {
            modalTitle.innerText = "Edit Dokumen";
            btnSubmit.innerHTML = `<i class="fas fa-save mr-2"></i> UPDATE DATA`;
            document.getElementById('filePdf').required = false;
        }
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
        currentEditId = null;
        currentExistingUrl = null;
    }
};

window.editDoc = async function(id) {
    const tableData = await fetchData('DOKUMEN_YAYASAN');
    const doc = tableData.find(item => item.id == id);
    
    if (doc) {
        currentEditId = id;
        currentExistingUrl = doc.link_file;
        
        document.getElementById('kategori').value = doc.kategori;
        document.getElementById('nomor').value = doc.nomor;
        document.getElementById('tanggal').value = doc.tanggal;
        document.getElementById('judul').value = doc.judul;
        
        window.toggleModalDoc(true);
    }
};

window.deleteDoc = async function(id) {
    if (!confirm("Hapus dokumen ini secara permanen?")) return;
    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({ action: "delete", dbKey: "DOKUMEN_YAYASAN", id: id })
        });
        const result = await response.json();
        if (result.status === "success") {
            alert("Berhasil dihapus!");
            loadDokumenData();
        }
    } catch (e) { alert("Gagal menghapus data."); }
};

window.previewDoc = function(link, title) {
    const modal = document.getElementById('modalViewDoc');
    const iframe = document.getElementById('docIframe');
    document.getElementById('viewTitle').innerText = title;
    
    // Konversi link view ke link preview agar bisa masuk iframe
    const previewLink = link.replace('/view?usp=drivesdk', '/preview').replace('/view?usp=sharing', '/preview');
    iframe.src = previewLink;
    
    document.getElementById('btnSendWA').onclick = () => shareWA(link, title);
    modal.classList.remove('hidden');
    modal.classList.add('flex');
};

window.toggleModalView = function(show) {
    const modal = document.getElementById('modalViewDoc');
    if(!show) {
        document.getElementById('docIframe').src = '';
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
};

// 2. LOGIKA UTAMA
async function loadDokumenData() {
    const tableBody = document.getElementById('tableBodyDoc');
    tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-400"><i class="fas fa-spinner animate-spin text-green-500 mr-2"></i> Memuat arsip...</td></tr>`;

    const response = await fetchData('DOKUMEN_YAYASAN');

    if (!response || response.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-400">Belum ada dokumen yang diunggah.</td></tr>`;
        return;
    }
    renderTable(response);
}

function renderTable(data) {
    const tableBody = document.getElementById('tableBodyDoc');
    tableBody.innerHTML = '';

    data.forEach(doc => {
        const row = document.createElement('tr');
        row.className = "hover:bg-green-50 transition-colors border-b border-slate-100"; 
        row.innerHTML = `
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 uppercase">
                    ${doc.kategori}
                </span>
            </td>
            <td class="px-6 py-4 text-sm font-medium text-slate-700">${doc.nomor}</td>
            <td class="px-6 py-4 text-sm text-slate-500">${doc.tanggal}</td>
            <td class="px-6 py-4 text-sm font-bold text-slate-800">${doc.judul}</td>
            <td class="px-6 py-4 text-center">
                <div class="flex justify-center gap-2">
                    <button onclick="previewDoc('${doc.link_file}', '${doc.judul}')" class="w-8 h-8 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all">
                        <i class="fas fa-eye text-xs"></i>
                    </button>
                    <button onclick="editDoc('${doc.id}')" class="w-8 h-8 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-all">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button onclick="deleteDoc('${doc.id}')" class="w-8 h-8 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function handleSaveDoc() {
    const btn = document.getElementById('btnSimpanDoc');
    const fileInput = document.getElementById('filePdf');
    const file = fileInput.files[0];

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-circle-notch animate-spin"></i> MENGUNGGAH...`;

    const processRequest = async (base64Data = null) => {
        const payload = {
            action: "upload",
            dbKey: "DOKUMEN_YAYASAN",
            id: currentEditId, 
            kategori: document.getElementById('kategori').value,
            nomor: document.getElementById('nomor').value,
            tanggal: document.getElementById('tanggal').value,
            judul: document.getElementById('judul').value,
            fileName: file ? file.name : "",
            fileData: base64Data,
            existingUrl: currentExistingUrl
        };

        try {
            const response = await fetch(SCRIPT_URL, { method: "POST", body: JSON.stringify(payload) });
            const result = await response.json();
            if (result.status === "success") {
                alert("Dokumen berhasil disimpan!");
                window.toggleModalDoc(false);
                loadDokumenData();
            }
        } catch (error) {
            alert("Koneksi terputus atau server sibuk.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<span>SIMPAN & UPLOAD</span>`;
        }
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = () => processRequest(reader.result);
        reader.readAsDataURL(file);
    } else {
        processRequest(null);
    }
}

function shareWA(link, title) {
    const text = `*ARSIP DOKUMEN YAYASAN*\n\n*Judul:* ${title}\n*Link:* ${link}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

// 3. JALANKAN SAAT START
document.addEventListener('DOMContentLoaded', () => {
    loadDokumenData();
    const form = document.getElementById('formDoc');
    if(form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            await handleSaveDoc();
        };
    }
});