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
  time: {
    type: Number,
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
      trueAnswer: { type: String, required: true, trim: true },
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
  createDate:{
    type:Date,
    default:Date.now,
  }
});
const Test = mongoose.model("Test", testModel);
export default Test;
