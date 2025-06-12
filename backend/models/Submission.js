import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    user: {//"the user who made this submission".
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // ref : means this `ObjectId` refers to a document in the `user` collection
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language :{
      type : String,
      default : "cpp",
      required : true
    },
    verdict: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Submission", submissionSchema);
