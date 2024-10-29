import mongoose from "mongoose";
const problemschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    acceptance: {
        type: String,
        required: true
    },
    testCases: [
        {
            input: {
                type: String,
                required: true,
            },
            expectedOutput: {
                type: String,
                required: true,
            },
        },
    ],
    difficulty: {
        type: String,
        required: true,
    }
})

const Problem_Schema = mongoose.model('Problem_Schema', problemschema);

export default Problem_Schema;