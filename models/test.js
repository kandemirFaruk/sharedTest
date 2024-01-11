import mongoose from "mongoose";
const { Schema } = mongoose;

const testModel = new Schema({
  creator: {
    type: String,
    required: true,
    trim: true,
  },
  testName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  questions: [
    {
      question: {type: String,required: true,trim: true},
      optionA: { type: String, required: true, trim: true },
      optionB: { type: String, required: true, trim: true },
      optionC: { type: String, required: true, trim: true },
      optionD: { type: String, required: true, trim: true },
      optionE: { type: String, required: true, trim: true },
      trueOption: { type: String, required: true, trim: true },
      time: { type: Number, required: true },
    },
  ],
  code: {
    type: String,
    required: true,
  },
  isClosed: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const Test = mongoose.model("Test", testModel);
export default Test;