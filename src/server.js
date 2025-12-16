const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const PORT = process.env.PORT || 5005;

console.log("EMAIL_USER:", EMAIL_USER);
console.log("EMAIL_PASS:", EMAIL_PASS);
console.log("PORT:", PORT);

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
  const { nome, email, whatsapp, motivo, mensagem } = req.body;

  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: 'olatuthinking@gmail.com',
    subject: `Mensagem de ${nome}`,
    text: `Nome: ${nome}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nMotivo: ${motivo}\nMensagem: ${mensagem}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar email:", error);
      res.status(500).send("Erro ao enviar e-mail.");
    } else {
      console.log("Email enviado com sucesso:", info.response);
      res.status(200).send("E-mail enviado com sucesso.");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
