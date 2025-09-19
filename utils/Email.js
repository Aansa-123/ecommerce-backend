import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // literally "apikey"
    pass: process.env.SENDGRID_API_KEY, // your SendGrid API key
  },
});
console.log("SendGrid API Key:", process.env.SENDGRID_API_KEY ? "Loaded" : "Not Loaded");
export const sendMail = async (receiverEmail, subject, body) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM, // must be a verified sender in SendGrid
      to: receiverEmail,
      subject,
       text: body.replace(/<[^>]+>/g, ""),
      html: body,
    });
    console.log("✅ Email sent successfully to", receiverEmail);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw error;
  }
};
