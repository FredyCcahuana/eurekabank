const firebase = require('firebase-admin');

module.exports = {

  async send(payload, fcmToken) {
    console.log('Apunto de Enviar');
    let config = {
       android: {
         priority: "high",
      },
      apns: {
        headers: {
           Urgency: 'high'
         },
        payload: {
          aps: {
            alert: {
              title: payload.title || 'Notificación',
              body: payload.body || '',
            },
            sound: 'default',
          }
        }
      },
      data: payload,
    };
    config.token = fcmToken;

    let info = await firebase.messaging().send(config);
    console.log(info);
    return info;
  }

};
