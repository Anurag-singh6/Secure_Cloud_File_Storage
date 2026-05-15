import nodemailer from "nodemailer";

const sendemail = async (to, subject, message) => {
  try {
    const transpotter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailoperation = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      html: message,
    };

    const res = await transpotter.sendMail(mailoperation);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
export default sendemail;
