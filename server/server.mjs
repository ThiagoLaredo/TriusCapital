import dotenv from 'dotenv';
dotenv.config();

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);

import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import cors from 'cors';

const app = express();
const port = 5000; // Porta configurada para 5000

app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
  console.log("Recebendo requisição:", req.body);
  const { nome, email, whatsapp, motivo, mensagem } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: 'olatuthinking@gmail.com',
    subject: `Mensagem de ${nome}`,
    text: `Nome: ${nome}\nEmail: ${email}\nWhatsApp: ${whatsapp}\nMotivo: ${motivo}\nMensagem: ${mensagem}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erro ao enviar email:", error);
      return res.status(500).send(error.toString());
    }
    console.log("Email enviado com sucesso:", info.response);
    res.status(200).send('Email enviado com sucesso: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
