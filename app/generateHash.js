import bcrypt from 'bcryptjs';

const password = 'securepassword'; // Remplacez par votre mot de passe à hacher
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log('Hashed password:', hash);
});