import mongoose from "mongoose";
const problemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    inputFormat: {
      type: String,
      required: true,
    },
    outputFormat: {
      type: String,
      required: true,
    },
    constraints: {
      type: String,
      required: true,
    },
    userRef: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    sampleInput: {
      type: String,
      required: true,
    },
    sampleOutput: {
      type: String,
      required: true,
    },
    testcases: {
      type: [
        {
          input: { type: String, required: true },
          output: { type: String, required: true },
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Problem = mongoose.model("Problem", problemSchema);
export default Problem;
