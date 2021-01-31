const Errors = require('http-errors');

module.exports = function (Bank) {
  
  Bank.getBanks = async (locals, payload) => {
    return Bank.find();
  };

  Bank.remoteMethod('getBanks', {
    description: 'Get Bank',
    accepts: [{
      arg: 'locals',
      type: 'object',
      http: ctx => ctx.args ? ctx.args.locals : undefined,
      required: true,
    }]
    ,
    returns: {
      arg: 'response',
      type: 'any',
      root: true,
    },
    http: {
      verb: 'get',
      path: '/'
    }
  });
 
};