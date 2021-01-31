const Errors = require('http-errors');
const serializeQuery = require('./serializeQuery');

const paginate = async (Model, options, page, perPage = 20, order = 'operationDate DESC', include = [], where = {}, req, method = 'paginate') => {
  try {
    if (include && !Array.isArray(include)) throw Errors.BadRequest('include is not an array');

    let findLogic = {
      where: where,
      order: order,
      include: include,
    };

    if (page) {
      findLogic.skip = perPage * (page - 1);
      findLogic.limit = perPage;
    }

    for (let key in options) {
      if (!req.query[key]) continue;

      if (key == 'query') {
        findLogic.where.or = [];
        for (let key2 in options[key]) {
          if (options[key][key2] == 'like') {
            findLogic.where.or.push({
              [key2]: {
                regexp: new RegExp('^.*' + req.query[key] + '.*$', 'i')
              }
            });
          } else {
            findLogic.where.or.push({
              [key2]: req.query[key]
            });
          }
        }
      } else if (options[key] == 'like') {
        findLogic.where[key] = {
          // regexp: '/^.*' + req.query[key] + '.*$/i',
          regexp: new RegExp('^.*' + req.query[key] + '.*$', 'i')
        };
      } else if (key == 'startDate') {
        if (!findLogic.where.and) findLogic.where.and = [];
        let obj = {};
        obj[options[key]] = {
          gte: req.query[key]
        };
        findLogic.where.and.push(obj);
      } else if (key == 'endDate') {
        if (!findLogic.where.and) findLogic.where.and = [];
        let obj = {};
        obj[options[key]] = {
          lte: req.query[key]
        };
        findLogic.where.and.push(obj);
      } else if (key == 'rangoMinAmountTotal') {
        if (!findLogic.where.and) findLogic.where.and = [];
        let obj = {};
        obj[options[key]] = {
          gte: req.query[key]
        };
        findLogic.where.and.push(obj);
      } else if (key == 'rangoMaxAmountTotal') {
        if (!findLogic.where.and) findLogic.where.and = [];
        let obj = {};
        obj[options[key]] = {
          lte: req.query[key]
        };
        findLogic.where.and.push(obj);
      } else {
        findLogic.where[key] = req.query[key];
      }

    }

    let list = await Model.find(findLogic);
    let count = await Model.count(findLogic.where);

    if (!page) return Promise.resolve({
      data: list,
      // total: totalCount,
      total: count,
    });

    let pages = Math.ceil(count / perPage);

    let base = `${Model.app.get('apiURL')}${Model.sharedClass.http.path}/${method}`;
    let link = `${base}?${serializeQuery({ perPage, order: findLogic.order, include: findLogic.include, where: findLogic.where })}`;

    let prevPage = page > 1 ? page - 1 : 1;
    prevPage = link + '&page=' + prevPage;
    let nextPage = link + '&page=' + (page + 1);

    return Promise.resolve({
      data: list,
      // total: totalCount,
      total: count,
      page,
      perPage,
      pages,
      prevPage: page > 1 ? prevPage : undefined,
      nextPage: page < pages ? nextPage : undefined,
    });
  } catch (err) {
    return Promise.reject(err)
  }
};


module.exports = paginate;
