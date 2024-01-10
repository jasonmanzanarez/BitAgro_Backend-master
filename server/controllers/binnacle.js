const models = require('../models');
const { isEmpty } = require('../utils/nativeMethods');

//Obtiene lista de bitacora por siembra
const getBinnacles = async (req, res) => {
  try {
    const { params } = req;
    let sowingId = params.sowingId;

    const binnacles = await models.Binnacle.findAll({
      order: [['id', 'ASC']],
      where: {
        sowingId,
        statusDelete: false
      },
      include: {
        model: models.Activities
      }
    });

    return res.status(201).send(binnacles);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

const getBinnacleById = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const binnacle = await models.Binnacle.findByPk(id);

    if (!binnacle) return res.status(404).send('Binnacle not found');

    return res.status(201).send(binnacle);
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Ver actividades por bitácora
const binnacleDetail = async (req, res) => {
  try {
    const { params } = req;
    let binnacleId = params.id;

    const binnacle = await models.Binnacle.findByPk(binnacleId);

    if (!binnacle) return res.status(404).send('Binnacle not found');

    const activities = await models.Activities.findAll({
      where: {
        binnacleId,
        statusDelete: false
      }
    });

    return res.status(201).send(activities);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};

//Agregar bitácora
const binnacleAdd = async (req, res) => {
  try {
    const { body } = req;
    let sowingId = body.sowingId;
    let name = body.name;
    let description = body.description;

    if (isEmpty(sowingId)) return res.status(400).send('Sowing Id is required');
    if (isEmpty(name)) return res.status(400).send('name is required');

    const sowing = await models.Sowing.findByPk(sowingId);
    if (!sowing) return res.status(404).send('Sowing not found');

    const response = await models.Binnacle.create({
      sowingId,
      name,
      description
    });
    return res.status(201).send(response);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.errors[0].message);
  }
};
//Editar bitácora
const binnacleUpdate = async (req, res) => {
  try {
    const { params, body } = req;
    let id = params.id;
    let status = body.status;
    let name = body.name;
    let description = body.description;

    if (isEmpty(name)) return res.status(400).send('name is required');

    const binnacleFind = await models.Binnacle.findByPk(id);
    if (!binnacleFind) return res.status(404).send('Binnacle not found');

    /* const binnacleStatusInit  = await models.Binnacle.findAll({
      where:{statusDelete:false},
      include:[{model:models.Activities,
      where:{
        status:'Iniciada',
        statusDelete:false
      }}]
    });

    const binnacleStatusEspera  = await models.Binnacle.findAll({
      where:{statusDelete:false},
      include:[{model:models.Activities,
      where:{
        status:'En espera',
        statusDelete:false
      }}]
    });

    if((binnacleStatusInit.length!==0 && status===false) ||(binnacleStatusEspera.length!==0 && status===false) ){
      return res.status(401).send("NO es posible inactivar ya que tiene actividades pendientes")
    } */

    const binnUpdate = await models.Binnacle.update(
      {
        status,
        name,
        description
      },
      {
        where: {
          id
        }
      }
    );

    if (binnUpdate) return res.status(201).send('Binnacle has been update');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

//Eliminar Bitacora
const binnacleDelete = async (req, res) => {
  try {
    const { params } = req;
    let id = params.id;

    const binnacleFind = await models.Binnacle.findByPk(id);

    if (!binnacleFind) return res.status(404).send('Binnacle not found');

    const binnacleDel = await models.Binnacle.update(
      {
        statusDelete: true
      },
      {
        where: {
          id
        }
      }
    );

    return res.status(201).send('Binnacle has been delete');
  } catch (error) {
    res.status(500).send(error.errors[0].message);
  }
};

module.exports= {
  getBinnacles,
  binnacleDetail,
  binnacleAdd,
  binnacleUpdate,
  binnacleDelete,
  getBinnacleById
};
