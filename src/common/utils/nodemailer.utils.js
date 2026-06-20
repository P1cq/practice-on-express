import nodemailer from "nodemailer";

export const sendEmail = async function ({ to, subject, html } = {}) {
  const trasporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "medoayman046@gmail.com",
      pass: "mzyi smtv dxwv xzyl",
    },
  });

  await trasporter.sendMail({
    from: '"SARAHA"<medoayman046@gmail.com>',
    to,
    subject,
    html,
  });
};
