
const express = require("express");

const {
  getPublicContact,
} = require("../controllers/contactController");

const router = express.Router();

// Public route: get company contact details
router.get("/", getPublicContact);

module.exports = router;
