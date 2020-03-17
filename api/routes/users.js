const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/UsersController');

router.get('/',checkAuth, UserController.index);
router.get('/:userID', checkAuth, UserController.show);
router.post('/signup',UserController.create);
router.delete('/:userID',checkAuth,UserController.destroy);
router.post('/login', UserController.login)

module.exports = router;