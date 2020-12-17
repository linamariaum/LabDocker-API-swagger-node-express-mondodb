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

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
 swaggerDefinition: {
    info: {
        title: "HelloWorld API",
        description: "Hello World Class",
        contact: {
            name: "cmduquer"
        },
        servers: ["http://localhost:8081"]
    }
 },
 apis: ["index.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Define request response in root URL (/)
app.get('/', function (req, res) {
    res.send('Hello World!')
})

/**
* @swagger
* /customers:
*   get:
*       description: Use to request all customers
*       responses:
*           '200':
*               description: A successful response
*/
app.get('/customers', function (req, res) {
 res.status(200).send('Customer results')
})

/**
 * @swagger
 * /customers:
 *  put:
 *      description: Use to update a customers
 *      parameters:
 *          - name: customer
 *            in: query
 *            description: Name of our customer
 *            required: falses
 *            schema:
 *              type: string
 *              format: string
 *      responses:
 *          '201':
 *              description: A successful response
 */
app.put('/customers', function (req, res) {
 res.status(201).send('Successfully updated customer')
})

//Launch listening server on port 8081
app.listen(port, function () {
    console.log('app listening on port 8081!')
})