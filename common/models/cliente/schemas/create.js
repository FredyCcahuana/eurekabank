const joi = require('@hapi/joi');

const createBankSchema = joi.object({
  name: joi.string().required().allow('',null),
  startingAmount: joi.number().allow(0,null),
  finalAmount: joi.number().allow(0,null),
  
});

module.exports = createBankSchema;