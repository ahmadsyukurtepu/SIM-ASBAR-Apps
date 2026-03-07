/**
 * DOKUMEN.JS
 * Logika CRUD, Upload GDrive, dan Preview Dokumen
 */

let currentEditId = null; // Penanda jika sedang mode edit
let currentExistingUrl = null; // Menyimpan link file lama jika tidak ganti file saat edit

// Jalankan saat file ini dimuat
(function initDokumen() {
    loadDokumenData();
    
    const form = document.getElementById('formDoc');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSaveDoc(); // Fungsi terpadu untuk Save & Update
        });
    }
})();

// 1. AMBIL DATA DARI GSHEET
async function loadDokumenData() {
    const tableBody = document.getElementById('tableBodyDoc');
    tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-400"><i class="fas fa-spinner animate-spin"></i> Memuat data...</td></tr>`;

    const response = await fetchData('DOKUMEN_YAYASAN');

    if (!response || response.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-10 text-center text-slate-400">Tidak ada dokumen ditemukan.</td></tr>`;
        return;
    }

    renderTable(response);
}

// 2. TAMPILKAN DATA KE TABEL
function renderTable(data) {
    const tableBody = document.getElementById('tableBodyDoc');
    tableBody.innerHTML = '';

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
            <td class="px-6 py-4">
                <div class="flex justify-center gap-2">
                    <button onclick="previewDoc('${doc.link_file}', '${doc.judul}')" class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="Lihat">
                        <i class="fas fa-eye text-xs"></i>
                    </button>
                    <button onclick="shareWA('${doc.link_file}', '${doc.judul}')" class="w-8 h-8 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm" title="Share WA">
                        <i class="fab fa-whatsapp text-xs"></i>
                    </button>
                    <button onclick="editDoc('${doc.id}')" class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white transition-all shadow-sm" title="Edit">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button onclick="deleteDoc('${doc.id}')" class="w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Hapus">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// 3. FUNGSI SAVE (INPUT BARU & UPDATE)
async function handleSaveDoc() {
    const btn = document.getElementById('btnSimpanDoc');
    const fileInput = document.getElementById('filePdf');
    const file = fileInput.files[0];

    // Validasi: Jika input baru (bukan edit), file wajib ada
    if (!currentEditId && !file) return alert("Pilih file PDF terlebih dahulu!");

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-circle-notch animate-spin"></i> MENGUPLOAD...`;

    const processRequest = async (base64Data = null) => {
        const payload = {
            action: "upload",
            dbKey: "DOKUMEN_YAYASAN",
            id: currentEditId, // Null jika baru
            kategori: document.getElementById('kategori').value,
            nomor: document.getElementById('nomor').value,
            tanggal: document.getElementById('tanggal').value,
            judul: document.getElementById('judul').value,
            fileName: file ? file.name : "",
            fileData: base64Data,
            existingUrl: currentExistingUrl
        };

        try {
            const response = await fetch(SCRIPT_URL, {
                method: "POST",
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            
            if (result.status === "success") {
                alert(currentEditId ? "Dokumen Berhasil Diperbarui!" : "Dokumen Berhasil Disimpan!");
                toggleModalDoc(false);
                loadDokumenData();
            } else {
                alert("Gagal: " + result.message);
            }
        } catch (error) {
            alert("Terjadi kesalahan jaringan/server.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<span>SIMPAN & UPLOAD</span>`;
        }
    };

    // Jika ada file baru dipilih, baca sebagai Base64
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => processRequest(reader.result);
    } else {
        // Mode edit tanpa ganti file
        processRequest(null);
    }
}

// 4. FUNGSI EDIT (ISI FORM)
async function editDoc(id) {
    const tableData = await fetchData('DOKUMEN_YAYASAN');
    const doc = tableData.find(item => item.id == id);
    document.getElementById('modalTitle').innerText = "Edit Dokumen"; // Ubah judul
    document.getElementById('btnSimpanDoc').innerHTML = `<i class="fas fa-save"></i> <span>UPDATE DATA</span>`;
    toggleModalDoc(true);
    
    if (doc) {
        currentEditId = id;
        currentExistingUrl = doc.link_file;
        
        document.getElementById('kategori').value = doc.kategori;
        document.getElementById('nomor').value = doc.nomor;
        document.getElementById('tanggal').value = doc.tanggal;
        document.getElementById('judul').value = doc.judul;
        
        // File tidak wajib diisi saat edit
        document.getElementById('filePdf').required = false; 
        
        toggleModalDoc(true);
    }
}

// 5. FUNGSI HAPUS
async function deleteDoc(id) {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;

    try {
        const response = await fetch(SCRIPT_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "delete",
                dbKey: "DOKUMEN_YAYASAN",
                id: id
            })
        });
        const result = await response.json();
        if (result.status === "success") {
            alert("Dokumen terhapus!");
            loadDokumenData();
        }
    } catch (error) {
        alert("Gagal menghapus data.");
    }
}

// 6. MODAL CONTROL
function toggleModalDoc(show) {
    const modal = document.getElementById('modalInputDoc');
    const form = document.getElementById('formDoc');
    const modalTitle = document.getElementById('modalTitle');
    const btnSubmit = document.getElementById('btnSimpanDoc');

    if (show) {
        // Jika currentEditId kosong, berarti ini MODE INPUT BARU
        if (!currentEditId) {
            form.reset(); // Kosongkan semua inputan
            modalTitle.innerText = "Upload Dokumen Baru";
            btnSubmit.innerHTML = `<i class="fas fa-cloud-upload-alt mr-2"></i> SIMPAN & UPLOAD`;
            document.getElementById('filePdf').required = true; // File wajib diisi
        } else {
            // Jika ada ID, berarti MODE EDIT (Judul diubah di fungsi editDoc)
            modalTitle.innerText = "Edit Dokumen";
            btnSubmit.innerHTML = `<i class="fas fa-save mr-2"></i> UPDATE DATA`;
            document.getElementById('filePdf').required = false; // File tidak wajib saat edit
        }
        modal.classList.replace('hidden', 'flex');
    } else {
        // TUTUP MODAL
        modal.classList.replace('flex', 'hidden');
        currentEditId = null; // Reset penanda edit
        currentExistingUrl = null;
    }
}

function previewDoc(link, title) {
    const modal = document.getElementById('modalViewDoc');
    const iframe = document.getElementById('docIframe');
    document.getElementById('viewTitle').innerText = title;
    
    // Konversi link Drive ke mode Preview
    const previewLink = link.replace('/view?usp=drivesdk', '/preview').replace('/view?usp=sharing', '/preview');
    iframe.src = previewLink;
    
    document.getElementById('btnSendWA').onclick = () => shareWA(link, title);
    modal.classList.replace('hidden', 'flex');
}

function toggleModalView(show) {
    const modal = document.getElementById('modalViewDoc');
    if(!show) {
        document.getElementById('docIframe').src = '';
        modal.classList.replace('flex', 'hidden');
    }
}

function shareWA(link, title) {
    const text = `*ARSIP DOKUMEN YAYASAN*\n\n*Judul:* ${title}\n*Link:* ${link}\n\n_SIM-ASBAR System_`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}