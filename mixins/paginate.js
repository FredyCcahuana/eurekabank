const Errors = require('http-errors');
const {
  paginate
} = require('../helpers/');

module.exports = function (Model, options) {
  let accepts = [{
    arg: 'page',
    type: 'number',
    description: 'Número de pagina'
  }, {
    arg: 'perPage',
    type: 'number',
    default: 20,
    description: 'Cantidad de items por página'
  }, {
    arg: 'order',
    type: 'string',
    default: 'created DESC',
    description: 'Criterio de ordenación'
  }, {
    arg: 'include',
    type: ['any'],
    description: 'Incluir alguna relación'
  }, {
    arg: 'where',
    type: 'object',
    description: 'Objeto con los campos a filtrar'
  }, {
    arg: 'req',
    type: 'object',
    http: {
      source: 'req'
    },
  }];

  for (let key in options) {
    if (options[key] === true) {
      accepts.push({
        arg: key,
        type: 'any'
      })
    } else if (options[key] === 'like') {
      accepts.push({
        arg: key,
        type: 'string',
        description: 'Like query'
      })
    }
  }

  Model.paginate = async (page, perPage = 20, order = 'created DESC', include = [], where = {}, req) => {
    return paginate(Model, options, page, perPage, order, include, where, req);
  };


  Model.remoteMethod('paginate', {
    description: `Listar y filtrar paginado los items del modelo`,
    accepts: accepts,
    returns: {
      arg: 'response',
      type: {
        data: [Model.name],
        total: 'number',
        page: 'number',
        perPage: 'number',
        pages: 'number',
        prevPage: 'string',
        nextPage: 'string',
      },
      root: true,
    },
    http: {
      verb: 'get',
      path: '/',
    },
  });
};
