import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { from_name, from_email, message } = req.body;

  // Validate input
  if (!from_name || !from_email || !message) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Configure nodemailer with Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // e.g., ruhana.atiq@gmail.com
      pass: process.env.EMAIL_PASS, // app password from Gmail
    },
  });

  const mailOptions = {
    from: from_email,
    to: process.env.EMAIL_USER,
subject: `New Message from ${from_name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
}
