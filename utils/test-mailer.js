import { sendEmail } from './mailer.js';// adapte selon l’endroit de ton mailer.js
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  try {
    await sendEmail({
      to: 'test@example.com',
      subject: 'Test Mailtrap ✅',
      text: 'Ceci est un test brut (texte simple).',
      html: '<h1>Ceci est un test <b>HTML</b></h1><p>Envoyé avec succès via Mailtrap.</p>',
    });
    console.log('✅ Test d’envoi terminé.');
  } catch (error) {
    console.error('❌ Échec du test d’envoi :', error);
  }
})();