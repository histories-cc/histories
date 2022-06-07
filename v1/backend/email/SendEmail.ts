import nodemailer from 'nodemailer';

const SendEmail = async (subject: string, html: string, target: string) => {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT!),
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try {
    await transport.sendMail({
      from: `histories <${process.env.MAIL_USERNAME}>`,
      to: target,
      subject,
      html,
    });
  } catch (error) {
    console.log(error);
  }
};

export default SendEmail;
