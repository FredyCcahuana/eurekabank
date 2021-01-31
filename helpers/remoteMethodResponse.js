/* eslint-disable strict */
const joi = require('joi')
const _format = (schema) => {
  if (schema.type == 'object') {
    let result = {};
    for (let key in schema.children) {
      result[key] = _format(schema.children[key]);
    }
    return result;
  } else if (schema.type == 'array') {
    let result = [];
    for (let i = 0; i < schema.items.length; i++) {
      result.push(_format(schema.items[i]));
    }
    return result;
  } else {
    return schema.type;
  }
};

const _format2 = (schema) => {
  if (schema.type == 'object') {
    let result = {};
    for (let key in schema.children) {
      result[key] = _format2(schema.children[key]);
    }
    return result;
  } else if (schema.type == 'array') {
    let result = [];
    for (let i = 0; i < schema.items.length; i++) {
      result.push(_format2(schema.items[i]));
    }
    return result;
  } else {
    return {
      type: schema.type,
    };
  }
};

const _setResponseType = (Model, name, schema) => {
  if (schema.type == 'object') {
    let result = {};
    for (let key in schema.children) {
      result[key] = _setResponseType(Model,
        name + '_' + key,
        schema.children[key]);
    }

    Model.registry.modelBuilder.define(name, result, {
      idInjection: false,
      strict: 'filter',
    });

    return {
      type: name,
    };
  } else if (schema.type == 'array') {
    let type;

    if (schema.items[0].type == 'object' || schema.items[0].type == 'array') {
      type = [_setResponseType(Model, name, schema.items[0])];
    } else {
      type = [schema.items[0].type];
    }

    return {
      type: type,
    };
  } else {
    return {
      type: schema.type,
    };
  }
};

module.exports = {

  format(schema) {
    let data = joi.describe(schema);
    return _format(data);
  },

  format2(schema) {
    let data = joi.describe(schema);
    return _format2(data);
  },

  setResponseType(Model, name, schema) {
    return _setResponseType(Model, name, joi.describe(schema));
  },

};
