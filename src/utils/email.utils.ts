import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailUser = process.env.EMAIL_USER;
const emailAppPassword = process.env.EMAIL_APP_PASSWORD;

if (!emailUser || !emailAppPassword) {
    throw new Error("EMAIL_USER and EMAIL_APP_PASSWORD must be set to send email");
}

const transporter = nodemailer.createTransport({

    service: "gmail",
    auth: {
        user: emailUser,
        pass: emailAppPassword,
    },

});

export const sendEmailOtp = async (
    otp: string,
    email: string
) => {
    await transporter.sendMail({
        from: emailUser,
        to: email,
        subject: "Apply Flow - Email Verification",
    html: `
      <h2>Verify your email</h2>
      <p>Your verification OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP will expire in 10 minutes.</p>
    `,
    });
}
