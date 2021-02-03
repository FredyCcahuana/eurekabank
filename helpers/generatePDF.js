const pdf = require('html-pdf');
const ejs = require('ejs');

module.exports = function (data, type, format) { // customerId) {
  return new Promise((resolve, reject) => {
    let template = null;
    if (type == 'voucher') template = __dirname + '/../templates/voucher.html';
    else if (type == 'pre-liquidation') {
      if (format == 'SD') template = __dirname + '/../templates/pre-liquidation-sd.html';
      if (format == 'CD' || format == 'PD') template = __dirname + '/../templates/pre-liquidation-cd.html';
    } else return reject('type is required');

    const fileName = `${data.voucherId}.pdf`;
    let relativePath = null;
    if (type == 'voucher') relativePath = `vouchers/${fileName}`;
    else if (type == 'pre-liquidation') relativePath = `pre-liquidations/${fileName}`;

    const fileLocation = `${__dirname}/../storage/${relativePath}`;

    ejs.renderFile(template, data, {}, function (err, html) {
      if (err) return reject(err);

      let border = {};

      if (type == 'voucher') {
        border = {
          top: '20px',
          bottom: '20px',
          left: '20px',
          right: '20px',
        };
      } else {
        border = {
          top: '30px',
          bottom: '30px',
          left: '30px',
          right: '30px',
        };
      }

      pdf.create(html, {
        format: 'A4',
        base: `file://${__dirname}/../templates/`,
        border: border,
      }).toFile(fileLocation, function (err, res) {
        if (err) return reject(err);

        return resolve({
          fileLocation,
          fileName,
          relativePath,
        });
      });

    });
  });
};
