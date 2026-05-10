// Menjalankan fitur login
document.addEventListener("DOMContentLoaded", function () {
    initLogin();
    initLogout();
});

// Mengatur proses login, modal lupa password, dan modal pendaftaran akun pada halaman login
function initLogin() {
    const loginForm = document.getElementById("loginForm");
    const modalLoginError = document.getElementById("modalLoginError");
    const modalLupaPassword = document.getElementById("modalLupaPassword");
    const modalDaftar = document.getElementById("modalDaftar");
    const btnTutupLoginError = document.getElementById("btnTutupLoginError");

    bindLoginForm(loginForm, modalLoginError);
    bindLoginModals(modalLoginError, modalLupaPassword, modalDaftar, btnTutupLoginError);
}

// Menghubungkan form login dengan validasi user dari dataPengguna
function bindLoginForm(loginForm, modalLoginError) {
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const inputEmail = document.getElementById("email").value.trim();
        const inputPassword = document.getElementById("password").value.trim();
        const user = findUser(inputEmail, inputPassword);

        if (!user) {
            showModal(modalLoginError);
            return;
        }

        saveUserSession(user);
        window.location.href = "dashboard.html";
    });
}

// Mencari user yang email dan passwordnya sesuai dengan input login
function findUser(inputEmail, inputPassword) {
    return dataPengguna.find(function (item) {
        return item.email === inputEmail && item.password === inputPassword;
    });
}

// Menyimpan data user sementara untuk ditampilkan di halaman dashboard
function saveUserSession(user) {
    sessionStorage.setItem("namaPengguna", user.nama);
    sessionStorage.setItem("rolePengguna", user.role);
    sessionStorage.setItem("lokasiPengguna", user.lokasi);
}

// Menghubungkan tombol lupa password, daftar akun, dan login gagal.
function bindLoginModals(modalLoginError, modalLupaPassword, modalDaftar, btnTutupLoginError) {
    bindModal(null, modalLoginError, "closeLoginError");
    bindModal("btnLupaPassword", modalLupaPassword, "closeLupaPassword");
    bindModal("btnDaftar", modalDaftar, "closeDaftar");

    if (btnTutupLoginError && modalLoginError) {
        btnTutupLoginError.addEventListener("click", function () {
            closeModal(modalLoginError);
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === modalLoginError) closeModal(modalLoginError);
        if (event.target === modalLupaPassword) closeModal(modalLupaPassword);
        if (event.target === modalDaftar) closeModal(modalDaftar);
    });
}

// Mengatur tombol logout pada halaman dashboard, stock, dan tracking
function initLogout() {
    const btnLogout = document.getElementById("btnLogout");

    if (!btnLogout) return;

    btnLogout.addEventListener("click", function (event) {
        event.preventDefault();
        sessionStorage.removeItem("namaPengguna");
        sessionStorage.removeItem("rolePengguna");
        sessionStorage.removeItem("lokasiPengguna");
        sessionStorage.removeItem("searchQueryDO");
        window.location.href = "index.html";
    });
}

// Menampilkan modal dengan layout flex agar posisinya di tengah layar
function showModal(modalElement) {
    if (modalElement) modalElement.style.display = "flex";
}

// Menyembunyikan modal yang sedang aktif
function closeModal(modalElement) {
    if (modalElement) modalElement.style.display = "none";
}

// Fungsi bantuan untuk membuka dan menutup modal berdasarkan id tombol, modal, dan tombol close
function bindModal(buttonId, modalElement, closeId) {
    const button = document.getElementById(buttonId);
    const closeButton = document.getElementById(closeId);

    if (button && modalElement) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            showModal(modalElement);
        });
    }

    if (closeButton && modalElement) {
        closeButton.addEventListener("click", function () {
            closeModal(modalElement);
        });
    }
}
