const Errors = require('http-errors');
module.exports = (Cuenta) => {
  Cuenta.list = async (chr_cliecodigo) => {
    let cuenta = await Cuenta.find({
      where:{chr_cliecodigo:chr_cliecodigo}
    });
    console.log(cuenta);
    if (!cuenta) throw Errors.NotFound('Cuenta not found');
    let cuentaParse = [];
    for(let i = 0;i<cuenta.length;i++){
      cuenta[i].dec_moviimporte = new String(cuenta[i].dec_moviimporte);
      cuentaParse.push(cuenta[i])
    }
    return cuentaParse;
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