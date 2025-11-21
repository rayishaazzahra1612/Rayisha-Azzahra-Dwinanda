
    // Penjelasan: Ini adalah event listener utama.
// Kode di dalamnya hanya akan berjalan setelah seluruh dokumen HTML
// selesai dimuat (DOMContentLoaded). Ini mencegah error JavaScript
// yang mencoba mengakses elemen HTML yang belum ada.
document.addEventListener('DOMContentLoaded', function() {
    
    // Penjelasan: Ini adalah tahap 'inisialisasi variabel'.
    // Kita mengambil elemen-elemen HTML menggunakan ID atau kelasnya
    // dan menyimpannya ke dalam variabel (const) agar mudah digunakan nanti.
    const display = document.getElementById('display');
    const statusImage = document.getElementById('statusImage');
    const buttons = document.querySelectorAll('.btn-calc'); // Mengambil SEMUA elemen dgn kelas .btn-calc

    // Penjelasan: Menyimpan URL gambar status ke dalam variabel
    // agar mudah diganti dan dikelola.
    // Modifikasi: Mengubah URL placeholder 'imgNormal' agar sesuai tema pink.
    const imgNormal = 'https://placehold.co/400x100/9d174d/FBCFE8?text=Kalkulator+Pink';
    const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
    const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

    /**
     * Penjelasan: Ini adalah sebuah fungsi bernama 'changeImage'.
     * Fungsinya adalah untuk mengubah gambar status (statusImage.src)
     * berdasarkan 'state' (parameter) yang diberikan ('success', 'error', atau lainnya).
     */
    function changeImage(state) {
        if (state === 'success') {
            statusImage.src = imgSuccess;
            statusImage.alt = "Perhitungan Sukses";
        } else if (state === 'error') {
            statusImage.src = imgError;
            statusImage.alt = "Error Perhitungan";
        } else {
            // Penjelasan: Jika state bukan 'success' atau 'error',
            // kembalikan gambar ke status normal (default).
            statusImage.src = imgNormal;
            statusImage.alt = "Status Kalkulator";
        }
    }

    /**
     * Penjelasan: Fungsi 'clearDisplay' (untuk tombol 'C').
     * Mengosongkan nilai di layar (display.value) menjadi string kosong
     * dan mengembalikan gambar status ke normal.
     */
    function clearDisplay() {
        display.value = '';
        changeImage('normal'); // Memanggil function untuk merubah gambar
    }

    /**
     * Penjelasan: Fungsi 'deleteLastChar' (untuk tombol 'DEL').
     * Menghapus 1 karakter terakhir dari string di layar
     * menggunakan metode .slice(0, -1).
     */
    function deleteLastChar() {
        display.value = display.value.slice(0, -1);
    }

    /**
     * Penjelasan: Fungsi 'appendToDisplay' (untuk tombol angka dan operator).
     * Menambahkan 'value' (nilai dari tombol yang diklik)
     * ke akhir string yang ada di layar.
     */
    function appendToDisplay(value) {
        display.value += value;
    }

    /**
     * Penjelasan: Fungsi 'calculateResult' (untuk tombol '=').
     * Ini adalah fungsi inti yang menghitung hasil.
     */
    function calculateResult() {
        // Penjelasan: Pengecekan awal, jika layar kosong saat '=' ditekan,
        // tampilkan error dan jangan lakukan apa-apa.
        if (display.value === '') {
            changeImage('error');
            display.value = 'Kosong!';
            // Penjelasan: 'setTimeout' menjalankan fungsi 'clearDisplay'
            // setelah jeda 1500 milidetik (1.5 detik).
            setTimeout(clearDisplay, 1500);
            return; // Hentikan eksekusi fungsi
        }

        try {
            // Penjelasan: 'try' mencoba menjalankan kode kalkulasi.
            // 'eval()' adalah fungsi bawaan JS yang mengeksekusi string sebagai kode.
            // Di sini, ia menghitung string matematika (misal "5*2+1").
            let result = eval(display.value
                // Penjelasan: Sebelum 'eval', ganti semua simbol '%'
                // dengan '/100' agar JS bisa menghitung persentase.
                .replace(/%/g, '/100') 
            ); 
            
            // Penjelasan: Cek apakah hasilnya valid (finite).
            // Ini untuk mencegah error seperti pembagian 0 (Infinity).
            if (isFinite(result)) {
                display.value = result;
                // Penjelasan: Jika berhasil, ubah gambar status jadi 'success'.
                changeImage('success'); 
            } else {
                throw new Error("Hasil tidak valid"); // Lempar error jika hasil 'Infinity'
            }

        } catch (error) {
            // Penjelasan: 'catch' akan berjalan jika blok 'try' gagal
            // (misal kalkulasi error seperti "5++2").
            console.error("Error kalkulasi:", error);
            display.value = 'Error';
            // Penjelasan: Tampilkan gambar status 'error'.
            changeImage('error'); 
            setTimeout(clearDisplay, 1500); // Bersihkan setelah 1.5 detik
        }
    }


    // Penjelasan: Logika utama untuk tombol (Button).
    // Kita 'forEach' (looping) semua tombol yang ada di variabel 'buttons'.
    buttons.forEach(button => {
        // Untuk setiap tombol, tambahkan event listener 'click'.
        button.addEventListener('click', () => {
            // Ambil nilai dari atribut 'data-value' tombol yang diklik.
            const value = button.getAttribute('data-value');

            // Penjelasan: 'switch' adalah cara rapi untuk menggantikan
            // 'if-else if' yang banyak. Kode ini mengecek 'value' tombol.
            switch(value) {
                case 'C':
                    // Penjelasan: Jika tombol 'C' diklik, panggil fungsi clearDisplay.
                    clearDisplay();
                    break;
                case 'DEL':
                    // Penjelasan: Jika tombol 'DEL' diklik, panggil fungsi deleteLastChar.
                    deleteLastChar();
                    break;
                case '=':
                    // Penjelasan: Jika tombol '=' diklik, panggil fungsi calculateResult.
                    calculateResult();
                    break;
                default:
                    // Penjelasan: 'default' berjalan untuk tombol lainnya (angka, operator).
                    // Jika layar baru saja menampilkan "Sukses" atau "Error",
                    // bersihkan dulu layarnya sebelum mengetik angka baru.
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(value); // Tambahkan nilai tombol ke layar
                    break;
            }
        });
    });

    // Penjelasan: Ini adalah event listener untuk input Keyboard.
    // 'keydown' mendeteksi tombol keyboard yang ditekan.
    document.addEventListener('keydown', (e) => {
        const key = e.key; // 'e.key' adalah nama tombol (misal "7" atau "Enter")

        // Jika tombol adalah angka, operator, atau titik
        if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                clearDisplay();
            }
            appendToDisplay(key);
            e.preventDefault(); // Mencegah browser melakukan aksi default
        } else if (key === 'Enter' || key === '=') {
            // Jika tombol 'Enter' atau '='
            calculateResult();
            e.preventDefault();
        } else if (key === 'Backspace') {
            // Jika tombol 'Backspace'
            deleteLastChar();
            e.preventDefault();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            // Jika tombol 'Escape' atau 'c'
            clearDisplay();
            e.preventDefault();
        }
    });

});