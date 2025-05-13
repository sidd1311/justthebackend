const express = require("express");
const { addPaper, queryPapers } = require("../controllers/vdb_controller");

const router = express.Router();

router.post("/add", addPaper);
router.post("/query", queryPapers);

module.exports = router;
