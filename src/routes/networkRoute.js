const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', awaitHandlerFactory(networkController.networkCheck)); // localhost:3000/api/v1/web

module.exports = router;
