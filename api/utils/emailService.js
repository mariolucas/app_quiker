const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
      tls: {
          rejectUnauthorized: false, // Aceita certificados autofirmados
      },
});

async function sendEmail(email) {
    const mailOptions = {
        to: email,
        subject: "Novo Comentário no seu Post",
        text: `Seu post recebeu um novo comentário!`
    };

    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
