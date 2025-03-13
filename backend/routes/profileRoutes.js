const express = require("express");
const router = express.Router();
const {createProfile, getProfile, updateProfile, deleteProfile}= require("../controllers/profilesController");

router.post("/profiles", createProfile);
router.get("/profiles/:user_id", getProfile);
router.put("/profiles/:user_id", updateProfile);
router.delete("/profiles/:user_id", deleteProfile);

module.exports = router;
