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

app.post('/sendSMS', (req, res) => {
  // A user registers with a mobile phone number
  let phoneNumber = req.body.number;
  console.log(phoneNumber);
  const payload = {number: phoneNumber, brand: 'Mare Boss Company'};
  nexmo.verify.request(payload, (err, result) => {
    console.log('status:', result.status);
    if(err) {
      console.log('Verify Error: ', err);
      res.sendStatus(500);
    } else {
      console.log('Success verify');
      let requestId = result.request_id;
      console.log('requestId:', requestId);
      if(result.status == '0') {
        res.status(200).send({requestId: requestId});
        // Success! Now, have your user enter the PIN
      } else {
        res.status(401).send(result.error_text);
      }
    }
  });
});

app.post('/verify', (req, res) => {
  console.log('verify body: ', req.body);
  let pin = req.body.pin;
  let requestId = req.body.requestId;

  nexmo.verify.check({request_id: requestId, code: pin}, (err, result) => {
    if(err) {
      console.log('err:', err)
      // handle the error
    } else {
      console.log('status verify: ', result.status);
      if(result && result.status == '0') { // Success!
        res.status(200).send({ message: 'account verified' });
      //   res.render('status', {message: 'Account verified! 🎉'});
      } else {
          res.status(400).send({ message: 'account not verified' });

        // handle the error - e.g. wrong PIN
      }
    }
  });
});

// App runing at http://localhost:5000
app.listen(5000, function () {
    console.log('Node app is running on port 5000');
});