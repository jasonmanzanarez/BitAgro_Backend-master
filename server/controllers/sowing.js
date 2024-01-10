const models = require('../models');
const { isEmpty } = require('../utils/nativeMethods');

const getSowing = async (req, res) => {
  try {
    const { params } = req;
    let lotId = params.lotId;

    const listSowing = await models.Sowing.findAll({
      order: [['id', 'ASC']],
      where: {
        lotId,
        statusDelete: false
      },
      include: [
        { model: models.Lots },
        { model: models.Cycles },
        { model: models.Binnacle },
        { model: models.Finances },
        { model: models.Harvest }
      ]
    });

    return res.status(201).send(listSowing);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const sowingAll = async (req, res) => {
  try {
    console.log('ejecutanoddddddd');
    const sowing = await models.Sowing.findAll({
      order: [['id', 'ASC']],
      where: {
        status: true,
        statusDelete: false
      },
      include: [{ model: models.Finances }]
    });
    console.log(sowing);

    return res.status(201).send(sowing);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const getSowingById = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const sowing = await models.Sowing.findByPk(id);

    if (!sowing) return res.status(404).send('Sowing not found');

    return res.status(201).send(sowing);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

const addSowing = async (req, res) => {
  try {
    const { body } = req;
    let alias = body.alias;
    let crops = body.crops;
    let lotId = body.lotId;
    let cycleId = body.cycleId;
    let budget = body.budget;

    if (isEmpty(alias)) return res.status(400).send('Alias is required');
    if (isEmpty(crops)) return res.status(400).send('Crop is required');
    if (isEmpty(lotId)) return res.status(400).send('lotId is required');
    if (isEmpty(cycleId)) return res.status(400).send('cycleId is required');
    if (isEmpty(budget)) return res.status(400).send('budget is required');

    const lot = await models.Lots.findByPk(lotId);
    if (!lot) return res.status.send(404).send('Lot is not found');

    const cycle = await models.Cycles.findByPk(cycleId);
    if (!cycle) return res.status.send(404).send('Cycle is not found');

    const response = await models.Sowing.create({
      alias,
      crops,
      lotId,
      cycleId
    });

    const harvest = await models.Harvest.create({
      sowingId: response.id
    });

    const finance = await models.Finances.create({
      budget,
      sowingId: response.id,
      harvestId: harvest.id
    });

    return res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const sowingUpdate = async (req, res) => {
  try {
    const { body, params } = req;
    let alias = body.alias;
    let crops = body.crops;
    let lotId = body.lotId;
    let cycleId = body.cycleId;
    let id = params.id;
    let status = body.status;

    if (isEmpty(alias)) return res.status(400).send('Alias is required');
    if (isEmpty(crops)) return res.status(400).send('Crop is required');
    if (isEmpty(lotId)) return res.status(400).send('lotId is required');
    if (isEmpty(cycleId)) return res.status(400).send('cycleId is required');

    const lot = await models.Lots.findByPk(lotId);
    if (!lot) return res.status.send(404).send('Lot is not found');

    const cycle = await models.Cycles.findByPk(cycleId);
    if (!cycle) return res.status.send(404).send('Cycle is not found');

    const sowing = await models.Sowing.findByPk(id);
    if (!sowing) return res.status(404).send('Sowing not found');

    const sowingUp = await models.Sowing.update(
      {
        alias,
        crops,
        lotId,
        cycleId,
        status
      },
      {
        where: {
          id
        }
      }
    );

    if (sowingUp) return res.status(201).send('Sowing has been update');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

//Eliminar Siembra
const sowingDelete = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const sowingFind = await models.Sowing.findByPk(id);

    if (!sowingFind) return res.status(404).send('Sowing not found');

    const sowingDel = await models.Sowing.update(
      {
        statusDelete: true
      },
      {
        where: {
          id
        }
      }
    );

    return res.status(201).send('Sowing has been delete');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Siembras activas por lote
const totalSowingsActive = async (req, res) => {
  try {
    const { params } = req;
    let lotId = params.lotId;

    const lot = await models.Lots.findByPk(lotId);

    if (!lot) return res.status(404).send('Lot not found');

    const sowingAll = await models.Sowing.findAll({
      where: {
        status: true,
        lotId
      }
    });

    const cant = sowingAll.length;

    console.log('cantidad', cant);

    const response = {
      total: cant
    };

    return res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};
module.exports= {
  getSowing,
  getSowingById,
  addSowing,
  sowingUpdate,
  sowingDelete,
  totalSowingsActive,
  sowingAll
};
