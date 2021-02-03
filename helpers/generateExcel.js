const Errors = require('http-errors');
const moment = require('moment');
const fs = require('fs');
const XlsxTemplate = require('xlsx-template');

moment.locale('es');

const Template = {
  'attendances-daily-report': __dirname + '/../templates/attendances-daily-report.xlsx',
  'workers-all-report': __dirname + '/../templates/workers-all-report.xlsx',
  'clinic-histories-report': __dirname + '/../templates/clinic-histories-report.xlsx',
  'patients-records-report': __dirname + '/../templates/patients-records-report.xlsx',
  'events-all-report': __dirname + '/../templates/events-all-report.xlsx',
  'patients-records-report-auditables': __dirname+'/../templates/patiens-records-report-auditables.xlsx',
  'clinic-histories-report-auditables': __dirname+'/../templates/clinic-histories-report-auditables.xlsx',
  'medicine-report':__dirname+'/../templates/medicine-report.xlsx',
  'CH-report-detail':__dirname+'/../templates/clinic-histories-report-detail.xlsx',
  'medicine-briefcase-report':__dirname+'/../templates/medicine-briefcase-report.xlsx',
  'medicine-briefcase-catering-report':__dirname+'/../templates/medicine-briefcase-catering-report.xlsx',
};

const generateExcel = async (type, data) => {
  return new Promise((resolve, reject) => {
    const templateData = {
      ...data,
    };

    fs.readFile(Template[type], (err, file) => {
      if (err) {
        throw Errors(400,err)
        return reject(err);}

      let xlsx = new XlsxTemplate(file);
      xlsx.substitute(1, templateData);

      var temp = xlsx.generate({
        type: 'uint8array'
      });
      const fileLocation = __dirname + `/temp-${Date.now()}.xlsx`;

      fs.writeFileSync(fileLocation, temp);

      return resolve(fileLocation);
    });
  });
};

module.exports = generateExcel;
