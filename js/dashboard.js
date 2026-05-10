// Menjalankan fitur dashboard
document.addEventListener("DOMContentLoaded", function () {
    initGreeting();
    initDashboardSearch();
});

// Menampilkan sapaan dashboard sesuai waktu dan data user yang login
function initGreeting() {
    const greetingText = document.getElementById("greetingText");
    const userSummary = document.getElementById("userSummary");

    if (!greetingText) return;

    greetingText.textContent = `${getGreetingByTime()}, ${getStoredUserName()}`;
    if (userSummary) userSummary.textContent = getStoredUserSummary();
}

// Menghasilkan teks sapaan sesuai jam lokal perangkat user
function getGreetingByTime() {
    const hour = new Date().getHours();

    if (hour >= 3 && hour < 11) return "Selamat pagi";
    if (hour >= 11 && hour < 15) return "Selamat siang";
    if (hour >= 15 && hour < 18) return "Selamat sore";
    return "Selamat malam";
}

// Mengambil nama user dari sessionStorage
function getStoredUserName() {
    return sessionStorage.getItem("namaPengguna") || "Pengguna SITTA";
}

// Mengambil role dan lokasi user dari sessionStorage untuk ringkasan dashboard
function getStoredUserSummary() {
    const role = sessionStorage.getItem("rolePengguna") || "Petugas";
    const lokasi = sessionStorage.getItem("lokasiPengguna") || "Universitas Terbuka";

    return `${role} - ${lokasi}`;
}

// Mengatur form pencarian Delivery Order pada dashboard dan mengirim pencarian ke halaman tracking
function initDashboardSearch() {
    const formCariDO = document.getElementById("formCariDO");

    if (!formCariDO) return;

    formCariDO.addEventListener("submit", function (event) {
        event.preventDefault();

        const inputDO = document.getElementById("inputDO").value.trim();

        if (!inputDO) {
            alert("Nomor Delivery Order tidak boleh kosong!");
            return;
        }

        sessionStorage.setItem("searchQueryDO", inputDO);
        window.location.href = "tracking.html";
    });
}
