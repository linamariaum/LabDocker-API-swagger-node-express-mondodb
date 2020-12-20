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

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
 swaggerDefinition: {
    info: {
        title: "Customers API",
        description: "Crud customers",
        contact: {
            name: "linamariaum"
        },
        servers: ["http://localhost:8081/"]
    }
 },
 apis: ["index.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Define request response in root URL (/)
app.get('/', function (req, res) {
    res.send('Customer API!')
})

// const CustomerRoutes = require('./routes/customer.controller')
// app.use('/customers', CustomerRoutes);

const CustomerModel = require('./models/customer.model')

/**
 * @swagger
 *
 * definitions:
 *   NewCustomer:
 *     type: object
 *     required:
 *       - firstName
 *       - lastName
 *       - email
 *       - phoneNumber
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *       phoneNumber:
 *         type: string
 *       city:
 *         type: string
 *       country:
 *         type: string
 *   UpdateCustomer:
 *     type: object
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       email:
 *         type: string
 *       phoneNumber:
 *         type: string
 *       city:
 *         type: string
 *       country:
 *         type: string
 *   Customer:
 *     allOf:
 *       - $ref: '#/definitions/NewCustomer'
 *       - required:
 *         - id
 *       - properties:
 *         id:
 *           type: integer
 *           format: int64
*/


/**
 * @swagger
 * /customers:
 *   get:
 *     description: Returns all customers
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: customers
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Customer'
 *       500:
 *         description: Bad request
*/
app.get('/customers', async(req, res) => {
    try {
        const customers = await CustomerModel.find()
        res.status(200).json(customers)
    } catch(err) {        
        res.status(500).send('Error ' + err)
    }
});

/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     description: Returns a single customer by id
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: id
 *        description: customer's id
 *        in:   path
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *     responses:
 *       200:
 *         description: customer
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Customer'
 *       400:
 *         description: The specified customer ID is invalid.
 *       404:
 *         description: A customer with the specified ID was not found.
 *       500:
 *         description: Bad request
*/
app.get('/customers/:id', async(req, res) => {
    try {
        const customer = await CustomerModel.findById(req.params.id)
        res.status(200).json(customer)
    } catch(err) {        
        res.status(500).send('Error ' + err)
    }
});

/**
 * @swagger
 * /customers/{id}:
 *   put:
 *     description: Update a single customer by id
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: id
 *        description: customer's id
 *        in:   path
 *        required: true
 *        schema:
 *          type: string
 *          format: string
 *      - name: customer
 *        description: customer object
 *        in:   body
 *        required: true
 *        schema:
 *          type: object
 *          $ref: '#/definitions/UpdateCustomer'
 *     responses:
 *       200:
 *         description: customer
 *         schema:
 *           type: object
 *           items:
 *             $ref: '#/definitions/Customer'
 *       400:
 *         description: The specified customer ID is invalid.
 *       404:
 *         description: A customer with the specified ID was not found.
 *       500:
 *         description: Bad request
*/
app.put('/customers/:id', async(req, res) => {
    try {
        const customer = await CustomerModel.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).json(customer);
    } catch(err) {        
        res.status(500).send('Error ' + err)
    }
});

/**
 * @swagger
 * /customers/{id}:
 *   delete:
 *     description: Deletes a new customer
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: id
 *        description: customer's id
 *        in:   path
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: customer deleted
 *       400:
 *         description: The specified customer is invalid.
 *       404:
 *         description: Customer not found.
 *       500:
 *         description: Bad request
*/
app.delete('/customers/:id', async(req, res) => {
    try {
        const customer = await CustomerModel.findByIdAndRemove(req.params.id)
        res.status(200).json(customer);
    } catch(err) {        
        res.status(500).send('Error ' + err)
    }
});

/**
 * @swagger
 * /customers:
 *   post:
 *     description: Creates a new customer
 *     produces:
 *      - application/json
 *     parameters:
 *      - name: customer
 *        description: customer object
 *        in:   body
 *        required: true
 *        type: object
 *        schema:
 *          $ref: '#/definitions/NewCustomer'
 *     responses:
 *       201:
 *         description: customer created
 *         schema:
 *           $ref: '#/definitions/Customer'
 *       400:
 *         description: The specified customer is invalid.
 *       404:
 *         description: Customer not found.
 *       500:
 *         description: Bad request
*/
app.post('/customers', async(req, res) => {
    try {
        const customer = new CustomerModel(req.body)
        const resp = await customer.save()
        res.status(201).json(resp)
    } catch(err) {        
        res.status(500).send('Error ' + err)
    }
});

//Launch listening server on port 8081
app.listen(port, function () {
    console.log('app listening on port 8081!')
})