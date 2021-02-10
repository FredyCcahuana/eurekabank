const Errors = require('http-errors');
const joi = require('joi');
const signinSchema = require('../../cliente/schemas/signin');
const remoteMethodResponse = require('../../../../helpers/remoteMethodResponse');

module.exports = function(Cliente) {

    const METHOD_NAME = 'signin';
    //remoteMethodResponse.setResponseType(Cliente, METHOD_NAME, signinSchema);
    //
    //Cliente.beforeRemote(METHOD_NAME, async(ctx, unused) => {
    //    let payload = ctx.args.payload;
    //    console.log(payload);
    //    let result = joi.validate(payload, signinSchema, {
    //        stripUnknown: true
    //    });
    //    if (result.error) throw Errors.BadRequest(result.error);
//
    //    ctx.args.payload = result.value;
    //});

    Cliente[METHOD_NAME] = async(username, password) => {
        //payload.username = "gcoronelc@gmail.com";
        //const Role = Cliente.app.models.role;
        //console.log(payload);
        let cliente = await Cliente.findOne({
            where: {
                vch_clieusuario: username,
            }
        });
        if (!cliente) throw Errors.NotFound('client incorrect');


        console.log(cliente);
        return cliente;
    };

    Cliente.remoteMethod(METHOD_NAME, {
        description: 'iniciar Usuario',
        accepts: [
            {
               arg: 'username',
               type: 'string',
               required: true
            },
            {
                arg: 'password',
                type: 'string',
                required: true
             }
        ],
        returns: {
            arg: 'response',
            any: 'cliente',
            root: true,
        },
        http: {
            verb: 'get',
            path: '/signin/:username/:password'
        }
    });
};