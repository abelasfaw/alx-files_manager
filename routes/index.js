const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
const FilesController = require('../controllers/FilesController');

const router = express.Router();
router.route('/status')
  .get(AppController.getStatus);
router.route('/stats')
  .get(AppController.getStats);
router.route('/users')
  .post(UsersController.postNew);
router.route('/connect')
  .get(AuthController.getConnect);
router.route('/disconnect')
  .get(AuthController.getDisconnect);
router.route('/users/me')
  .get(UsersController.getMe);
router.route('/files')
  .post(FilesController.postUpload);
module.exports = router;
