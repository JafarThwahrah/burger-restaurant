import nodemailer from "nodemailer";

// Create a transporter
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
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
    from: emailUser,
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
