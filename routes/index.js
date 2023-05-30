const express = require('express');
const AppController = require('../controllers/AppController');

const router = express.Router();
router.route('/status')
  .get(AppController.getStatus);
router.route('/stats')
  .get(AppController.getStats);
module.exports = router;
