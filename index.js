var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

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