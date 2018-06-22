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

app.set('views', __dirname + '/views'); // Render on browser
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static(__dirname + '/views'));

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
    res.render('index');
  });

app.post('/register', (req, res) => {
    // A user registers with a mobile phone number
    let phoneNumber = req.body.number;
    console.log(phoneNumber);
    const payload = {number: phoneNumber, brand: 'Marius Company'};
    nexmo.verify.request(payload, (err, result) => {
      if(err) {
        console.log('Verify Error: ', err);
        res.sendStatus(500);
      } else {
        console.log('Success verify');
        let requestId = result.request_id;
        if(result.status == '0') {
          res.send('verify', {requestId: requestId});
          // Success! Now, have your user enter the PIN
        } else {
          res.status(401).send(result.error_text);
        }
      }
    });
  });


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});