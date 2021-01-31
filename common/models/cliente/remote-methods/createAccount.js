const Errors = require('http-errors');
const schema = require('../schemas/createBank');

module.exports = function (Bank) {

    Bank.beforeRemote('createBank',(ctx, unused,next) => {
    let payload = ctx.args.payload;

    const {error, value} = schema.validate(payload)
    if (error) {
      next(Errors.BadRequest(result.error));
    }

    ctx.args.payload = value;
    return next();
  });
  
  Bank.createBank = async (locals, payload) => {

    let bank = await Bank.findOne({ where:{name: payload.name}});
    if (bank) throw Errors.Conflict('bank name in use');

    bank = await Bank.create(payload);

    return bank;
  };

  Bank.remoteMethod('createBank', {
    description: 'Create Bank',
    accepts: [{
      arg: 'locals',
      type: 'object',
      http: ctx => ctx.args ? ctx.args.locals : undefined,
      required: true,
    }, {
      arg: 'payload',
      type: 'createBank',
      http: {
        source: 'body'
      }
    }],
    returns: {
      arg: 'response',
      type: 'bank',
      root: true
    },
    http: {
      verb: 'post',
      path: '/'
    }
  });
  Bank.registry.modelBuilder.define('createBank', {
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
    },{
        idInjection: false,
        strict: 'filter'
    });
};
