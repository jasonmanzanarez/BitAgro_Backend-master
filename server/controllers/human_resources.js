const models = require('../models');
const { isEmpty } = require('../utils/nativeMethods');

//Agregr personal
const hrAdd = async (req, res) => {
  try {
    const { body, user } = req;
    let name = body.name;
    let phone = body.phone;
    let salary = body.salary;
    let address = body.address;
    let userId = user.id;

    if (isEmpty(name)) return res.status(400).send('Name is required');
    if (isEmpty(phone)) return res.status(400).send('Phone is required');
    if (isEmpty(salary)) return res.status(400).send('Salary is required');
    if (isEmpty(address)) return res.status(400).send('Address is required');

    const hr = await models.Human_Resources.create({
      name,
      phone,
      salary,
      address,
      userId
    });

    if (hr) return res.status(201).send(hr);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

//Listar personal
const getHr = async (req, res) => {
  try {
    const { user } = req;
    let userId = user.id;

    const userFind = await models.User.findByPk(userId);

    if (!userFind) return res.status(404).send('User not found');

    const hrList = await models.Human_Resources.findAll({
      order: [['id', 'ASC']],
      where: {
        userId,
        statusDelete: false
      }
    });
    return res.status(201).send(hrList);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Obtener información de personal
const getHrById = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const hrFind = await models.Human_Resources.findByPk(id);

    if (!hrFind) return res.status(404).send('Human Resource not found');

    return res.status(201).send(hrFind);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Editar personal
const hrUpdate = async (req, res) => {
  try {
    const { params, body } = req;
    let id = params.id;
    let name = body.name;
    let phone = body.phone;
    let salary = body.salary;
    let address = body.address;

    const hrFind = await models.Human_Resources.findByPk(id);

    if (!hrFind) return res.status(404).send('Human Resource not found');

    if (isEmpty(name)) return res.status(400).send('Name is required');
    if (isEmpty(phone)) return res.status(400).send('Phone is required');
    if (isEmpty(salary)) return res.status(400).send('Salary is required');
    if (isEmpty(address)) return res.status(400).send('Address is required');

    const hrEdit = await models.Human_Resources.update(
      {
        name,
        phone,
        salary,
        address
      },
      {
        where: {
          id
        }
      }
    );

    if (hrEdit) return res.status(201).send('Human Resources has been update');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

//Eliminar personal
const hrDelete = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const hrFind = await models.Human_Resources.findByPk(id);

    if (!hrFind) return res.status(404).send('Human Resource not found');

    const hrDel = await models.Human_Resources.update(
      {
        statusDelete: true
      },
      {
        where: {
          id
        }
      }
    );

    return res.status(201).send('Human resource deleted');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};
module.exports = { hrAdd, getHr, getHrById, hrUpdate, hrDelete };
