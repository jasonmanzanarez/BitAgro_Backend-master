const models = require('../models');
const { isEmpty } = require('../utils/nativeMethods');

const lotAdd = async (req, res) => {
  try {
    const { body, user } = req;
    let alias = body.alias;
    let address = body.address;
    let numHas = body.numHas;
    let typeAdq = body.typeAdq;
    let cost = body.cost;
    let userId = user.id;

    const userFind = await models.User.findByPk(userId);

    if (!userFind) return res.status(404).send('User not found');

    if (isEmpty(alias)) return res.status(400).send('Alias is required');
    if (isEmpty(address)) return res.status(400).send('Address is required');
    if (isEmpty(numHas))
      return res.status(400).send('Número de Hectáreas is required');
    if (isEmpty(typeAdq))
      return res.status(400).send('Tipo Adquisición is required');
    if (isEmpty(cost)) return res.status(400).send('Cost is required');

    console.log(userId);
    const lotCreate = await models.Lots.create({
      alias,
      address,
      numHas,
      typeAdq,
      cost,
      userId
    });

    if (lotCreate) return res.status(201).send(lotCreate);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const getLots = async (req, res) => {
  try {
    const { user } = req;
    const userId = user.id;
    let response = [];

    const getLot = await models.Lots.findAll({
      order: [['id', 'ASC']],
      where: {
        statusDelete: false,
        userId
      },
      include: {
        model: models.Sowing
      }
    });

    return res.status(201).send(getLot);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

const getLotById = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const lot = await models.Lots.findByPk(id);

    if (!lot) return res.status(404).send('Lot not found');

    return res.status(201).send(lot);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

const lotUpdate = async (req, res) => {
  try {
    const { params, body } = req;
    let id = params.id;
    let alias = body.alias;
    let address = body.address;
    let numHas = body.numHas;
    let typeAdq = body.typeAdq;
    let cost = body.cost;
    let status = body.status;

    const lotFind = await models.Lots.findByPk(id);

    if (!lotFind) return res.status(404).send('Lot not found');

    if (isEmpty(alias)) return res.status(400).send('Alias is required');
    if (isEmpty(address)) return res.status(400).send('Address is required');
    if (isEmpty(numHas))
      return res.status(400).send('Número de Hectáreas is required');
    if (isEmpty(typeAdq))
      return res.status(400).send('Tipo Adquisición is required');
    if (isEmpty(cost)) return res.status(400).send('Cost is required');

    const lotEdit = await models.Lots.update(
      {
        alias,
        address,
        numHas,
        typeAdq,
        cost,
        status
      },
      {
        where: {
          id
        }
      }
    );

    if (lotEdit) return res.status(201).send('Lot has been update');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Eliminar Lote
const lotDelete = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const lotFind = await models.Lots.findByPk(id);

    if (!lotFind) return res.status(404).send('Lot not found');

    const lotDel = await models.Lots.update(
      {
        statusDelete: true
      },
      {
        where: {
          id
        }
      }
    );

    return res.status(201).send('Lot has been delete');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

module.exports = { lotAdd, getLots, getLotById, lotUpdate, lotDelete };
