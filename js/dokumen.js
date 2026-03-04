function toggleModal(show) {
    const modal = document.getElementById('modalInput');
    modal.classList.toggle('hidden', !show);
    modal.classList.toggle('flex', show);
}

document.getElementById('formDoc').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('btnSimpan');
    btn.disabled = true;
    btn.innerText = "Sedang Mengupload...";

    const fileInput = document.getElementById('filePdf');
    const file = fileInput.files[0];
    const reader = new FileReader();

    // Ambil Data Form
    const tglRaw = document.getElementById('tanggal').value; // YYYY-MM-DD
    const tglFormatted = tglRaw.replace(/-/g, ""); // YYYYMMDD
    const kategori = document.getElementById('kategori').value;
    const judul = document.getElementById('judul').value;
    const nomor = document.getElementById('nomor').value;

    // Penamaan Otomatis: (YYYYMMDD)_Kategori_Judul
    const newFileName = `${tglFormatted}_${kategori}_${judul}.pdf`;

    reader.onload = async () => {
        const payload = {
            action: "upload",
            fileKey: "DOKUMEN_YAYASAN",
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
    reader.readAsDataURL(file);
});
