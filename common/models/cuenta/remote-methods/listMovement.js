const Errors = require('http-errors');
const joi = require('joi');
const listMovementSchema = require('../schemas/listMovement');
const remoteMethodResponse = require('../../../../helpers/remoteMethodResponse');

module.exports = function (Cuenta) {
  const METHOD_NAME = 'listMovement';

  remoteMethodResponse.setResponseType(Cuenta, METHOD_NAME, listMovementSchema);

  Cuenta.beforeRemote(METHOD_NAME, async (ctx, unused) => {
    let payload = ctx.args.payload;
    console.log(payload);
    let result = joi.validate(payload, listMovementSchema, {
      stripUnknown: true
    });
    if (result.error) throw Errors.BadRequest(result.error);

    ctx.args.payload = result.value;
  });
  Cuenta[METHOD_NAME] = async (payload) => {
    console.log(payload.chr_cliecodigo);
    let cuenta = await Cuenta.find({
      where:{chr_cliecodigo: payload.chr_cliecodigo},
      include:{
        relation:'movimiento',
        scope:{
          where:{chr_cuencodigo:payload.chr_cuencodigo}
        }
      }
    });
    console.log(cuenta);
    if (!cuenta) throw Errors.NotFound('Cuenta not found');

    return cuenta;
  };

  Cuenta.remoteMethod(METHOD_NAME, {
    description: 'lista de movimiento por cuenta',
    accepts: [{
      arg: 'payload',
      type: METHOD_NAME,
      http: {
        source: 'body'
      }
    }],
    returns: {
      arg: 'response',
      type: 'cuenta',
      root: true
    },
    http: {
      verb: 'get',
      path: '/listMovement'
    }
  });
  //Cuenta.registry.modelBuilder.define(METHOD_NAME, {
  //  chr_cliecodigo: {
  //      type: 'string',
  //      required: true,
  //      description: 'name de Entity'
  //  },
  //  chr_cuencodigo: {
  //    type: 'string',
  //    required: true
  //  }
  //},{
  //    idInjection: false,
  //    strict: 'filter'
  //});
};