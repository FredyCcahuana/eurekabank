const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

module.exports = function (plain) {
  // this.validatePassword(plain);
  var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  return bcrypt.hashSync(plain, salt);
};
