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

app.get('/', function (req, res) {
    res.send('Hello Cristis');
});

app.post('/register', (req, res) => {
    let phoneNumber = req.body.number;
    console.log('number:', phoneNumber);
    res.send(phoneNumber)
});


app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});