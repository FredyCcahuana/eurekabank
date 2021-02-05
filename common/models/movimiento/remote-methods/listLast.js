const Errors = require('http-errors');
module.exports = (Movimiento) => {
  Movimiento.listLast = async (chr_cliecodigo) => {
    let movimiento = await Movimiento.find({
      where:{chr_cliecodigo:chr_cliecodigo},
      include:['tipoMovimiento'],
      limit: 3
    });
    console.log(movimiento);
    if (!movimiento) throw Errors.NotFound('Movimiento not found');

    return movimiento;
  };

  Movimiento.remoteMethod('listLast', {
    description: 'lista de Ultimos Movimientos',
    accepts: [{
      arg: 'chr_cliecodigo',
      type: 'string',
      required: true
    }],
    returns: {
      arg: 'response',
      type: 'movimiento',
      root: true
    },
    http: {
      path: '/listLast/:chr_cliecodigo',
      verb: 'get'
    }
  });

};
