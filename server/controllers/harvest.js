const models = require('../models');
const { isEmpty } = require('../utils/nativeMethods');

//Obtiene lista de cosecha por siembra
const getHarvest = async (req, res) => {
  try {
    const { params } = req;
    let sowingId = params.sowingId;

    const harvest = await models.Harvest.findAll({
      order: [['id', 'ASC']],
      where: {
        sowingId,
        statusDelete: false
      },
      include: {
        model: models.Sowing
      }
    });

    return res.status(201).send(harvest);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const getHarvestById = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const harvest = await models.Harvest.findByPk(id);

    if (!harvest) return res.status(404).send('Harvest not found');

    return res.status(201).send(harvest);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

const harvestUpdate = async (req, res) => {
  try {
    const { params, body } = req;
    let id = params.id;
    let ton = body.ton;
    let salePrice = body.salePrice;
    let amount = body.amount;
    let customer = body.customer;
    let status = body.status;

    const harvestFind = await models.Harvest.findByPk(id);
    if (!harvestFind) return res.status(404).send('Harvest not found');

    const finUpdate = await models.Harvest.update(
      {
        ton,
        salePrice,
        amount,
        customer,
        status
      },
      {
        where: {
          id
        }
      }
    );

    const harv = await models.Harvest.findByPk(id);

    const finance = await models.Finances.findOne({
      where: {
        sowingId: harv.sowingId
      }
    });

    if (finance.expenditure !== null && harv.amount !== null) {
      let totalGain = harv.amount - finance.expenditure;
      finance.gain = totalGain;
      finance.save();
    }

    if (finUpdate) return res.status(201).send('Harvest has been update');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

module.exports= { getHarvest, getHarvestById, harvestUpdate };
