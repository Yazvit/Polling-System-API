const express = require('express');
const router = express.Router();

const optionController = require('../controllers/option');

/**---------- route for deleting specified option - http://localhost:8000/options/:id/delete --------**/
router.post('/:optionId/delete', optionController.delete);
/**----------  route for adding vote to a specified option-http://localhost:8000/options/:id/add_vote -----------**/
router.get('/:optionId/add_vote', optionController.addVote);

module.exports = router;