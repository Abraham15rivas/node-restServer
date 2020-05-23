require('./config/config.js')
const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'))

mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err) => {

        if (err) throw err
        console.log('DB ok online');

    });

app.listen(process.env.PORT, () => {
    console.log('escuchando puerto:', process.env.PORT);
})