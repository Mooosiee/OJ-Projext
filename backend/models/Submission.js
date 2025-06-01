import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    problemId : String,
    code : String,
    input : String,
    output : String,
    verdict : String
});

export default mongoose.model('Submission',submissionSchema);