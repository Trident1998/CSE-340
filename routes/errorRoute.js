const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

router.get('/trigger-error', sutilities.handleErrors(errorController.triggerError));

module.exports = router;