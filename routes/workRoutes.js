const express = require("express")
const authMiddleWare = require("../middlewares/authMiddleWare")
const workController = require("../controller/workcontroller")
const router = express.Router()

router.get("/my-work",authMiddleWare,workController.myWork)
router.post("/add-work",authMiddleWare,workController.addWork)
router.post("/delete-work/:workId",authMiddleWare,workController.deleteWorK)
router.post("/edit-work/:workId",authMiddleWare,workController.editWork)
router.get("/search-my-work",authMiddleWare,workController.searchWork)
router.get("/trending-work",workController.TrendingWork)


module.exports = router