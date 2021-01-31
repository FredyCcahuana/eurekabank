const Errors = require('http-errors');

module.exports = function (Model, options) {

  Model.beforeRemote('**', async (ctx, data) => {
    const User = Model.app.models.user;
    let accessToken = ctx.req.accessToken;
    let user, roles = [];

    if (accessToken && accessToken.userId) {
      user = await User.findOne({
        where: {
          id: accessToken.userId
        },
        include: ['roles']
      });

      if (user) {
        roles = (await user.roles()).map(role => role.name);
      }
    }
    console.log('usuario autorizado');
    ctx.args.locals = user ? {
      accessToken,
      user,
      roles,
    } : undefined;

    return;
  });
};

