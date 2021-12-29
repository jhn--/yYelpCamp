// aka the landing page for the site
const express = require("express");
const router = express.Router();
const { _feIndex, _fe404 } = require("../../controllers/frontpage");

router.get("/", _feIndex);
router.all("*", _fe404);

module.exports = router;
