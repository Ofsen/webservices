const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { sendMail } = require("./utils/mail.utils");
const { sendSMS } = require("./utils/sms.utils");
const { collectDefaultMetrics, register } = require("prom-client");

const app = express();
const port = 3011;

// Middleware to parse JSON requests
app.use(express.json());

app.use(bodyParser.json());

app.post("/confirm-email", ({ body }, res) => {
  try {
    sendMail({
      recepient: body.recepient,
      subject: "Confirmation d'e-mail",
      text: `Veuillez confirmer votre e-mail en cliquant sur le lien suivant : ${body.link}`,
      html: `Veuillez confirmer votre e-mail en cliquant sur le lien suivant : <a href="${body.link}">Valider mon addresse e-mail</a>`,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/reset-password", ({ body }, res) => {
  try {
    sendMail({
      recepient: body.recepient,
      subject: "Mot de passe oublié",
      text: `Veuillez utiliser le code ${body.code} pour réinitialiser votre mot de passe`,
      html: `Veuillez utiliser le code ${body.code} pour réinitialiser votre mot de passe`,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/send-sms", async ({ body }, res) => {
  try {
    await sendSMS(body.to, body.text);
    console.log("Message sent successfully");
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log("There was an error sending the messages");
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

//Stripe related
app.post("/send-invoice", async ({ body }, res) => {
  try {
    sendMail({
      recepient: body.recepient,
      subject: "Confirmation de paiement",
      text: `Votre paiment est confirmé, merci pour votre confiance`,
      html: `
        <div>
          <h1>Votre paiment est confirmé</h1>
          <p>Merci pour votre confiance</p>
          <a href=${body.invoiceUrl}>Votre Facture</a>
        </div>
      `,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/subs-created", async ({ body }, res) => {
  try {
    sendMail({
      recepient: body.recepient,
      subject: "Votre abbonnement est confirmé",
      text: `Nous vous confirmons que votre abbonnement a bien commencé`,
      html: `
        <div>
          <h1>Nous vous confirmons que votre abbonnement a bien commencé</h1>
          <p>Merci pour votre confiance</p>
        </div>
      `,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

collectDefaultMetrics();

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

app.listen(port, () => {
  console.log(`Server listening at http://ofsen.io:${port}`);
});
