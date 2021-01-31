const Errors = require('http-errors');
const UpdateBankSchema = require('../schemas/updateBank');

module.exports = function (Bank) {

  Bank.beforeRemote('updateBank', (ctx, unused, next ) => {
    let payload = ctx.args.payload;

    const {error, value} = UpdateBankSchema.validate(payload);
    if(error){
      next(Errors.BadRequest(error))
    }
    ctx.args.payload = value;
    return next();
  });

  Bank.updateBank = async (locals, id, payload) => {

    let bank = await Bank.findById(id);
    if (!bank) throw Errors.NotFound('Bank not found');

    bank = await bank.updateAttributes(payload);

    return bank;
  };

  Bank.remoteMethod('updateBank', {
    description: 'Update Bank',
    accepts: [{
      arg: 'locals',
      type: 'object',
      http: ctx => ctx.args ? ctx.args.locals : undefined,
      required: true,
    }, {
      arg: 'id',
      type: 'string',
      required: true
    }, {
      arg: 'payload',
      type: 'updateBank',
      http: {
        source: 'body'
      }
    }],
    returns: {
      arg: 'response',
      type: 'bank',
      root: true,
    },
    http: {
      verb: 'put',
      path: '/:id'
    }
  });
  Bank.registry.modelBuilder.define('updateBank', {
    name: {
        type: 'string',
        required: true,
        description: 'name de Bank'
    },
    startingAmount: {
      type: 'number',
      "postgresql":{
        "dataType":"decimal"
      },
      description: 'monto antes de la transacción'
    },
    finalAmount: {
      type: 'number',
      "postgresql":{
        "dataType":"decimal"
      },
      description: 'monto despues de la transacción'
    }
  },
  {
    idInjection: false,
    strict: 'filter'
  });


};