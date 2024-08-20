const express = require("express")
const followingController = require('../controller/FollowingController')
const authMiddleware = require("../middlewares/authMiddleWare")
const router = express.Router();


router.post("/add-follower",authMiddleware,followingController.addFollower)
router.post("/remove-following",authMiddleware,followingController.removeFollowing)
router.get("/get-following-work",authMiddleware,followingController.getFollowingWork)
router.get("/get-following-searchwork",authMiddleware,followingController.getFollowingSearchWork)
router.get("/show-followings",authMiddleware,followingController.showFollowings)
router.get("/show-followers",authMiddleware,followingController.showFollowers)


module.exports = router;