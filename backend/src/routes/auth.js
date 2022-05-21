const authControllers = require('../controllers/authControllers');
const middlewareController = require('../controllers/middlewareControllers')

const router = require('express').Router();

//Register
router.post('/register', authControllers.registerUser);

//Login
router.post('/login', authControllers.loginUser);

router.post('/refresh',authControllers.requestRefreshToken);

router.post("/logout",middlewareController.verifyToken, authControllers.userLogout);

module.exports = router;
