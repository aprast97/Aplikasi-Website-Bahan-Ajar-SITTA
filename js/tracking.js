// Menjalankan halaman tracking
document.addEventListener("DOMContentLoaded", function () {
    initTrackingPage();
});

// Mengatur input, tombol lacak, modal notifikasi, dan pencarian otomatis pada halaman tracking
function initTrackingPage() {
    const btnLacak = document.getElementById("btnLacak");
    const inputDOTracking = document.getElementById("inputDOTracking");
    const modalTrackingNotification = document.getElementById("modalTrackingNotification");
    const btnTutupTrackingNotification = document.getElementById("btnTutupTrackingNotification");

    if (!btnLacak || !inputDOTracking) return;

    bindTrackingNotificationModal(modalTrackingNotification, btnTutupTrackingNotification);
    runSavedTrackingSearch(inputDOTracking);
    bindTrackingSearchEvents(btnLacak, inputDOTracking);
}

// Menghubungkan tombol close dan area overlay
function bindTrackingNotificationModal(modalTrackingNotification, btnTutupTrackingNotification) {
    bindModal(null, modalTrackingNotification, "closeTrackingNotification");

    if (btnTutupTrackingNotification && modalTrackingNotification) {
        btnTutupTrackingNotification.addEventListener("click", function () {
            closeModal(modalTrackingNotification);
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === modalTrackingNotification) closeModal(modalTrackingNotification);
    });
}

function runSavedTrackingSearch(inputDOTracking) {
    const savedQuery = sessionStorage.getItem("searchQueryDO");

    if (!savedQuery) return;

    inputDOTracking.value = savedQuery;
    tampilkanTracking(savedQuery);
    sessionStorage.removeItem("searchQueryDO");
}

// Menghubungkan tombol Lacak dan tombol Enter pada input
function bindTrackingSearchEvents(btnLacak, inputDOTracking) {
    btnLacak.addEventListener("click", function () {
        tampilkanTracking(inputDOTracking.value.trim());
    });

    inputDOTracking.addEventListener("keydown", function (event) {
        if (event.key === "Enter") tampilkanTracking(inputDOTracking.value.trim());
    });
}

// Menampilkan popup notifikasi
function showTrackingNotification(title, message) {
    const modalTrackingNotification = document.getElementById("modalTrackingNotification");
    const trackingNotificationTitle = document.getElementById("trackingNotificationTitle");
    const trackingNotificationMessage = document.getElementById("trackingNotificationMessage");

    if (!modalTrackingNotification) {
        alert(message);
        return;
    }

    if (trackingNotificationTitle) trackingNotificationTitle.textContent = title;
    if (trackingNotificationMessage) trackingNotificationMessage.textContent = message;
    showModal(modalTrackingNotification);
}

// Menampilkan data tracking sesuai nomor DO yang dimasukkan user
function tampilkanTracking(nomorDO) {
    const resultDiv = document.getElementById("trackingResult");
    const timelineList = document.getElementById("timelineList");

    if (!nomorDO) {
        showTrackingNotification("Nomor DO Kosong", "Silakan masukkan Nomor DO terlebih dahulu.");
        return;
    }

    const foundData = dataTracking[nomorDO];

    if (!foundData) {
        resultDiv.style.display = "none";
        showTrackingNotification("Data Tidak Ditemukan", "Nomor DO tidak ditemukan.");
        return;
    }

    fillTrackingSummary(foundData);
    renderTrackingTimeline(timelineList, foundData.perjalanan);
    resultDiv.style.display = "block";
}

// Mengisi ringkasan informasi pengiriman ke panel hasil tracking
function fillTrackingSummary(foundData) {
    document.getElementById("resNama").textContent = foundData.nama;
    document.getElementById("resDO").textContent = foundData.nomorDO;
    document.getElementById("resStatus").textContent = foundData.status;
    document.getElementById("resEkspedisi").textContent = foundData.ekspedisi;
    document.getElementById("resTanggalKirim").textContent = foundData.tanggalKirim;
    document.getElementById("resPaket").textContent = foundData.paket;
    document.getElementById("resTotal").textContent = foundData.total;
    document.getElementById("resTanggalUpdate").innerHTML = `Update terakhir<br>${getLatestTrackingTime(foundData.perjalanan)}`;
}

// Mengambil waktu perjalanan terakhir untuk ditampilkan sebagai waktu update terbaru
function getLatestTrackingTime(perjalanan) {
    return perjalanan[perjalanan.length - 1].waktu;
}

// Merender daftar perjalanan paket ke timeline tracking
function renderTrackingTimeline(timelineList, perjalanan) {
    timelineList.innerHTML = "";

    perjalanan.forEach(function (item) {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="status-text">${item.keterangan}</div>
            <div class="date-text">${item.waktu}</div>
        `;
        timelineList.appendChild(li);
    });
}
