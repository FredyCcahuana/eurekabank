const joi = require('joi');

const signinSchema = joi.object({
  username: joi.string().allow('',null),
  password: joi.string().allow(0,null)
  
});

module.exports = signinSchema;