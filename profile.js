// ===== USER MANAGEMENT =====
function initUserManagement() {
    // Cek login status
    const isLoggedIn = localStorage.getItem('sampahindah_loggedIn');
    const currentUser = localStorage.getItem('sampahindah_currentUser');
    
    if (isLoggedIn !== 'true' || !currentUser) {
        // Redirect ke index.html jika belum login
        window.location.href = 'index.html';
        return;
    }
    
    updateProfileNavbar();
    setupProfileLogout();
    loadUserData(currentUser);
}

function loadUserData(email) {
    let profile = storage.getProfile();
    
    // Jika profile tidak ada atau email tidak match, buat profile baru
    if (!profile || profile.email !== email) {
        profile = {
            id: storage.generateID(),
            nama: email.split('@')[0], // Gunakan nama dari email
            email: email,
            telepon: '',
            alamat: '',
            saldo: 0,
            totalSampah: 0,
            totalPendapatan: 0,
            joinDate: new Date().toISOString()
        };
        storage.saveProfile(profile);
    }
    
    updateProfileDisplay();
}

function updateProfileNavbar() {
    const currentUser = localStorage.getItem('sampahindah_currentUser');
    const userNameElement = document.getElementById('profileUserName');
    
    if (userNameElement && currentUser) {
        userNameElement.textContent = currentUser.split('@')[0];
    }
}

function setupProfileLogout() {
    document.getElementById('profileLogoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin logout?')) {
            localStorage.removeItem('sampahindah_loggedIn');
            localStorage.removeItem('sampahindah_currentUser');
            window.location.href = 'index.html';
        }
    });
}

let tarikTunaiInitialized = false;
// ===== DATA MANAGER DENGAN LOCALSTORAGE =====
class SampahIndahStorage {
    constructor() {
        this.initializeData();
    }
    
    initializeData() {
        // Inisialisasi data default jika belum ada
        if (!localStorage.getItem('sampahindah_profile')) {
            const defaultProfile = {
                id: this.generateID(),
                nama: 'Ahmad Wijaya',
                email: 'ahmad.wijaya@email.com',
                telepon: '081234567890',
                alamat: 'Jl. Raya Mojokerto No. 123, Mojokerto',
                saldo: 0,
                totalSampah: 0,
                totalPendapatan: 0,
                joinDate: new Date().toISOString()
            };
            this.saveProfile(defaultProfile);
        }
        
        if (!localStorage.getItem('sampahindah_transactions')) {
            this.saveTransactions([]);
        }
        
        if (!localStorage.getItem('sampahindah_penjemputan')) {
            this.savePenjemputan([]);
        }
    }
    
    // ===== PROFILE MANAGEMENT =====
    getProfile() {
        return JSON.parse(localStorage.getItem('sampahindah_profile'));
    }
    
    saveProfile(profile) {
        localStorage.setItem('sampahindah_profile', JSON.stringify(profile));
    }
    
    updateProfile(updates) {
        const profile = this.getProfile();
        const updatedProfile = { ...profile, ...updates };
        this.saveProfile(updatedProfile);
        return updatedProfile;
    }
    
    updateSaldo(nominal) {
        const profile = this.getProfile();
        profile.saldo += nominal;
        profile.totalPendapatan += Math.max(0, nominal); // Hanya tambah jika positif
        this.saveProfile(profile);
        return profile.saldo;
    }
    
    updateStatistikSampah(berat) {
        const profile = this.getProfile();
        profile.totalSampah += berat;
        this.saveProfile(profile);
    }
    
    // ===== TRANSACTION MANAGEMENT =====
    getTransactions() {
        return JSON.parse(localStorage.getItem('sampahindah_transactions'));
    }
    
    saveTransactions(transactions) {
        localStorage.setItem('sampahindah_transactions', JSON.stringify(transactions));
    }
    
    addTransaction(transaction) {
        const transactions = this.getTransactions();
        transaction.id = this.generateID();
        transaction.tanggal = new Date().toLocaleString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        transaction.timestamp = new Date().getTime();
        
        transactions.unshift(transaction);
        this.saveTransactions(transactions);
        return transaction;
    }
    
    // ===== PENJEMPUTAN MANAGEMENT =====
    getPenjemputan() {
        return JSON.parse(localStorage.getItem('sampahindah_penjemputan'));
    }
    
    savePenjemputan(penjemputan) {
        localStorage.setItem('sampahindah_penjemputan', JSON.stringify(penjemputan));
    }
    
    addPenjemputan(request) {
        const penjemputan = this.getPenjemputan();
        request.id = this.generateID();
        request.tanggal = new Date().toLocaleString('id-ID');
        request.status = 'pending';
        request.timestamp = new Date().getTime();
        
        penjemputan.unshift(request);
        this.savePenjemputan(penjemputan);
        return request;
    }
    
    // ===== UTILITY FUNCTIONS =====
    generateID() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    getRiwayatTerbaru(limit = 5) {
        const transactions = this.getTransactions();
        return transactions
            .filter(t => t.jenis === 'tukar_sampah')
            .slice(0, limit);
    }
    
    getTotalTransaksi() {
        const transactions = this.getTransactions();
        return transactions.filter(t => t.jenis === 'tukar_sampah').length;
    }
    
    getDampakLingkungan() {
        const profile = this.getProfile();
        const totalSampah = profile.totalSampah;
        
        return {
            pohon: Math.floor(totalSampah * 0.1),
            air: Math.floor(totalSampah * 50),
            co2: Math.floor(totalSampah * 2.5),
            energi: Math.floor(totalSampah * 15)
        };
    }
}

// ===== INITIALIZE STORAGE =====
const storage = new SampahIndahStorage();

// ===== DATA KONFIGURASI =====
const hargaSampah = {
    'plastik': 10000, 'kertas': 5000, 'logam': 20000, 
    'kaca': 5000, 'ewaste': 32000,
};

const deskripsiSampah = {
    'plastik': 'Plastik (PET, HDPE, PVC, LDPE, PP)',
    'kertas': 'Kertas (Koran, Kardus, Kertas Kantor)',
    'logam': 'Logam (Kaleng Aluminium, Baja, Tembaga)',
    'kaca': 'Kaca (Botol, Toples)',
    'ewaste': 'E-Waste (Ponsel, Komputer, Baterai)',
};

// ===== UTILITY FUNCTIONS =====
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.alert-notification');
    if (existingAlert) existingAlert.remove();

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-notification alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
        <i class="fas ${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    setTimeout(() => { if (alert.parentNode) alert.remove(); }, 5000);
}

function getAlertIcon(type) {
    const icons = { 
        'success': 'fa-check-circle', 
        'warning': 'fa-exclamation-triangle', 
        'info': 'fa-info-circle', 
        'danger': 'fa-times-circle' 
    };
    return icons[type] || 'fa-info-circle';
}

// ===== TUKAR SAMPAH =====
function initTukarSampah() {
    const jenisSampahSelect = document.getElementById('jenisSampah');
    const beratSampahInput = document.getElementById('beratSampah');
    const hargaInfo = document.getElementById('hargaInfo');
    const hitungBtn = document.getElementById('hitungBtn');
    const tukarBtn = document.getElementById('tukarBtn');
    const hasilKonversi = document.getElementById('hasilKonversi');
    const jumlahUang = document.getElementById('jumlahUang');
    const detailKonversi = document.getElementById('detailKonversi');

    let currentData = { jenis: '', berat: 0, total: 0 };

    // Event listeners
    jenisSampahSelect.addEventListener('change', function() {
        currentData.jenis = this.value;
        if (currentData.jenis && hargaSampah[currentData.jenis]) {
            const harga = hargaSampah[currentData.jenis];
            hargaInfo.innerHTML = `<strong>${deskripsiSampah[currentData.jenis]}</strong><br>${formatRupiah(harga)} per kg`;
            hitungBtn.disabled = !beratSampahInput.value || parseFloat(beratSampahInput.value) < 0.1;
        } else {
            hargaInfo.textContent = 'Pilih jenis sampah untuk melihat harga per kg';
            hitungBtn.disabled = true;
        }
        hasilKonversi.style.display = 'none';
        tukarBtn.disabled = true;
    });

    beratSampahInput.addEventListener('input', function() {
        currentData.berat = parseFloat(this.value) || 0;
        hitungBtn.disabled = !(currentData.berat >= 0.1 && currentData.jenis);
        if (hasilKonversi.style.display !== 'none') {
            hasilKonversi.style.display = 'none';
            tukarBtn.disabled = true;
        }
    });

    hitungBtn.addEventListener('click', function() {
        if (!currentData.jenis || currentData.berat < 0.1) {
            showAlert('Mohon pilih jenis sampah dan masukkan berat minimal 0.1 kg', 'warning');
            return;
        }

        const hargaPerKg = hargaSampah[currentData.jenis];
        currentData.total = Math.round(currentData.berat * hargaPerKg);
        
        jumlahUang.textContent = formatRupiah(currentData.total);
        detailKonversi.textContent = `${currentData.berat} kg × ${formatRupiah(hargaPerKg)}`;
        
        hasilKonversi.style.display = 'block';
        hasilKonversi.classList.add('success-animation');
        tukarBtn.disabled = false;
        
        setTimeout(() => hasilKonversi.classList.remove('success-animation'), 600);
    });

    document.getElementById('tukarSampahForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (!currentData.jenis || !currentData.berat || currentData.total === 0) {
            showAlert('Silakan hitung konversi terlebih dahulu', 'warning');
            return;
        }
        prosesTukarSampah(currentData.jenis, currentData.berat, currentData.total);
    });

    loadRiwayatTerbaru();
}

function prosesTukarSampah(jenis, berat, total) {
    const tukarBtn = document.getElementById('tukarBtn');
    const originalText = tukarBtn.innerHTML;
    
    // Tampilkan loading
    tukarBtn.classList.add('btn-loading');
    tukarBtn.disabled = true;
    
    setTimeout(() => {
        try {
            // Update saldo
            storage.updateSaldo(total);
            storage.updateStatistikSampah(berat);
            
            // Simpan transaksi
            storage.addTransaction({
                jenis: 'tukar_sampah',
                deskripsi: `Tukar ${berat} kg ${deskripsiSampah[jenis]}`,
                jumlah: total,
                status: 'berhasil',
                detail: { jenis, berat, hargaPerKg: hargaSampah[jenis] }
            });
            
            // Reset form
            document.getElementById('tukarSampahForm').reset();
            document.getElementById('hasilKonversi').style.display = 'none';
            document.getElementById('hitungBtn').disabled = true;
            
            showAlert(`Berhasil! ${berat} kg ${deskripsiSampah[jenis]} ditukar dengan ${formatRupiah(total)}`, 'success');
            
        } catch (error) {
            showAlert('Terjadi kesalahan saat menyimpan transaksi', 'danger');
        }
        
        // Reset tombol
        tukarBtn.classList.remove('btn-loading');
        tukarBtn.innerHTML = originalText;
        tukarBtn.disabled = true;
        
        // Update UI
        loadRiwayatTerbaru();
        updateProfileDisplay();
        
    }, 1500);
}

function loadRiwayatTerbaru() {
    const riwayat = storage.getRiwayatTerbaru(3);
    const riwayatList = document.getElementById('riwayatList');
    const riwayatContainer = document.getElementById('riwayatTerbaru');
    
    if (riwayat.length === 0) {
        riwayatContainer.style.display = 'none';
        return;
    }
    
    riwayatContainer.style.display = 'block';
    riwayatList.innerHTML = riwayat.map(item => `
        <div class="riwayat-item">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="riwayat-jenis">${item.deskripsi}</div>
                    <div class="riwayat-tanggal">${item.tanggal}</div>
                </div>
                <div class="riwayat-total">${formatRupiah(item.jumlah)}</div>
            </div>
        </div>
    `).join('');
}

// ===== PROFILE SECTION =====
function initProfile() {
    updateProfileDisplay();
}

function updateProfileDisplay() {
    const profile = storage.getProfile();
    const dampak = storage.getDampakLingkungan();
    
    // Update informasi profile
    document.getElementById('profileNama').textContent = profile.nama;
    document.getElementById('profileEmail').textContent = profile.email;
    document.getElementById('profileTelepon').textContent = profile.telepon;
    document.getElementById('profileAlamat').textContent = profile.alamat;
    
    // Update statistik
    document.getElementById('totalSampah').textContent = `${profile.totalSampah.toFixed(1)} kg`;
    document.getElementById('totalPendapatan').textContent = formatRupiah(profile.totalPendapatan);
    document.getElementById('transaksiBerhasil').textContent = storage.getTotalTransaksi();
    document.getElementById('saldoSaatIni').textContent = formatRupiah(profile.saldo);
    document.getElementById('saldoTersedia').textContent = formatRupiah(profile.saldo);
    
    // Update dampak lingkungan
    document.getElementById('pohonTerselamatkan').textContent = dampak.pohon;
    document.getElementById('airTerjaga').textContent = dampak.air;
    document.getElementById('co2Berkurang').textContent = dampak.co2;
    document.getElementById('energiTerhemat').textContent = dampak.energi;
}

// ===== TARIK TUNAI =====
function initTarikTunai() {
    if (tarikTunaiInitialized) return;
    tarikTunaiInitialized = true;

    const metodeSelect = document.getElementById('metodePembayaran');
    const detailBank = document.getElementById('detailBank');
    
    metodeSelect.addEventListener('change', function() {
        detailBank.style.display = this.value === 'bank' ? 'block' : 'none';
    });

    document.getElementById('tarikTunaiForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const jumlah = parseInt(document.getElementById('jumlahTarik').value);
        const metode = document.getElementById('metodePembayaran').value;
        const profile = storage.getProfile();
        
        if (jumlah < 10000) {
            showAlert('Minimal penarikan adalah Rp 10.000', 'warning');
            return;
        }
        
        if (jumlah > profile.saldo) {
            showAlert('Saldo tidak mencukupi untuk penarikan ini', 'danger');
            return;
        }
        
        prosesTarikTunai(jumlah, metode);
    });

    updateProfileDisplay();
}

function prosesTarikTunai(jumlah, metode) {
    const tarikBtn = document.querySelector('#tarikTunaiForm button[type="submit"]');
    const originalText = tarikBtn.innerHTML;
    
    // Tampilkan loading
    tarikBtn.classList.add('btn-loading');
    tarikBtn.disabled = true;
    
    setTimeout(() => {
        try {
            // Update saldo
            storage.updateSaldo(-jumlah);
            
            // Simpan transaksi
            storage.addTransaction({
                jenis: 'tarik_tunai',
                deskripsi: `Tarik tunai via ${metode}`,
                jumlah: -jumlah,
                status: 'berhasil',
                detail: { metode, jumlah }
            });
            
            showAlert(`Penarikan tunai ${formatRupiah(jumlah)} berhasil! Dana akan diproses dalam 1x24 jam.`, 'success');
            
            // Reset form
            document.getElementById('tarikTunaiForm').reset();
            document.getElementById('detailBank').style.display = 'none';
            
        } catch (error) {
            showAlert('Terjadi kesalahan saat proses penarikan', 'danger');
        }
        
        // Reset tombol
        tarikBtn.classList.remove('btn-loading');
        tarikBtn.innerHTML = originalText;
        tarikBtn.disabled = false;
        
        updateProfileDisplay();
        
    }, 2000);
}

// ===== PENJEMPUTAN SAMPAH =====
function initPenjemputan() {
    console.log('Initializing Penjemputan section');
    console.log('Penjemputan data:', storage.getPenjemputan());
    loadRiwayatPenjemputan();
    
    document.getElementById('requestJemputForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const tanggal = document.getElementById('tanggalJemput').value;
        const jenis = document.getElementById('jenisSampahJemput').value;
        const alamat = document.getElementById('alamatJemput').value;
        
        if (!tanggal || !jenis || !alamat) {
            showAlert('Harap lengkapi semua data permintaan penjemputan', 'warning');
            return;
        }
        
        prosesRequestPenjemputan(tanggal, jenis, alamat);
    });
}

function prosesRequestPenjemputan(tanggal, jenis, alamat) {
    const submitBtn = document.querySelector('#requestJemputForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Tampilkan loading
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        try {
            // Simpan request penjemputan
            storage.addPenjemputan({
                tanggalRequest: tanggal,
                jenisSampah: jenis,
                alamat: alamat,
                status: 'menunggu'
            });
            
            // Simpan transaksi
            storage.addTransaction({
                jenis: 'request_penjemputan',
                deskripsi: `Request jemput sampah ${jenis}`,
                jumlah: 0,
                status: 'menunggu',
                detail: { tanggal: tanggal, alamat: alamat }
            });
            
            showAlert('Request penjemputan sampah berhasil dikirim! Tim kami akan menghubungi Anda.', 'success');
            
            // Reset form
            document.getElementById('requestJemputForm').reset();
            
        } catch (error) {
            showAlert('Terjadi kesalahan saat mengirim request', 'danger');
        }
        
        // Reset tombol
        submitBtn.classList.remove('btn-loading');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        loadRiwayatPenjemputan();
        
    }, 1500);
}

function loadRiwayatPenjemputan() {
    const penjemputan = storage.getPenjemputan().slice(0, 5);
    const riwayatContainer = document.getElementById('riwayatPenarikan');
    const riwayatList = document.getElementById('riwayatPenarikanList');
    
    if (!riwayatContainer || !riwayatList) return;
    
    if (penjemputan.length === 0) {
        riwayatContainer.style.display = 'none';
        return;
    }
    
    riwayatContainer.style.display = 'block';
    riwayatList.innerHTML = penjemputan.map(item => `
        <div class="riwayat-item border-bottom pb-3 mb-3">
            <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                    <div class="riwayat-jenis fw-bold">Penjemputan ${item.jenisSampah}</div>
                    <div class="riwayat-detail text-muted small">${item.tanggalRequest} - ${item.alamat}</div>
                    <div class="riwayat-tanggal text-muted small">Request: ${item.tanggal}</div>
                </div>
                <div class="ms-3">
                    <span class="badge bg-${item.status === 'selesai' ? 'success' : item.status === 'diproses' ? 'primary' : 'warning'}">
                        ${item.status}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== RIWAYAT TRANSAKSI =====
function initRiwayat() {
    console.log('Initializing Riwayat section');
    console.log('Transactions data:', storage.getTransactions());
    loadRiwayatLengkap();
}

function loadRiwayatLengkap() {
    const transactions = storage.getTransactions();
    const tbody = document.getElementById('riwayatTransaksiBody');
    
    if (!tbody) return;
    
    if (transactions.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5 text-muted">
                    <i class="fas fa-inbox fa-3x mb-3 d-block"></i>
                    Belum ada transaksi
                </td>
            </tr>`;
        return;
    }
    
    tbody.innerHTML = transactions.map(item => `
        <tr>
            <td>${item.tanggal}</td>
            <td>${getJenisTransaksi(item.jenis)}</td>
            <td>${item.deskripsi}</td>
            <td class="${item.jumlah >= 0 ? 'text-success' : 'text-danger'} fw-bold">
                ${item.jumlah >= 0 ? '+' : ''}${formatRupiah(item.jumlah)}
            </td>
            <td><span class="badge bg-${getStatusColor(item.status)}">${item.status}</span></td>
        </tr>
    `).join('');
}

function getJenisTransaksi(jenis) {
    const types = {
        'tukar_sampah': 'Tukar Sampah',
        'tarik_tunai': 'Tarik Tunai',
        'request_penjemputan': 'Penjemputan'
    };
    return types[jenis] || jenis;
}

function getStatusColor(status) {
    const colors = {
        'berhasil': 'success',
        'menunggu': 'warning',
        'gagal': 'danger'
    };
    return colors[status] || 'secondary';
}

// ===== SIDEBAR NAVIGATION =====

function initSidebar() {
    const buttons = document.querySelectorAll('.sidebar button[data-target]');
    const sections = document.querySelectorAll('.content-section');

    // Function to load section
    function loadSection(target) {
        buttons.forEach(b => b.classList.remove('active'));
        sections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === target) {
                sec.classList.add('active');
                
                // Initialize section specific functions
                if (target === 'tukar-sampah') initTukarSampah();
                if (target === 'profile') initProfile();
                if (target === 'tarik-tunai') initTarikTunai();
                if (target === 'penjemputan') initPenjemputan();
                if (target === 'peta-banksampah') initPetaBankSampah();
                if (target === 'riwayat') initRiwayat();
            }
        });

        // Activate the corresponding button
        document.querySelector(`.sidebar button[data-target="${target}"]`).classList.add('active');
    }

    // Add click listeners to buttons
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            loadSection(target);
        });
    });

    // Load default section (tukar-sampah) on first load
    loadSection('tukar-sampah');

    // Logout handler
    document.querySelector('.sidebar .logout').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Apakah Anda yakin ingin logout?')) {
            localStorage.removeItem('sampahindah_loggedIn');
            localStorage.removeItem('sampahindah_currentUser');
            window.location.href = 'index.html';
        }
    });
}

function initPetaBankSampah() {
    // Placeholder untuk fungsi peta bank sampah
    console.log('Peta Bank Sampah section loaded');
}

// ===== RESET DATA (Untuk testing) =====
function resetData() {
    if (confirm('Reset semua data? Ini akan menghapus semua transaksi dan mengembalikan ke keadaan awal.')) {
        localStorage.removeItem('sampahindah_profile');
        localStorage.removeItem('sampahindah_transactions');
        localStorage.removeItem('sampahindah_penjemputan');
        storage.initializeData();
        updateProfileDisplay();
        loadRiwayatTerbaru();
        loadRiwayatLengkap();
        showAlert('Data berhasil direset', 'success');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initSidebar();
    initRiwayat();
    initUserManagement();

    // Untuk testing: tambah tombol reset di console
    window.resetSampahIndahData = resetData;
    
    console.log('SampahIndah Profile Page initialized');
    console.log('Data tersimpan di localStorage dengan key: sampahindah_profile, sampahindah_transactions, sampahindah_penjemputan');
    console.log('Untuk reset data, jalankan: resetSampahIndahData()');
});