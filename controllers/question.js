// import required models
const Question = require('../models/question');
const Option = require('../models/option');

// controllers/question.js

// ...

// controllers/question.js

// ...

module.exports.listAll = async function (req, res) {
    try {
        // find all the questions with their linked options
        const questions = await Question.find({}, 'title options').populate('options', 'text votes link_to_vote');

        const formattedQuestions = questions.map(question => {
            return {
                id: question._id,
                title: question.title,
                options: question.options.map(option => {
                    return {
                        id: option._id,
                        text: option.text,
                        votes: option.votes,
                        link_to_vote: `http://localhost:8001/options/${option._id.toString()}/add_vote`
                    };
                })
            };
        });

        res.status(200).json({
            questionsCount: formattedQuestions.length,
            questions: formattedQuestions
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
}

// ...


// ...


// create a new question
module.exports.create = async function(req, res){
    try{
        // create question
        const question = new Question({
            title: req.body.title
        });
        // save question
        await question.save();

        return res.status(201).json({
            message: "Question has been created.",
            question: {
                _id: question._id,
                title: question.title
            }
        });
    }catch(error){
        return res.status(500).json({
            message: "Error",
            error: error
        });
    }
}

module.exports.addOption = async function(req, res){
    try{
        // find question
        const question = await Question.findById(req.params.questionId);

        if(!question){
            return res.status(404).json({
                message: "Question not found!"
            });
        }

        // create a new option
        const option = new Option({
            text: req.body.text,
            questionRef: req.params.questionId,
        });

        option.link_to_vote = `http://localhost:8001/options/${option._id}/add_vote`;

        // save option
        await option.save();

        // created option's reference is added in options array of question
        question.options.push(option);

        // new changes saved in question
        await question.save();

        res.status(200).json({
            message: "Option created successfully!",
            optionCreated: true,
            option: {
                _id: option._id,
                text: option.text
            }
        });
    }catch(error){
        console.log('Error: ',error);
        res.status(500).json({
            message: error.message
        });
    }
}

// delete question
module.exports.delete = async function(req, res) {
    try {
        // delete question
        const question = await Question.deleteOne({ _id: req.params.questionId });

        // if question not deleted
        if (question.deletedCount === 0) {
            return res.status(404).json({
                message: "Question not found."
            });
        }

        // options, which are linked with deleted question, get removed
        await Option.deleteMany({ questionRef: req.params.questionId });

        return res.status(200).json({
            message: "Question has been deleted",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
}
module.exports.listQuestion = async function(req,res){
    try{
        // find question and store its data with linked options data
        const question = await Question.findById(req.params.questionId)
            .populate({ path: 'options', select: '_id text votes link_to_vote'})
            .exec();
        
        if(!question){
            return res.status(404).json({
                message: "Question not found with this questionId"
            });
        }

        return res.status(200).json({
            message: "Question fetched successfully!",
            data: question
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
}

/*module.exports.listQuestion = async function (req, res) {
    try {
        // find question and store its data with linked options data
        const question = await Question.findById(req.params.questionId)
            .populate({ path: 'options', select: '_id text votes link_to_vote' })
            .exec();

        if (!question) {
            return res.status(404).json({
                message: "Question not found with this questionId"
            });
        }

        // Create an array to store formatted options
        const formattedOptions = question.options.map((option, index) => {
            return {
                optionId: option._id,
                optionNumber: index + 1,
                text: option.text,
                votes: option.votes,
                link_to_vote: option.link_to_vote
            };
        });

        return res.status(200).json({
            message: "Question fetched successfully!",
            data: {
                question: {
                    questionId: question._id,
                    text: question.text
                },
                options: formattedOptions
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
};
*/