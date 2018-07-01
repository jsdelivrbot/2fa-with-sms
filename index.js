const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: process.env.API_KEY,
  apiSecret: process.env.API_SECRET_KEY
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.set('port', (process.env.PORT || 5000));

app.post('/sendSMS', (req, res) => {
  let phoneNumber = req.body.number;
  const payload = {
    number: phoneNumber, 
    brand: 'ConnectStud'
  };
  nexmo.verify.request(payload, (err, result) => {
    if (err) {
      res.sendStatus(500);
    } else {
      let requestId = result.request_id;
      if (result.status == '0') {
        res.status(200).send({requestId: requestId});
      } else {
        res.status(401).send(result.error_text);
      }
    }
  });
});

app.post('/verify', (req, res) => {
  let pin = req.body.pin;
  let requestId = req.body.requestId;
  const payload = {
    request_id: requestId,
    code: pin
  };

  nexmo.verify.check(payload, (err, result) => {
    if (err) {
      res.status(400).send({ message: 'account not verified' });
    } else {
      if (result && result.status == '0') {
        res.status(200).send({ message: 'account verified' });
      } else {
          res.status(400).send({ message: 'account not verified' });
      }
    }
  });
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});