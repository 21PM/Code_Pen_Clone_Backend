const express = require("express")
const userController = require("../controller/usercontroller")
const router = express.Router()

router.post("/signup",userController.SignUp)
router.post("/login",userController.Login)

module.exports = router;