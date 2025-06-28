
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route to handle contact form
app.post("/contact", async (req, res) => {
  const { from_name, from_email, message } = req.body;

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use 'Mailtrap', Outlook, etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: from_email,
    to: process.env.EMAIL_USER,
    subject: `New Message from ${from_name}`,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).send({ success: false, message: "Failed to send email" });
  }
});
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { from_name, from_email, message } = req.body;

  if (!from_name || !from_email || !message) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: from_email,
      to: process.env.EMAIL_USER,
      subject: `New Message from ${from_name}`,
      text: message,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ success: false, message: "Failed to send email" });
  }
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
