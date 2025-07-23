const FormData = require("form-data"); // form-data v4.0.1
import Mailgun from "mailgun.js"; // mailgun.js v11.1.0

type EmailParams = {
  to: string;
  subject: string;
  text: string;
};

export async function sendEmail({ to, subject, text }: EmailParams) {
  const mailgunDomain =
    process.env.MAILGUN_DOMAIN || "mailGunSandboxDomain.com";
  const mailgunApiKey = process.env.MAILGUN_API_KEY;
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: mailgunApiKey || "API_KEY",
    // When you have an EU-domain, you must specify the endpoint:
    url: "https://api.eu.mailgun.net",
  });
  const messageData = {
    from: `Massimiliano Porzio Codes <noreply@${mailgunDomain}>`,
    to,
    subject,
    text,
  };

  try {
    const data = await mg.messages.create(mailgunDomain, messageData);

    console.log(data); // logs response data
  } catch (error) {
    console.error(error); //logs any error
  }
}
