import User from "../models/user.js";
import bcrypt from "bcrypt";

const passwordChanged = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (currentPassword === newPassword) {
      res.status(475).json({
        status: "fail",
        error: "eski şifre ile yeni şifre aynı olamaz...",
      });
    } else {
      const user = await User.findOne({ _id: userId });
      if (user) {
        bcrypt.compare(currentPassword, user.password, async (err, same) => {
          if (same) {
            user.password = newPassword.toString();
            await user.save();
            res.status(200).json({
              message: "success",
            });
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Sunucu hatası." });
  }
};

export { passwordChanged };
