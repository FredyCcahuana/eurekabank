module.exports = (Model, options) => {

  if (!Model) return console.log('Model not found');
  if (!Model.sharedClass) return console.log('Model.sharedClass not found');

  var modelName = Model.sharedClass.name;
  var methods = Model.sharedClass.methods();
  var methodsToExpose = options.expose || [];
  var relationMethods = [];
  var hiddenMethods = [];

  try {
    Object.keys(Model.definition.settings.relations).forEach((relation) => {
      relationMethods.push({
        name: '__findById__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__deleteById__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__updateById__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__exists__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__link__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__get__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__create__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__update__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__destroy__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__unlink__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__count__' + relation,
        isStatic: false
      });
      relationMethods.push({
        name: '__delete__' + relation,
        isStatic: false
      });
    });
  } catch (err) {
    console.log(err);
  }

  methods.concat(relationMethods).forEach((method) => {
    var methodName = method.name;
    if (methodsToExpose.indexOf(methodName) < 0) {
      hiddenMethods.push(methodName);
      Model.disableRemoteMethod(methodName, method.isStatic);
    }
  });

  // if(hiddenMethods.length > 0) {
  //     console.log('\nRemote mehtods hidden for', modelName, ':', hiddenMethods.join(', '), '\n');
  // }
};
