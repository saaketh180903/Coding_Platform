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
        type: Number, // Changed to Number to store accuracy as a percentage
        default: 0.0, // Default value
    },
    totalSubmissions: {
        type: Number, // Total number of submissions
        default: 0,
    },
    successfulSubmissions: {
        type: Number, // Total number of accepted submissions
        default: 0,
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
});

const Problem_Schema = mongoose.model('Problem_Schema', problemschema);

export default Problem_Schema;