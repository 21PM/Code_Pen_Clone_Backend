const express = require("express")
const followingController = require('../controller/FollowingController')
const authMiddleware = require("../middlewares/authMiddleWare")
const router = express.Router();


router.post("/add-follower",authMiddleware,followingController.addFollower)


module.exports = router;