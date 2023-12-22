const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', awaitHandlerFactory(serviceController.serviceCheck)); // localhost:3000/api/v1/web

module.exports = router;
