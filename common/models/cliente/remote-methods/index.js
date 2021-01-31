'use strict';

module.exports = function (Bank) {

  require("./createBank")(Bank);
  require("./updateBank")(Bank);
  //require("./uploadPicture")(Category);
  require('./getBank')(Bank);
  //require("./updatePicture")(Category);
};
