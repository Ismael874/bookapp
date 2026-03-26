const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT == 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendNewBookEmail = async (authorEmail, authorName, bookTitle) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: authorEmail,
      subject: '¡Nuevo libro publicado!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Estimado/a ${authorName},</h2>
          <p>Nos complace informarle que se ha publicado un nuevo libro bajo su autoría:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #007bff; margin: 0;">${bookTitle}</h3>
          </div>
          <p>Puede ver los detalles del libro en nuestra plataforma.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">Este es un mensaje automático, por favor no responder.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
};

module.exports = { sendNewBookEmail };