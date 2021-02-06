const joi = require('joi');

module.exports = joi.object().keys({
  chr_cliecodigo: joi.string().required(),
  chr_cuencodigo: joi.string().required()
});
