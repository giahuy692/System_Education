const middlewareController = require('../controllers/middlewareControllers');
const userController = require('../controllers/userControllers')

const router = require('express').Router();

//GET ALL USER
router.get('/', middlewareController.verifyToken, userController.getAllUser);

//DELETE USER
router.delete('/:id',middlewareController.verifyTokenAndAdminAuth,userController.deleteUser);

module.exports  = router