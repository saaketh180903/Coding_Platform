import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    codelink: {
        type: String,
        required: true
    },
    tests: [
        {
            input: {
                type: String,
                required: true,
              },
              generatedOutput: {
                type: String,
                required: true,
              },
              expectedOutput: {
                type: String,
                required: true,
              },
              resultoftestcase: {
                type: String,
                required:true,
              }
        },
    ],
    verdict: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
    },
    dateTime: {
        type: Date,
        required: true
    }
})

const Submission_Schema = mongoose.model('Submission_Schema', submissionSchema);

export default Submission_Schema;