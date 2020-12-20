const express = require('express')
const router = express.Router();
const CustomerModel = require('../models/customer.model')

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
        servers: ["http://localhost:8081/customers"]
    }
 },
 apis: ["customer.controller.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
 *         type: email
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
 *         type: email
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
router.get('/', async(req, res) => {
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
router.get('/:id', async(req, res) => {
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
 *   patch:
 *     description: Update a single customer by id
 *     produces:
 *      - application/json
 *     parameters:
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
router.patch('/:id', async(req, res) => {
    try {
        const customer = await CustomerModel.findById(req.params.id)
        customer.sub = req.body.sub
        const cust = await customer.save()
        res.status(200).json(cust)
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
router.put('/:id', async(req, res) => {
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
router.delete('/:id', async(req, res) => {
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
router.post('/', async(req, res) => {
    try {
        const customer = new CustomerModel({
            firstName: "Pepita",
            lastName: "Perez",
            email: "pepita@email.com",
            phoneNumber: "55555555",
            city: "Medellín",
            country: "Colombia"
        })
        const resp = await customer.save()
        res.status(201).json(resp)
    } catch(err) {        
        res.status(500).send('Error ' + err)
    }
});

module.exports = router
