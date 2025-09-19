import { sendMail } from "../utils/Email.js";

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const subject = `📩 New Contact Form Message from ${name}`;
  const body = `
    <h2>New Contact Form Message</h2>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email}</p>
    <p><b>Message:</b> ${message}</p>
  `;

  try {
    const to = process.env.EMAIL_TO;
    if (!to) {
      console.error("❌ EMAIL_TO env var is not set");
      return res.status(500).json({ success: false, error: "Server email is not configured" });
    }
    await sendMail(to, subject, body);
    res.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending contact form:", error);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};
