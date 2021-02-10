const Errors = require('http-errors');
const joi = require('joi');
const listMovementSchema = require('../schemas/listMovement');
const remoteMethodResponse = require('../../../../helpers/remoteMethodResponse');

module.exports = function (Cuenta) {
  const METHOD_NAME = 'listMovement';

  //remoteMethodResponse.setResponseType(Cuenta, METHOD_NAME, listMovementSchema);
//
  //Cuenta.beforeRemote(METHOD_NAME, async (ctx, unused) => {
  //  let payload = ctx.args.payload;
  //  console.log(payload);
  //  let result = joi.validate(payload, listMovementSchema, {
  //    stripUnknown: true
  //  });
  //  if (result.error) throw Errors.BadRequest(result.error);
//
  //  ctx.args.payload = result.value;
  //});
  Cuenta[METHOD_NAME] = async (chr_cliecodigo,chr_cuencodigo) => {
    // 00001/00200002
   
    let cuenta = await Cuenta.find({
      where:{chr_cliecodigo: chr_cliecodigo},
      include:{
        relation:'movimiento',
        scope:{
          where:{chr_cuencodigo:chr_cuencodigo}
        }
      }
    });
    console.log(cuenta);
    if (!cuenta) throw Errors.NotFound('Cuenta not found');

    return cuenta;
  };

  Cuenta.remoteMethod(METHOD_NAME, {
    description: 'lista de movimiento por cuenta',
    accepts: [
      {
        arg: 'chr_cliecodigo',
        type: 'string',
        required: true
     },
     {
         arg: 'chr_cuencodigo',
         type: 'string',
         required: true
      }
    ],
    returns: {
      arg: 'response',
      type: 'cuenta',
      root: true
    },
    http: {
      verb: 'get',
      path: '/listMovement/:chr_cliecodigo/:chr_cuencodigo'
    }
  });
};