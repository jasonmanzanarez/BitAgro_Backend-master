const models = require('../models');
const { isEmpty } = require('../utils/nativeMethods');

//Agregar ciclo
const cycleAdd = async (req, res) => {
  try {
    const { body, user } = req;
    let name = body.name;
    let dateStart = body.dateStart;
    let dateFinish = body.dateFinish;
    let crops = body.crops;
    let userId = user.id;

    if (isEmpty(name)) return res.status(400).send('Name is required');
    if (isEmpty(dateStart))
      return res.status(400).send('Date Start is required');
    if (isEmpty(dateFinish))
      return res.status(400).send('Date Finish is required');
    if (isEmpty(crops)) return res.status(400).send('Crops is required');

    const cycleCreate = await models.Cycles.create({
      name,
      dateStart,
      dateFinish,
      crops,
      userId
    });

    if (cycleCreate) return res.status(201).send(cycleCreate);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Ciclos lista
const getCycles = async (req, res) => {
  try {
    const { user } = req;
    let userId = user.id;

    const cycles = await models.Cycles.findAll({
      order: [['id', 'ASC']],
      where: {
        userId,
        statusDelete: false
      }
    });

    return res.status(201).send(cycles);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Obtener ciclo por id
const getCycleById = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const cycle = await models.Cycles.findByPk(id);

    if (!cycle) return res.status(404).send('Cycle not found');

    return res.status(201).send(cycle);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Editar ciclo
const cycleUpdate = async (req, res) => {
  try {
    const { params, body } = req;
    let id = params.id;
    let name = body.name;
    let dateStart = body.dateStart;
    let dateFinish = body.dateFinish;
    let crops = body.crops;
    let status = body.status;

    const cycleFind = await models.Cycles.findByPk(id);

    if (!cycleFind) return res.status(404).send('Cycle not found');

    if (isEmpty(name)) return res.status(400).send('Name is required');
    if (isEmpty(dateStart))
      return res.status(400).send('Date Start is required');
    if (isEmpty(dateFinish))
      return res.status(400).send('Date Finish is required');
    if (isEmpty(crops)) return res.status(400).send('Crops is required');

    const cycleEdit = await models.Cycles.update(
      {
        name,
        dateStart,
        dateFinish,
        crops,
        status
      },
      {
        where: {
          id
        }
      }
    );

    if (cycleEdit) return res.status(201).send('Cycle has been update');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Eliminar Ciclo
const cycleDelete = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const cycleFind = await models.Cycles.findByPk(id);

    if (!cycleFind) return res.status(404).send('Cycle not found');

    const cycleDel = await models.Cycles.update(
      {
        statusDelete: true
      },
      {
        where: {
          id
        }
      }
    );

    return res.status(201).send('Cycle has been delete');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};
module.exports= { cycleAdd, getCycles, getCycleById, cycleUpdate, cycleDelete };
