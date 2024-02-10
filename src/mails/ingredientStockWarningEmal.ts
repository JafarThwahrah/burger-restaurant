import nodemailer from "nodemailer";

// Create a transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "jaffardawahreh2@gmail.com",
    pass: "dzft ftno mhmm scqi",
  },
});

// Send the email
export default async function sendEmail(
  to: string,
  subject: string,
  text: string
) {
  // Define your email message
  const mailOptions = {
    from: "jaffardawahreh2@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
}
