document.addEventListener('DOMContentLoaded', () => {
    const spinSound = new Audio('spin-sound.wav');
    const resultSound = new Audio('result-sound.wav');

    const historyList = document.getElementById('historyList');
    const historyEmptyState = document.getElementById('historyEmpty');
    const clearHistoryButton = document.getElementById('clearHistory');

    const presetGrid = document.getElementById('presetGrid');
    const presets = [
        {
            title: 'Pembagian Kelompok',
            emoji: '👥',
            items: ['Kelompok 1', 'Kelompok 2', 'Kelompok 3', 'Kelompok 4', 'Kelompok 5']
        },
        {
            title: 'Games Ice Breaking',
            emoji: '🎉',
            items: ['Tebak Kata', 'Tantangan Menari', 'Bernyanyi', 'Joget Bebas', 'Cerita Lucu']
        },
        {
            title: 'Hadiah Doorprize',
            emoji: '🎁',
            items: ['Voucher Belanja', 'Merchandise', 'Tumbler Eksklusif', 'Snack Box', 'Pulsa 100K']
        },
        {
            title: 'Rencana Makan Siang',
            emoji: '🍱',
            items: ['Nasi Goreng', 'Ayam Bakar', 'Sushi', 'Bakso', 'Salad Buah']
        },
        {
            title: 'Ide Konten',
            emoji: '💡',
            items: ['Tips Produktif', 'Cerita Komunitas', 'Tutorial Singkat', 'Behind The Scene', 'Fun Fact']
        },
        {
            title: 'Truth or Dare',
            emoji: '🎯',
            items: ['Truth', 'Dare']
        }
    ];

    const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });

    presets.forEach((preset) => {
        const button = document.createElement('button');
        button.className = 'preset-item';
        button.type = 'button';
        button.innerHTML = `
            <strong>${preset.emoji} ${preset.title}</strong>
            <span>${preset.items.length} pilihan siap pakai</span>
        `;
        button.addEventListener('click', () => {
            const textarea = document.getElementById('inputText');
            textarea.value = preset.items.join(', ');
            textarea.dispatchEvent(new Event('input'));
            toast.fire({ icon: 'info', title: `${preset.title} dimuat` });
        });
        presetGrid.appendChild(button);
    });

    let availableItems = [];

    const updateHistoryEmptyState = () => {
        historyEmptyState.style.display = historyList.children.length === 0 ? 'block' : 'none';
    };

    updateHistoryEmptyState();

    const addToHistory = (result) => {
        const li = document.createElement('li');
        const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        li.innerHTML = `
            <span class="history-badge">#${historyList.children.length + 1}</span>
            <span>${result}</span>
            <span class="history-time">${timestamp}</span>
        `;
        historyList.appendChild(li);
        updateHistoryEmptyState();
    };

    clearHistoryButton.addEventListener('click', () => {
        historyList.innerHTML = '';
        availableItems = [];
        updateHistoryEmptyState();
        toast.fire({ icon: 'success', title: 'History dibersihkan' });
    });

    const customButtonText = document.getElementById('customButtonText');
    customButtonText.addEventListener('input', function () {
        const customText = this.value;
        document.getElementById('buttonText').textContent = customText || 'Putar!';
    });

    const inputText = document.getElementById('inputText');
    inputText.addEventListener('input', function () {
        availableItems = [];
    });

    const themeToggle = document.getElementById('themeToggle');
    const logoImage = document.getElementById('logoImage');

    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            logoImage.src = 'logo-dark.png';
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        } else {
            logoImage.src = 'logo-light.png';
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
    });

    const spinDurationInput = document.getElementById('spinDuration');
    const spinDurationValue = document.getElementById('spinDurationValue');
    const allowRepeatCheckbox = document.getElementById('allowRepeat');

    spinDurationInput.addEventListener('input', () => {
        spinDurationValue.textContent = spinDurationInput.value;
    });

    const syncToggleState = () => {
        allowRepeatCheckbox.setAttribute('aria-checked', allowRepeatCheckbox.checked.toString());
    };

    allowRepeatCheckbox.addEventListener('change', syncToggleState);
    syncToggleState();

    document.getElementById('resetButton').addEventListener('click', () => {
        inputText.value = '';
        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'none';
        resultDiv.textContent = '';
        historyList.innerHTML = '';
        availableItems = [];
        updateHistoryEmptyState();
        toast.fire({ icon: 'success', title: 'Spinner di-reset' });
    });

    document.getElementById('spinButton').addEventListener('click', () => {
        const items = inputText.value
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0);

        if (items.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Input kosong',
                text: 'Masukkan minimal satu pilihan sebelum memutar spinner.'
            });
            return;
        }

        const allowRepeat = allowRepeatCheckbox.checked;

        if (!allowRepeat && availableItems.length === 0) {
            availableItems = [...items];
        }

        if (!allowRepeat && availableItems.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Semua pilihan sudah terambil',
                text: 'Tekan reset atau aktifkan opsi "Izinkan hasil terulang" untuk memulai lagi.'
            });
            return;
        }

        const pool = allowRepeat ? items : availableItems;

        if (pool.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Tidak ada pilihan tersedia',
                text: 'Silakan tambahkan pilihan baru atau reset spinner.'
            });
            return;
        }

        const spinButton = document.getElementById('spinButton');
        spinButton.disabled = true;
        document.getElementById('buttonText').textContent = 'Memutar...';
        document.getElementById('spinnerIcon').style.display = 'inline-block';
        document.getElementById('progressBar').style.display = 'block';

        spinSound.currentTime = 0;
        spinSound.play();

        const progressBarFill = document.getElementById('progressBarFill');
        const spinDuration = parseInt(spinDurationInput.value, 10) * 1000;
        const startTime = Date.now();

        const updateProgressBar = () => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min((elapsedTime / spinDuration) * 100, 100);
            progressBarFill.style.width = `${progress}%`;

            if (elapsedTime < spinDuration) {
                requestAnimationFrame(updateProgressBar);
            }
        };

        progressBarFill.style.width = '0';
        updateProgressBar();

        const resultDiv = document.getElementById('result');
        resultDiv.style.display = 'block';
        resultDiv.textContent = 'Memutar...';

        const spinInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * pool.length);
            resultDiv.textContent = pool[randomIndex];
        }, 120);

        setTimeout(() => {
            clearInterval(spinInterval);
            const randomIndex = Math.floor(Math.random() * pool.length);
            const result = pool[randomIndex];
            resultDiv.innerHTML = `<span class="hasil-text">Hasil:</span> ${result}`;

            if (!allowRepeat) {
                const removeIndex = availableItems.indexOf(result);
                if (removeIndex > -1) {
                    availableItems.splice(removeIndex, 1);
                }
            }

            Swal.fire({
                icon: 'success',
                title: 'Hasil Acak',
                text: `Selamat! Hasilnya adalah: ${result}`,
                confirmButtonText: 'Oke'
            }).then(() => {
                confetti({
                    particleCount: 160,
                    spread: 75,
                    origin: { y: 0.6 },
                    colors: ['#6366f1', '#22c55e', '#f97316']
                });
                resultSound.currentTime = 0;
                resultSound.play();
            });

            addToHistory(result);

            spinButton.disabled = false;
            document.getElementById('buttonText').textContent = customButtonText.value || 'Putar!';
            document.getElementById('spinnerIcon').style.display = 'none';
            document.getElementById('progressBar').style.display = 'none';
            progressBarFill.style.width = '0';
        }, spinDuration);
    });

    document.getElementById('currentYear').textContent = new Date().getFullYear();
});
