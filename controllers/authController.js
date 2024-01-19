import User from "../models/user.js";
import bcrypt from "bcrypt";

const createUser = async(req, res) => {
  try {
    const user = req.body;

    const existingUser = await User.findOne({ email: user.email });
    if (existingUser) {
      return res.status(475).json({
        message: "E-mail Kullanılıyor.",
      });
    } else {
      let newUser = await User.create(user);
      return res.status(200).json({
        message: "Başarıyla kaydedildi",
        userId:newUser._id,
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: "Başarısız",
      error: error.message, // veya error
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(475).json({ message: "Kullanıcı adı veya şifre yanlış" });
    } else {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          return res.status(200).json({ 
            message: "Başarıyla giriş yapıldı",
            userId:user._id,
          });
        } else {
          return res
            .status(475)
            .json({ message: "Kullanıcı adı veya şifre yanlış" });
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Sunucu hatası" });
  }
};

export { createUser, loginUser };
