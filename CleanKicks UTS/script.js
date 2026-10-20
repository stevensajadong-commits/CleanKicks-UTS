// 01. DATA LAYANAN
// Setiap layanan adalah object. Tambah atau ubah harga di bagian ini.
const services = [
    {
        id: "basic",
        name: "Basic Cleaning",
        description: "Pembersihan ringan untuk sepatu sehari-hari.",
        price: 35000,
        icon: "👟"
    },
    {
        id: "deep",
        name: "Deep Cleaning",
        description: "Pembersihan lebih menyeluruh pada bagian sepatu.",
        price: 60000,
        icon: "🧼"
    },
    {
        id: "whitening",
        name: "Whitening Care",
        description: "Perawatan untuk membantu sepatu putih terlihat bersih.",
        price: 55000,
        icon: "✨"
    }
];

// 02. AMBIL ELEMEN HTML
// querySelector mengambil elemen pertama yang cocok dengan selector.
const serviceList = document.querySelector("#serviceList");
const serviceSelect = document.querySelector("#serviceType");
const quantityInput = document.querySelector("#shoeQuantity");
const bookingForm = document.querySelector("#bookingForm");
const totalPrice = document.querySelector("#totalPrice");
const bookingResult = document.querySelector("#bookingResult");
const dateInput = document.querySelector("#orderDate");

// 03. FORMAT HARGA KE RUPIAH
function formatRupiah(amount) {
    return "Rp" + amount.toLocaleString("id-ID");
}

// 04. TAMPILKAN KARTU LAYANAN
// forEach mengulang data layanan, lalu membuat satu kartu untuk setiap object.
function renderServices() {
    serviceList.innerHTML = "";

    services.forEach(function (service) {
        serviceList.innerHTML += `
            <article class="service-card">
                <div class="service-icon" aria-hidden="true">${service.icon}</div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="service-price">${formatRupiah(service.price)}</div>
                <button class="choose-service" type="button" data-service="${service.id}">
                    Pilih Layanan
                </button>
            </article>
        `;
    });

    // Isi pilihan layanan pada dropdown menggunakan data yang sama.
    services.forEach(function (service) {
        serviceSelect.innerHTML += `
            <option value="${service.id}">${service.name}</option>
        `;
    });
}

// 05. CARI LAYANAN YANG DIPILIH
function getSelectedService() {
    // find mengembalikan satu object yang id-nya sama dengan pilihan dropdown.
    return services.find(function (service) {
        return service.id === serviceSelect.value;
    });
}

// 06. HITUNG TOTAL HARGA
function updateTotal() {
    const selectedService = getSelectedService();
    const quantity = Number(quantityInput.value);

    if (!selectedService || quantity < 1 || quantity > 10 || !Number.isInteger(quantity)) {
        totalPrice.textContent = formatRupiah(0);
        return;
    }

    // Business rule sederhana: harga layanan dikali jumlah sepatu.
    const total = selectedService.price * quantity;
    totalPrice.textContent = formatRupiah(total);
}

// 07. PILIH LAYANAN DARI KARTU
// Event delegation: klik tombol layanan akan memilih layanan pada dropdown.
serviceList.addEventListener("click", function (event) {
    const button = event.target.closest("[data-service]");

    if (!button) {
        return;
    }

    serviceSelect.value = button.dataset.service;
    updateTotal();
    document.querySelector("#booking").scrollIntoView({ behavior: "smooth" });
});

// Jika pilihan layanan atau jumlah sepatu berubah, hitung ulang totalnya.
serviceSelect.addEventListener("change", updateTotal);
quantityInput.addEventListener("input", updateTotal);

// 08. VALIDASI DAN PROSES BOOKING SEDERHANA
bookingForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Mencegah halaman reload ketika form dikirim.

    const name = document.querySelector("#customerName").value.trim();
    const phone = document.querySelector("#customerPhone").value.trim();
    const selectedService = getSelectedService();
    const quantity = Number(quantityInput.value);
    const date = dateInput.value;
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const localToday = today.toISOString().slice(0, 10);

    // Kondisi if memeriksa input penting sebelum pesanan ditampilkan.
    if (name.length < 2) {
        alert("Nama harus terdiri dari minimal 2 karakter.");
        return;
    }

    if (!/^0[0-9]{9,13}$/.test(phone)) {
        alert("Masukkan nomor telepon dengan format 08xxxxxxxxxx.");
        return;
    }

    if (!selectedService) {
        alert("Silakan pilih layanan.");
        return;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
        alert("Jumlah sepatu harus antara 1 sampai 10 pasang.");
        return;
    }

    if (!date || date < localToday) {
        alert("Pilih tanggal hari ini atau setelahnya.");
        return;
    }

    const total = selectedService.price * quantity;

    // escapeHTML mengamankan input pengguna sebelum dimasukkan ke template HTML.
    bookingResult.innerHTML = `
        <h3>Pesanan berhasil dibuat!</h3>
        <p><strong>Nama:</strong> ${escapeHTML(name)}</p>
        <p><strong>Nomor WhatsApp:</strong> ${escapeHTML(phone)}</p>
        <p><strong>Layanan:</strong> ${escapeHTML(selectedService.name)}</p>
        <p><strong>Jumlah:</strong> ${quantity} pasang</p>
        <p><strong>Tanggal:</strong> ${escapeHTML(date)}</p>
        <p><strong>Total:</strong> ${formatRupiah(total)}</p>
        <p>Ini adalah contoh pesanan demo. Data belum dikirim ke server.</p>
    `;
    bookingResult.hidden = false;
    bookingResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// 09. MENGAMANKAN TEKS UNTUK DITAMPILKAN DI DALAM HTML
// Mengganti karakter khusus supaya input nama/nomor tidak dibaca sebagai tag HTML.
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };
        return replacements[char];
    });
}

// 10. TAHUN FOOTER OTOMATIS
 document.querySelector("#currentYear").textContent = new Date().getFullYear();

// Jalankan fungsi awal agar kartu dan pilihan layanan tampil saat halaman dibuka.
renderServices();
updateTotal();
