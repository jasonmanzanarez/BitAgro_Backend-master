const bcrypt =require('bcryptjs');
const models = require('../models');
const jwt = require('jsonwebtoken');
const generatePassword = require('generate-password');
//import { sendMail, getTemplateResetPassword } from '../utils/emailUtil';
const { isEmpty } = require('../utils/nativeMethods');
const { seedToken, caducidadToken, hostBack, hostFront } = require('../config/keys');

//Login Users
const login = async (req, res) => {
  try {
    const { body } = req;
    let email = body.email;
    let password = body.password;

    if (isEmpty(email)) return res.status(400).send('Email is required');
    if (isEmpty(password)) return res.status(400).send('Password is required');

    const user = await models.User.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(401).send('Invalid credentials');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).send('Invalid credentials');
    }

    if (user.statusDelete === true) {
      return res.status(401).send('Account not found');
    }

    if (user.status === false) {
      return res.status(401).send('Your account is not activated');
    }

    const response = {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      statusDelete: user.statusDelete
    };

    let token = jwt.sign(
      {
        user: response
      },
      seedToken,
      { expiresIn: caducidadToken }
    );

    res.status(201).send({
      user: response,
      token: token
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const resetPasswordEmail = async (req, res) => {
  try {
    const { body } = req;
    let email = body.email;
    let resetPassword = generatePassword.generate({
      length: 12,
      numebers: true
    });

    if (isEmpty(email)) return res.status(400).send('Email is required');

    const user = await models.User.findOne({
      where: {
        email
      }
    });

    if (!user) return res.status(404).send('Email not found');

    const userUpdate = await models.User.update(
      {
        resetPasswordToken: resetPassword
      },
      {
        where: {
          email
        }
      }
    );

    let attachments = '';
    let url = `${hostBack}/api/user/resetPassword/${resetPassword}`;
    let content =
      'Usted ha solicitado restablecer su contraseña. ir al enlace para seguir con el proceso de restablecimiento.';
    const template = await getTemplateResetPassword(user.name, content, url);

    await sendMail(
      user.email,
      'Cuentas de usuario BitAgro',
      template,
      attachments
    );

    return res
      .status(201)
      .send('Se ha enviado correo para restablecer contraseña');
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

//Reset password validate password
const validateResetPassword = async (req, res) => {
  try {
    const { params } = req;
    let resetPassword = params.resetPassword;

    const user = await models.User.findOne({
      where: {
        resetPasswordToken: resetPassword
      }
    });

    if (!user) res.redirect(`${hostFront}/account/reset/password/invalidToken`);

    res.redirect(`${hostFront}/account/resetPassword/${resetPassword}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const confirmPassword = async (req, res) => {
  try {
    const { body, params } = req;
    let newPassword = body.newPassword;
    let confirmPassword = body.confirmPassword;
    let id = body.id;
    let resetPassword = body.resetPassword;
    let newResetPassword = generatePassword.generate({
      length: 12,
      numebers: true
    });

    if (isEmpty(newPassword))
      return res.status(400).send('New password is required');
    if (isEmpty(confirmPassword))
      return res.status(400).send('Confirm password is required');

    if (newPassword !== confirmPassword)
      return res.status(401).send('Password not match');

    let encPassword = bcrypt.hashSync(newPassword, 10);

    const userUpdate = models.User.update(
      {
        password: encPassword,
        resetPasswordToken: newResetPassword
      },
      {
        where: {
          resetPasswordToken: resetPassword
        }
      }
    );
    if (userUpdate) return res.status(201).send('Reset Password success');
  } catch (error) {
    return res.status(500).send(error);
  }
};
module.exports= { login, validateResetPassword, confirmPassword, resetPasswordEmail };
