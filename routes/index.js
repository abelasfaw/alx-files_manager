const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();
router.route('/status')
  .get(AppController.getStatus);
router.route('/stats')
  .get(AppController.getStats);
router.route('/users')
  .post(UsersController.postNew);
module.exports = router;
