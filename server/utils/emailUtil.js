const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const keys = require('../config/keys');

//Credenciales al crear usuario
const getTemplateAccountUser = async (name, content, email, password, url) => {
  try {
    if (
      content === undefined ||
      content === null ||
      content === '' ||
      typeof content !== 'string'
    )
      throw new Error('Content must not be empty');

    const filename = path.join(__dirname, '/template/usersAccount.html');
    let emailBody = await fs.readFile(filename, 'utf-8');

    emailBody = emailBody.replace('{%content%}', content);
    emailBody = emailBody.replace('{%name%}', name);
    emailBody = emailBody.replace('{%email%}', email);
    emailBody = emailBody.replace('{%password%}', password);
    emailBody = emailBody.replace('{%url%}', url);
    return emailBody;
  } catch (error) {
    throw new Error(error);
  }
};

const getTemplateResetPassword = async (name, content, url) => {
  try {
    if (
      content === undefined ||
      content === null ||
      content === '' ||
      typeof content !== 'string'
    )
      throw new Error('Content must not be empty');

    const filename = path.join(__dirname, '/template/resetPassword.html');
    let emailBody = await fs.readFile(filename, 'utf-8');

    emailBody = emailBody.replace('{%content%}', content);
    emailBody = emailBody.replace('{%name%}', name);
    emailBody = emailBody.replace('{%url%}', url);
    return emailBody;
  } catch (error) {
    throw new Error(error);
  }
};

const sendMail = async (emailTo, subject, body, attachments = []) => {
  try {
    const transport = await nodemailer.createTransport({
      host: keys.emailHost,
      port: keys.emailPort,
      secure: keys.emailSecure,
      auth: {
        user: keys.emailUser,
        pass: keys.passwordemailUser
      }
    });

    const mailOptions = {
      from: keys.emailUser,
      to: emailTo,
      subject: subject,
      html: body,
      attachments: attachments
    };

    const info = await transport.sendMail(mailOptions);
    console.log(info);

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log('ERROR FROM Send Mail');
    console.log(error);
    throw new Error(error);
  }
};

export { sendMail, getTemplateAccountUser, getTemplateResetPassword };
