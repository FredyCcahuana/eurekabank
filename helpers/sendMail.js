const Ejs = require('ejs');
const mailjet = require('node-mailjet').connect(process.env.MAILJET_PUBLIC_KEY, process.env.MAILJET_PRIVATE_KEY);

const sendMail = (data, templateData = {}) => {
  return new Promise((resolve, reject) => {
    try {
      let template;

      if (data.template == 'clinic-history-inplace') {
        template = __dirname + '/../templates/clinic-history-inplace.template.html';
      } else if (data.template == 'clinic-history-finished') {
        template = __dirname + '/../templates/clinic-history-finished.template.html';
      } else {
        template = __dirname + '/../templates/mail.template.html';
      }

      Ejs.renderFile(template, templateData, {}, (err, html) => {
        if (err) {
          console.error(err);
          return reject(err);
        }

        let mailData = {
          "Messages": [{
            "From": {
              "Email": "atenciones@emerlife.com.pe",
              "Name": "Emerlife Atenciones"
            },
            "To": data.recipients,
            "Subject": data.subject,
            "HTMLPart": html,
            Attachments: data.attachments,
            //  [{
            //   Filename: 'Reporte_Historial_de_Eventos.xlsx',
            //   ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            //   Base64Content: xlsx.generate({
            //     type: 'base64'
            //   })
            // }]
          }]
        };

        return mailjet.post("send", {
          'version': 'v3.1'
        }).request(mailData);
      });
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = sendMail;
