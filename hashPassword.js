// hashPassword.js
const bcrypt = require('bcryptjs');

const plainPassword = 'ruangriungadminX2023'; // GANTI INI dengan kata sandi admin Anda yang sebenarnya!
const saltRounds = 10; // Semakin tinggi nilainya, semakin aman, tapi lebih lambat

bcrypt.hash(plainPassword, saltRounds, function(err, hash) {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }
    console.log('Hash Kata Sandi Anda:');
    console.log(hash);
});