const Errors = require('http-errors');
module.exports = (Movimiento) => {
  Movimiento.listLast = async (chr_cliecodigo) => {
    let movimiento = await Movimiento.find({
      where:{chr_cliecodigo:chr_cliecodigo},
      include:['tipoMovimiento'],
      limit: 3
    });
    console.log(movimiento);
    let movimientoParse=[];
    if (!movimiento) throw Errors.NotFound('Movimiento not found');
    for(let i = 0;i<movimiento.length;i++){
      movimiento[i].dec_moviimporte = Number.parseFloat(movimiento[i].dec_moviimporte).toFixed(2);
      movimientoParse.push(movimiento[i])
    }
    return movimientoParse;
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
