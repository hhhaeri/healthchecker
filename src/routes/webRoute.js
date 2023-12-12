const express = require('express');
const router = express.Router();
const webController = require('../controllers/webController');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', awaitHandlerFactory(webController.webCheck)); // localhost:3000/api/v1/web

module.exports = router;
