import nodemailer, { Transporter, SendMailOptions, SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmail = async (options: any): Promise<void> => {
  try {
    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Set mail options
    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    // Email sent
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
