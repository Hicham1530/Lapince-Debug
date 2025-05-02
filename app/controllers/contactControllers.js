import nodemailer from 'nodemailer';

const contactController = {
  sendMessage: async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      console.error("❌ Champs manquants dans le formulaire contact");
      return res.status(400).render("error", { message: "Tous les champs sont requis." });
    }

    try {
      const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "46ef1f36fedb3d",  // copié depuis ton compte
          pass: "531aaa2440358e"         // remplace par le vrai mot de passe complet (non masqué)
        }
      });

      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'hicham.guelzim@gmail.com',  // remplace par TON adresse à toi pour recevoir les messages
        subject: `Formulaire de contact : ${subject}`,
        text: `
Vous avez reçu un nouveau message depuis le formulaire de contact.

Nom : ${name}
Email : ${email}
Sujet : ${subject}

Message :
${message}
        `
      };

      await transporter.sendMail(mailOptions);

      console.log("✅ Email envoyé avec succès !");
      res.render("contact-confirm", { title: "Message envoyé" });
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi du mail :", error);
      res.status(500).render("error", { message: "Erreur lors de l'envoi du message. Essayez plus tard." });
    }
  }
};

export default contactController;