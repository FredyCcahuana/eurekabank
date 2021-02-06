const joi = require('joi');

module.exports = joi.object().keys({
  name: joi.string().required(),
  top:joi.number().required(),
  briefcaseId:joi.string(),
  medicineId:joi.string()
});