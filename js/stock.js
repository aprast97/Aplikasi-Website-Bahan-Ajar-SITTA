// Menjalankan halaman stock
document.addEventListener("DOMContentLoaded", function () {
    initStockPage();
});

// Menampilkan tabel stok dan memproses penambahan data stok baru
function initStockPage() {
    const tabelStokBody = document.getElementById("tabelStokBody");
    const formTambahStok = document.getElementById("formTambahStok");
    const stokCount = document.getElementById("stokCount");
    const inputCover = document.getElementById("inputCover");
    const coverFileName = document.getElementById("coverFileName");
    const modalStockNotification = document.getElementById("modalStockNotification");
    const btnTutupStockNotification = document.getElementById("btnTutupStockNotification");

    if (!tabelStokBody) return;

    bindStockNotificationModal(modalStockNotification, btnTutupStockNotification);
    renderTabelStok(tabelStokBody, stokCount);
    bindCoverFileName(inputCover, coverFileName);
    bindTambahStokForm(formTambahStok, inputCover, coverFileName, tabelStokBody, stokCount);
}

// Menghubungkan tombol close dan area overlay untuk menutup modal notifikasi stock
function bindStockNotificationModal(modalStockNotification, btnTutupStockNotification) {
    bindModal(null, modalStockNotification, "closeStockNotification");

    if (btnTutupStockNotification && modalStockNotification) {
        btnTutupStockNotification.addEventListener("click", function () {
            closeModal(modalStockNotification);
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === modalStockNotification) closeModal(modalStockNotification);
    });
}

// Merender ulang seluruh isi tabel stok berdasarkan data Bahan Ajar terbaru
function renderTabelStok(tabelStokBody, stokCount) {
    tabelStokBody.innerHTML = "";

    dataBahanAjar.forEach(function (item) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><img src="${item.cover}" alt="Cover ${item.namaBarang}" class="book-cover"></td>
            <td>${item.kodeLokasi}</td>
            <td>${item.kodeBarang}</td>
            <td>${item.namaBarang}</td>
            <td>${item.jenisBarang}</td>
            <td>${item.edisi}</td>
            <td><strong>${item.stok}</strong></td>
        `;
        tabelStokBody.appendChild(tr);
    });

    if (stokCount) stokCount.textContent = `${dataBahanAjar.length} bahan ajar`;
}

// Menampilkan nama file cover yang dipilih pengguna pada label upload
function bindCoverFileName(inputCover, coverFileName) {
    if (!inputCover || !coverFileName) return;

    inputCover.addEventListener("change", function () {
        const selectedFile = inputCover.files[0];
        coverFileName.textContent = selectedFile ? selectedFile.name : "Upload Cover";
    });
}

// Mengatur submit form tambah stok dan menyimpan baris baru ke data Bahan Ajar
function bindTambahStokForm(formTambahStok, inputCover, coverFileName, tabelStokBody, stokCount) {
    if (!formTambahStok) return;

    formTambahStok.addEventListener("submit", async function (event) {
        event.preventDefault();

        const stok = Number(document.getElementById("inputStok").value);
        const selectedCover = inputCover && inputCover.files[0] ? inputCover.files[0] : null;

        if (!isValidStock(stok)) {
            showStockNotification("Stok Tidak Valid", "Jumlah stok tidak boleh kurang dari 0.", "error");
            return;
        }

        if (!isValidCoverFile(selectedCover)) {
            showStockNotification("Cover Tidak Valid", "File cover harus berupa gambar.", "error");
            return;
        }

        const cover = await getCoverSource(selectedCover);
        if (!cover) return;

        dataBahanAjar.push(createStockItem(stok, cover));
        renderTabelStok(tabelStokBody, stokCount);
        resetTambahStokForm(formTambahStok, coverFileName);
        showStockNotification("Stok Berhasil Ditambahkan", "Baris stok baru berhasil ditambahkan.", "success");
    });
}

// Memastikan nilai stok tidak negatif sebelum data ditambahkan ke tabel
function isValidStock(stok) {
    return stok >= 0;
}

function isValidCoverFile(selectedCover) {
    return !selectedCover || selectedCover.type.startsWith("image/");
}

// Mengambil sumber gambar cover dari file upload, jika tidak upload gambar akan menggunakan logo UT
async function getCoverSource(selectedCover) {
    const defaultCover = "assets/img/logo-ut-small.png";

    try {
        return selectedCover ? await readCoverFile(selectedCover) : defaultCover;
    } catch (error) {
        showStockNotification("Cover Gagal Dibaca", "Silakan pilih gambar lain.", "error");
        return "";
    }
}

// Membentuk objek stok baru dari nilai input form
function createStockItem(stok, cover) {
    return {
        kodeLokasi: document.getElementById("inputKodeLokasi").value.trim().toUpperCase(),
        kodeBarang: document.getElementById("inputKodeBarang").value.trim().toUpperCase(),
        namaBarang: document.getElementById("inputNamaBarang").value.trim(),
        jenisBarang: document.getElementById("inputJenisBarang").value.trim().toUpperCase(),
        edisi: document.getElementById("inputEdisi").value,
        stok: stok,
        cover: cover
    };
}

// Mengosongkan form setelah data berhasil ditambahkan
function resetTambahStokForm(formTambahStok, coverFileName) {
    formTambahStok.reset();
    if (coverFileName) coverFileName.textContent = "Upload Cover";
}

// Menampilkan popup notifikasi pada halaman stock
function showStockNotification(title, message, type) {
    const modalStockNotification = document.getElementById("modalStockNotification");
    const stockNotificationTitle = document.getElementById("stockNotificationTitle");
    const stockNotificationMessage = document.getElementById("stockNotificationMessage");
    const stockNotificationIcon = document.getElementById("stockNotificationIcon");
    const stockNotificationIconSymbol = document.getElementById("stockNotificationIconSymbol");
    const isSuccess = type === "success";

    if (!modalStockNotification) {
        alert(message);
        return;
    }

    if (stockNotificationTitle) stockNotificationTitle.textContent = title;
    if (stockNotificationMessage) stockNotificationMessage.textContent = message;

    if (stockNotificationIcon) {
        stockNotificationIcon.classList.toggle("modal-icon-error", !isSuccess);
        stockNotificationIcon.classList.toggle("modal-icon-success", isSuccess);
    }

    if (stockNotificationIconSymbol) {
        stockNotificationIconSymbol.className = isSuccess ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation";
    }

    showModal(modalStockNotification);
}

// Membaca file gambar cover dari input upload menjadi data URL
function readCoverFile(file) {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            resolve(reader.result);
        });

        reader.addEventListener("error", function () {
            reject(reader.error);
        });

        reader.readAsDataURL(file);
    });
}
