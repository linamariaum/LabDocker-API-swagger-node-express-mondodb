//Load express module with `require` directive
var express = require('express')
var app = express()
const mongoose = require('mongoose')

const port = process.env.PORT || 8081;

const db_link = "mongodb://mongo:27017/helloworlddb";

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(db_link, options).then( function() {
    console.log('MongoDB is connected');
    })
    .catch( function(err) {
    console.log(err);
});
const con = mongoose.connection

con.on('open', () => {
    console.log('Conected...')
})

app.use(express.json())

//Define request response in root URL (/)
app.get('/', function (req, res) {
    res.send('Customer API!')
})

const CustomerRoutes = require('./routes/customer.controller')
app.use('/customers', CustomerRoutes);

//Launch listening server on port 8081
app.listen(port, function () {
    console.log('app listening on port 8081!')
})