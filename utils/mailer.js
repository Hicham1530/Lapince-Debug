import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: `"La Pince" <no-reply@lapince.com>`, // adresse fictive, pas besoin d'être réelle
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
  console.log("✅ E-mail envoyé avec succès !");
};