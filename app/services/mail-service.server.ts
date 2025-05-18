import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const mailService = {
  async sendMail(to: string, subject: string, html: string) {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.MAIL_USERNAME}>`,
      to,
      subject,
      html,
    });
    return info;
  },
};
