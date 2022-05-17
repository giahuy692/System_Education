const authControllers = require("../controllers/authControllers");

const router = require("express").Router();

//Register
router.post("/register",authControllers.registerUser);


//Login
router.post("/login",authControllers.loginUser);



module.exports = router;