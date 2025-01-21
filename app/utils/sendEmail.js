import nodemailer from "nodemailer";

/**
 * Fonction pour envoyer un email.
 * @param {Object} options - Les options pour l'email.
 * @param {string} options.to - Destinataire de l'email.
 * @param {string} options.subject - Sujet de l'email.
 * @param {string} options.html - Contenu HTML de l'email.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    // Configurer le transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail", // ou un autre service comme Mailgun, SMTP, etc.
      auth: {
        user: process.env.EMAIL_USER, // Adresse email de l'expéditeur
        pass: process.env.EMAIL_PASSWORD, // Mot de passe ou clé d'application
      },
    });

    // Options de l'email
    const mailOptions = {
      from: `"La Pince" <${process.env.EMAIL_USER}>`, // Expéditeur
      to, // Destinataire
      subject, // Sujet
      html, // Contenu HTML
    };

    // Envoyer l'email
    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${to}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    throw new Error("Erreur lors de l'envoi de l'email.");
  }
};

export default sendEmail;