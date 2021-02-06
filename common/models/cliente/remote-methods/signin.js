const Errors = require('http-errors');
const joi = require('joi');
const signinSchema = require('../../cliente/schemas/signin');
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
        description: 'Login del usuario del panel movil',
        accepts: [
            {
            arg: 'payload',
            type: METHOD_NAME,
            http: {
              source: 'body'
            }
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