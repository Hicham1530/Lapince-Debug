import bcrypt from 'bcryptjs';
 // Pour chiffrer les mots de passe

const password = 'securepassword'; // Remplace par le mot de passe à hacher
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log('Hashed password:', hash);
});