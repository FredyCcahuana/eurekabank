const Errors = require('http-errors');
const joi = require('joi');
const createMedicineBriefcaseSchema = require('../schemas/transfer');
const remoteMethodResponse = require('../../../../helpers/remoteMethodResponse');

module.exports = function (MedicineBriefcase) {
  const METHOD_NAME = 'createMedicineBriefcase';

  remoteMethodResponse.setResponseType(MedicineBriefcase, METHOD_NAME, createMedicineBriefcaseSchema);

  MedicineBriefcase.beforeRemote(METHOD_NAME, async (ctx, unused) => {
    let payload = ctx.args.payload;

    let result = joi.validate(payload, createMedicineBriefcaseSchema, {
      stripUnknown: true
    });
    if (result.error) throw Errors.BadRequest(result.error);

    ctx.args.payload = result.value;
  });

  MedicineBriefcase[METHOD_NAME] = async (locals, payload) => {
    // if (locals.user.id != payload.userId) throw Errors.Forbidden('User not allowed');
    let medicineBriefcase = await MedicineBriefcase.findOne({where:{and:[{name:payload.name},{briefcaseId:payload.briefcaseId}]}});
    if(medicineBriefcase) throw Errors.Conflict('MedicineBriefcase in use');
    return MedicineBriefcase.create(payload);
  };

  MedicineBriefcase.remoteMethod(METHOD_NAME, {
    description: 'Create MedicineBriefcase',
    accepts: [{
      arg: 'locals',
      type: 'object',
      http: ctx => ctx.args ? ctx.args.locals : undefined,
      required: true,
    }, {
      arg: 'payload',
      type: METHOD_NAME,
      http: {
        source: 'body'
      }
    }],
    returns: {
      arg: 'response',
      type: 'MedicineBriefcase',
      root: true,
    },
    http: {
      verb: 'post',
      path: '/'
    }
  });

};