const models = require('../models');
const { isEmpty } = require('../utils/nativeMethods');

//Obtiene lista de finanzas por siembra
const getFinances = async (req, res) => {
  try {
    const { params } = req;
    let sowingId = params.sowingId;

    const finances = await models.Finances.findAll({
      order: [['id', 'ASC']],
      where: {
        sowingId,
        statusDelete: false
      },
      include: {
        model: models.Sowing
      }
    });

    return res.status(201).send(finances);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const getFinancesById = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const finances = await models.Finances.findByPk(id);

    if (!finances) return res.status(404).send('Finances not found');

    return res.status(201).send(finances);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

const financesUpdate = async (req, res) => {
  try {
    const { params, body } = req;
    let id = params.id;
    let budget = body.budget;
    let expenditure = body.expenditure;
    let status = body.status;

    if (isEmpty(budget)) return res.status(400).send('budget is required');

    const financeFind = await models.Finances.findByPk(id);
    if (!financeFind) return res.status(404).send('Finances not found');

    const finUpdate = await models.Finances.update(
      {
        budget,
        expenditure,
        status
      },
      {
        where: {
          id
        }
      }
    );

    const harvest = await models.Harvest.findOne({
      where: {
        sowingId: financeFind.sowingId
      }
    });
    const finUp = await models.Finances.findByPk(id);

    console.log('esta es la csecha', harvest);
    console.log('esta es la finanza actualizada', finUp);

    if (harvest.amount !== null && finUp.expenditure !== null) {
      console.log('diferente de nulo el importe de la cosecha');
      let totalGain = harvest.amount - finUp.expenditure;
      console.log('IMPORTEEEE', harvest.amount);
      console.log('GASTOOO', finUp.expenditure);
      finUp.gain = totalGain;
      finUp.save();
    }

    if (finUpdate) return res.status(201).send('Finances has been update');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

//Eliminar Finanzas
const financesDelete = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const financeFind = await models.Finances.findByPk(id);

    if (!financeFind) return res.status(404).send('Finance not found');

    const financeDel = await models.Finances.update(
      {
        statusDelete: true
      },
      {
        where: {
          id
        }
      }
    );

    return res.status(201).send('Finance has been delete');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

module.exports= { getFinances, getFinancesById, financesUpdate, financesDelete };
