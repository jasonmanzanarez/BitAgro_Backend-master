const models = require('../models');
const { isEmpty } = require('../utils/nativeMethods');
const generatePassword = require('generate-password');
const bcrypt = require('bcryptjs');
//import { sendMail, getTemplateAccountUser } from '../utils/emailUtil';
const { hostBack, hostFront } = require('../config/keys');

//Registro de usuario
const singUpUser = async (req, res) => {
  try {
    const { body } = req;
    let name = body.name;
    let lastName = body.lastName;
    let email = body.email;
    let password = body.password;
    // let password = generatePassword.generate({
    //   length: 10,
    //   numbers: true
    // });
    let token = generatePassword.generate({
      length: 12,
      numbers: true
    });
    let encPassword = bcrypt.hashSync(body.password, 10);

    if (isEmpty(name)) return res.status(400).send('Name is required');
    if (isEmpty(lastName)) return res.status(400).send('Last Name is required');
    if (isEmpty(email)) return res.status(400).send('Email is required');
    if (isEmpty(password)) return res.status(400).send('Password is required');

    const userExist = await models.User.findOne({
      where: {
        statusDelete: false,
        email: body.email
      }
    });

    if (userExist) return res.status(401).send('Email must be unique');

    const user = await models.User.create({
      name,
      lastName,
      email,
      password: encPassword,
      confirmToken: token,
      status: true
    });

    // let attachments = '';
    // let url = `${hostBack}/api/user/activation/${user.id}/${token}`;
    // const content = `
    //     <p>Ahora eres parte de BitAgro, esta contraseña es temporal, cambiela una vez que inicie sesión por primera vez. Para terminar el proceso de activación, 
    //     haga click en el siguiente enlace para confirmar su cuenta</p>
    //   `;
    // const template = await getTemplateAccountUser(
    //   user.name,
    //   content,
    //   user.email,
    //   password,
    //   url
    // );

    // await sendMail(
    //   user.email,
    //   'Cuentas de usuario BitAgro',
    //   template,
    //   attachments
    // );

    res.status(201).send('User created');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};
// Obtener usuario
const getUser = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const user = await models.User.findByPk(id, {
      attributes: [
        'id',
        'name',
        'lastName',
        'email',
        'phone',
        'status',
        'statusDelete'
      ]
    });

    if (!user) return res.status(404).send('User not found');

    return res.status(201).send(user);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Actualizar perfil
const updateUser = async (req, res) => {
  try {
    const { params, body } = req;
    let id = params.id;
    let name = body.name;
    let lastName = body.lastName;
    let email = body.email;
    let phone = null;

    const user = await models.User.findByPk(id);

    if (!user) return res.status(404).send('User not found');
    if (isEmpty(name)) return res.status(400).send('Name is required');
    if (isEmpty(lastName)) return res.status(400).send('Last name is required');
    if (isEmpty(email)) return res.status(400).send('Email is required');
    if (!isEmpty(body.phone)) phone = body.phone;

    if (email != user.email) {
      const emailFind = await models.User.findOne({
        where: {
          email
        }
      });
      if (emailFind) return res.status(401).send('Email already exist');
    }

    const userUpdate = await models.User.update(
      {
        name,
        lastName,
        email,
        phone
      },
      {
        where: {
          id
        }
      }
    );

    return res.status(201).send('User updated');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

//Update user password
const updatePassword = async (req, res) => {
  const { body, params } = req;
  try {
    const user = await models.User.findByPk(params.id);

    if (isEmpty(user)) return res.status(404).send('User not found');

    if (isEmpty(body.currentPassword))
      return res.status(400).send('Current password is required');
    if (isEmpty(body.newPassword))
      return res.status(400).send('New password is required');
    if (isEmpty(body.confirmPassword))
      return res.status(400).send('Confirm password is required');

    const currentPassword = body.currentPassword;
    const password = user.password;

    const match = bcrypt.compareSync(currentPassword, password);

    if (match === false) return res.status(401).send('Incorrect password');

    const newPassword = bcrypt.hashSync(body.newPassword, 10);
    const confirmPassword = body.confirmPassword;

    const match2 = bcrypt.compareSync(confirmPassword, newPassword);

    if (match2 === false) return res.status(401).send('No matches');

    const matchOldPassword = bcrypt.compareSync(currentPassword, newPassword);

    if (matchOldPassword === true)
      return res.status(401).send('You can not enter an old password');

    const userUpdated = await models.User.update(
      {
        password: newPassword
      },
      {
        where: {
          id: params.id
        }
      }
    );
    res.status(201).send('The password has been update');
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

//Eliminar cuenta de usuario
const deleteAccount = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const user = await models.User.findByPk(id);

    if (!user) return res.status(404).send('User not found');

    const deleteUser = await models.User.update(
      {
        statusDelete: true,
        status: false
      },
      {
        where: {
          id: id
        }
      }
    );

    if (deleteUser) return res.status(201).send('Account has been delete');
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

//Activación de cuenta
const validateTokenAccount = async (req, res) => {
  const { params } = req;
  try {
    let token = params.token;
    let userId = params.id;
    let newToken = generatePassword.generate({
      length: 12,
      numebers: true
    });
    const user = await models.User.findByPk(userId);

    if (!user) return res.status(404).send('User not found');

    if (user.status === false && user.confirmToken === token) {
      user.status = true;
      user.confirmToken = newToken;
      user.save();
      //Se redirecciona a una pagina que diga que se activo cuenta
      res.redirect(`${hostFront}/bitagro/account/validate/success`);
    } else {
      if (user.status === false && user.confirmToken != token) {
        //Se redirecciona a una pagina que diga que el token ha caducado
        res.redirect(`${hostFront}/bitagro/account/validate/invalidToken`);
      } else {
        //Se redirecciona a una pagina que diga que la cuenta ya habia sido activada antes
        res.redirect(`${hostFront}/bitagro/account/validate/activated`);
      }
    }
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

module.exports = {
  singUpUser,
  getUser,
  updateUser,
  updatePassword,
  deleteAccount,
  validateTokenAccount
};
