const Errors = require('http-errors');
const joi = require('joi');
const signinSchema = require('../schemas/signin');
const remoteMethodResponse = require('../../../../helpers/remoteMethodResponse');

module.exports = function(Cliente) {

    const METHOD_NAME = 'signin';
    remoteMethodResponse.setResponseType(Cliente, METHOD_NAME, signinSchema);
    Cliente.beforeRemote(METHOD_NAME, async(ctx, unused) => {
        let payload = ctx.args.payload;

        let result = joi.validate(payload, signinSchema, {
            stripUnknown: true
        });
        if (result.error) throw Errors.BadRequest(result.error);

        ctx.args.payload = result.value;
    });

    Cliente[METHOD_NAME] = async(payload) => {
        //payload.username = "gcoronelc@gmail.com";
        //const Role = Cliente.app.models.role;
        //const RoleMapping = Cliente.app.models.roleMapping; 
        let cliente = await Cliente.findOne({
            where: {
                vch_clieusuario: payload.username,
            }
        });
        if (!cliente) throw Errors.NotFound('client incorrect');


        console.log(cliente);
        return cliente;
    };

    Cliente.remoteMethod(METHOD_NAME, {
        description: 'Login del usuario del panel web',
        accepts: [{
            arg: 'payload',
            type: 'object',
            //http: ctx => ctx.args ? ctx.args.locals : undefined,
            //required: true,
        }],
        returns: {
            arg: 'response',
            any: 'cliente',
            root: true,
        },
        http: {
            verb: 'get',
            path: '/signin'
        }
    });
};