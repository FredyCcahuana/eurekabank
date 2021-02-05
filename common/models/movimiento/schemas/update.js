const joi = require('@hapi/joi');

const updateBankSchema = joi.object({
  name: joi.string().required().allow('',null),
  startingAmount: joi.number().allow(0,null),
  finalAmount: joi.number().allow(0,null),
  
});

module.exports = updateBankSchema;