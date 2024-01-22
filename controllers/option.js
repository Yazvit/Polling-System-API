// importing required models
const Option = require('../models/option');
const Question = require('../models/question');

// delete option

module.exports.delete = async function(req, res){
    try {
        // find and remove option
        const option = await Option.findOneAndDelete({
            _id: req.params.optionId
        });

        if (!option) {
            return res.status(404).json({
                message: "Option not found."
            });
        }

        // find and remove reference of option from question document
        const result = await Question.findOneAndUpdate({ _id: option.questionRef }, { $pull: { options: option._id } });

        return res.status(200).json({
            message: "Option deleted successfully!",
        });
    } catch(error) {
        console.log('Error:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
}

// ...


module.exports.addVote = async function(req, res){
    try{
        // find option
        const option = await Option.findOneAndUpdate(
            { _id: req.params.optionId },
            { $inc: { votes: 1 } },
            { new: true } // Returns the updated option
        );

        if(!option){
            return res.status(404).json({
                message: "No option found."
            });
        }

        return res.status(200).json({
            message: "Vote added!",
            option: {
                id: option._id,
                text: option.text,
                votes: option.votes,
                link_to_vote: `http://localhost:8001/options/${option._id}/add_vote`
            }
        });
    }catch(error){
        return res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
}