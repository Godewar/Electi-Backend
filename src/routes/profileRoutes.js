const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { me, updateMe } = require("../controllers/profileController");

const router = express.Router();

router.get("/me", requireAuth, me);
router.put("/me", requireAuth, updateMe);

module.exports = router;
