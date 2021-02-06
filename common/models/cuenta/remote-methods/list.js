const Errors = require('http-errors');
module.exports = (Cuenta) => {
  Cuenta.list = async (chr_cliecodigo) => {
    let cuenta = await Cuenta.find({
      where:{chr_cliecodigo:chr_cliecodigo}
    });
    console.log(cuenta);
    if (!cuenta) throw Errors.NotFound('Cuenta not found');

    return cuenta;
  };

  Cuenta.remoteMethod('list', {
    description: 'lista de Cuentas',
    accepts: [{
      arg: 'chr_cliecodigo',
      type: 'string',
      required: true
    }],
    returns: {
      arg: 'response',
      type: 'cuenta',
      root: true
    },
    http: {
      path: '/list/:chr_cliecodigo',
      verb: 'get'
    }
  });

};