const express = require('express');

const router = express.Router();

router.get("/",(req,resp)=>{
    resp.render("home")
})

// handles routes related to questions
router.use('/questions', require('./question'));

// handles routes related to options
router.use('/options', require('./option'));

module.exports = router;