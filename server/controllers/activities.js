const models = require('../models');
const { isEmpty } = require('../utils/nativeMethods');

const getActivitiesByBinnacle = async (req, res) => {
  try {
    const { params } = req;
    let binnacleId = params.binnacleId;

    const listActivities = await models.Activities.findAll({
      order: [['dateStart', 'ASC']],
      where: {
        binnacleId,
        statusDelete: false
      }
    });
    return res.status(201).send(listActivities);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const getActivitiesEnEspera = async (req, res) => {
  try {
    const { params } = req;
    let binnacleId = params.binnacleId;

    const listActivities = await models.Activities.findAll({
      order: [['dateStart', 'ASC']],
      where: {
        binnacleId,
        statusDelete: false,
        status: 'En espera'
      },
      include: [
        {
          model: models.Human_Resources
        }
      ]
    });
    return res.status(201).send(listActivities);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const getActivitiesInit = async (req, res) => {
  try {
    const { params } = req;
    let binnacleId = params.binnacleId;

    const listActivities = await models.Activities.findAll({
      order: [['dateStart', 'ASC']],
      where: {
        binnacleId,
        statusDelete: false,
        status: 'Iniciada'
      },
      include: [
        {
          model: models.Human_Resources
        }
      ]
    });
    return res.status(201).send(listActivities);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const getActivitiesFinish = async (req, res) => {
  try {
    const { params } = req;
    let binnacleId = params.binnacleId;

    const listActivities = await models.Activities.findAll({
      order: [['dateStart', 'ASC']],
      where: {
        binnacleId,
        statusDelete: false,
        status: 'Finalizada'
      },
      include: [
        {
          model: models.Human_Resources
        }
      ]
    });
    return res.status(201).send(listActivities);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

//Agregar Actividad
const activitieAdd = async (req, res) => {
  try {
    const { body } = req;
    let binnacleId = body.binnacleId;
    let name = body.name;
    let dateStart = body.dateStart;
    let dateFinish = body.dateFinish;
    let estimatedExpense = body.estimatedExpense;
    let resources = body.resources;
    let status = 'En espera';
    let humanResourceId = body.humanResourceId;

    if (isEmpty(binnacleId))
      return res.status(400).send('binnacle Id is required');
    if (isEmpty(name)) return res.status(400).send('name is required');
    if (isEmpty(dateStart))
      return res.status(400).send('date start is required');
    if (isEmpty(dateFinish))
      return res.status(400).send('date finish Id is required');
    if (isEmpty(estimatedExpense))
      return res.status(400).send('Estimated expense is required');

    const binnacle = await models.Binnacle.findByPk(binnacleId);
    if (!binnacle) return res.status(404).send('Binnacle not found');

    const response = await models.Activities.create({
      name,
      dateStart,
      dateFinish,
      estimatedExpense,
      status,
      resources,
      humanResourceId,
      binnacleId
    });
    return res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const getActivitieById = async (req, res) => {
  try {
    const { params } = req;

    const id = params.id;

    const activitie = await models.Activities.findByPk(id, {
      include: [
        {
          model: models.Human_Resources
        }
      ]
    });

    if (!activitie) return res.status(401).send('Activitie not found');

    return res.status(201).send(activitie);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

//Agregar Actividad
const updateActivitie = async (req, res) => {
  try {
    const { body, params } = req;
    let id = params.id;
    let name = body.name;
    let dateStart = body.dateStart;
    let dateFinish = body.dateFinish;
    let estimatedExpense = body.estimatedExpense;
    let resources = body.resources;
    let humanResourceId = body.humanResourceId;
    let actualExpense = body.actualExpense;

    if (isEmpty(name)) return res.status(400).send('name is required');
    if (isEmpty(dateStart))
      return res.status(400).send('date start is required');
    if (isEmpty(dateFinish))
      return res.status(400).send('date finish Id is required');
    if (isEmpty(estimatedExpense))
      return res.status(400).send('Estimated expense is required');
    const act = await models.Activities.findByPk(id);

    const response = await models.Activities.update(
      {
        name,
        dateStart,
        dateFinish,
        estimatedExpense,
        resources,
        humanResourceId,
        actualExpense
      },
      {
        where: {
          id
        }
      }
    );

    const actUp = await models.Activities.findByPk(id);
    const binn = await models.Binnacle.findByPk(act.binnacleId);
    const finance = await models.Finances.findOne({
      where: {
        sowingId: binn.sowingId
      }
    });
    const harvest = await models.Harvest.findOne({
      where: {
        sowingId: binn.sowingId
      }
    });

    let oldExp = act.actualExpense;
    if (oldExp !== null && actUp.actualExpense !== null) {
      console.log('entra aqui');
      let gasto = finance.expenditure - oldExp + actUp.actualExpense;
      if (harvest.amount !== null) {
        let ganancia = harvest.amount - gasto;
        finance.expenditure = gasto;
        finance.gain = ganancia;
      } else {
        finance.expenditure = gasto;
      }
      finance.save();
    }

    if (response) return res.status(201).send('Activitie has been updated');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

//Eliminar Actividad
const activitieDelete = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const activitieFind = await models.Activities.findByPk(id);

    if (!activitieFind) return res.status(404).send('Activitie not found');

    const activitieDel = await models.Activities.update(
      {
        statusDelete: true
      },
      {
        where: {
          id
        }
      }
    );

    return res.status(201).send('Activitie has been delete');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

const initActivitie = async (req, res) => {
  try {
    const { params, body } = req;
    let id = params.id;
    let dateStart = body.dateStart;

    if (isEmpty(dateStart))
      return res.status(400).send('Date start is required');
    const findActivitie = await models.Activities.findByPk(id);

    if (!findActivitie) return res.status(401).send('Activitie not found');

    const activitieInit = await models.Activities.update(
      {
        status: 'Iniciada',
        dateStart
      },
      {
        where: {
          id
        }
      }
    );

    if (activitieInit)
      return res.status(201).send('Activitie has been initialized');
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

const finishActivitie = async (req, res) => {
  try {
    const { params, body } = req;
    let id = params.id;
    let dateFinish = body.dateFinish;
    let actualExpense = body.actualExpense;

    if (isEmpty(dateFinish))
      return res.status(400).send('Date start is required');
    if (isEmpty(actualExpense))
      return res.status(400).send('Actual Expense is required');

    const findActivitie = await models.Activities.findByPk(id);

    if (!findActivitie) return res.status(401).send('Activitie not found');

    const activitieFinish = await models.Activities.update(
      {
        status: 'Finalizada',
        dateFinish,
        actualExpense
      },
      {
        where: {
          id
        }
      }
    );

    const upActivitie = await models.Activities.findByPk(id);

    const bitacora = await models.Binnacle.findByPk(upActivitie.binnacleId);

    let siembraId = bitacora.sowingId;

    const finance = await models.Finances.findOne({
      where: {
        sowingId: bitacora.sowingId,
        statusDelete: false
      }
    });

    console.log(finance);

    let gasto = finance.expenditure;
    let suma = gasto + upActivitie.actualExpense;

    finance.expenditure = suma;
    finance.save();

    if (activitieFinish)
      return res.status(201).send('Activitie has been finish');
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};
module.exports= {
  getActivitiesByBinnacle,
  activitieAdd,
  getActivitieById,
  updateActivitie,
  activitieDelete,
  initActivitie,
  finishActivitie,
  getActivitiesEnEspera,
  getActivitiesInit,
  getActivitiesFinish
};
