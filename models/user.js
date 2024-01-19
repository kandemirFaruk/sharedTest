import mongoose from "mongoose";
import bcrypt from "bcrypt"
const { Schema } = mongoose;

const userModel = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdTest: [],
  joinedTest: [],
  createDate:{
    type:Date,
    default:Date.now(),
  }
});

userModel.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) return next();
  
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
  });
  
const User = mongoose.model('User', userModel);
 export default User