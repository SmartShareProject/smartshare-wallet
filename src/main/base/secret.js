const crypto = require('crypto');
const md5=crypto.createHash("md5");


function passwordScropt(password) {
  md5.update(password);
  const md5PassWd = md5.digest('hex');
  const jPassWd = md5PassWd.toUpperCase();
  return jPassWd;
}

exports.handlePassword = passwordScropt
