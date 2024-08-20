const express = require("express")
const userController = require("../controller/usercontroller")
const authMiddleWare = require("../middlewares/authMiddleWare")

const router = express.Router()


router.post("/signup",userController.SignUp)
router.post("/login",userController.Login)
router.post("/logout",authMiddleWare,userController.Logout)

module.exports = router;