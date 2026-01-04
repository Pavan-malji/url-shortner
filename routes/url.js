const express = require("express"); 
const router = express.Router();
const { handleGenerateNewShortUrl } = require("../controllers/url");
const { handleGetUrlAnalytics } = require("../controllers/url");
router.post("/", handleGenerateNewShortUrl);
router.get("/analytics/:shortId", handleGetUrlAnalytics);
module.exports = router;