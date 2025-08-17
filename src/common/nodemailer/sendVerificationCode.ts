import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { generate } from 'randomstring';

export async function sendVerificationCodeMail(email: string) {
  const transport = createTransport({
    service: 'gmail',
    auth: {
      user: 'ahmadmayallo02@gmail.com',
      pass: process.env.NODE_MAILER_PASS,
    },
  });

  const code: string = generate({ length: 6, charset: 'hex' });
  const mailOptions: Mail.Options = {
    from: 'ahmadmayallo02@gmail.com',
    to: email,
    subject: 'Hello From Nodemailer',
    text: `This is Code to reset password don't share it ${code}`,
  };

  try {
    await transport.sendMail(mailOptions);
    return code;
  } catch (error) {
    console.error(`Error Sending Mail ${error}`);
    throw new Error(`Error Sending Mail ${error}`);
  }
}