import User from "../models/user.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  try {
    const user = req.body;

    const existingUser = await User.findOne({ username: user.username });
    if (existingUser) {
      return res.status(475).json({
        msg: "Kullanıcı adı alınmıştır.",
      });
    } else {
      await User.create(user);
      return res.status(200).json({
        status: "Başarıyla kaydedildi",
        user,
      });
    }
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      status: "Başarısız",
      error: error.message, // veya error
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(475).json({ msg: "Kullanıcı adı veya şifre yanlış" });
    } else {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          return res.status(200).json({ msg: "Başarıyla giriş yapıldı", user });
        } else {
          return res
            .status(475)
            .json({ msg: "Kullanıcı adı veya şifre yanlış" });
        }
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Sunucu hatası" });
  }
};

export { createUser, loginUser };
