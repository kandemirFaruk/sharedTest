import mongoose from "mongoose";
const { Schema } = mongoose;

const answerModel = new Schema({
  testID: {
    type: String,
    required: true,
  },
  users: [
    {
      userID: {
        type: String,
        required: true,
      },
      answer: [],
    },
  ],
});

const Answer = mongoose.model("Answer", answerModel);
export default Answer;