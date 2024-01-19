import Test from "../models/test.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";

const newTest = async (req, res) => {
  try {
    // Gelen istekten gerekli bilgileri al
    const { userId, testName, description, questions, time } = req.body;

    // Oluşturulan kodun veritabanında var olup olmadığını kontrol et
    let isCodeExist = true;
    let generatedCode;

    // Kod veritabanında var olduğu sürece yeni kod oluştur
    while (isCodeExist) {
      generatedCode = nanoid(6);
      isCodeExist = await Test.findOne({ code: generatedCode });
    }

    // Yeni bir test belgesi oluştur
    const user = await User.findOne({ _id: userId });
    console.log("user************** ", user);

    const createdTest = await Test.create({
      creator: user._id,
      testName,
      description,
      questions,
      code: generatedCode,
      time,
    });

    user.createdTest.push(generatedCode);

    await user.save();

    // Başarı durumunu istemciye bildir
    res.status(201).json({ test: createdTest, code: generatedCode });
  } catch (error) {
    console.log("Eror: ", error);
    // Hata durumunu istemciye bildir
    res.status(500).json({ error: "Sunucu Hatası" });
  }
};

const loginTest = async (req, res) => {
  try {
    const { userID, loginCode } = req.body; // loginCode'ı req.body.code olarak alın

    const isCodeExist = await Test.findOne({ code: loginCode });

    if (isCodeExist) {
      const user = await User.findOne({ _id: userID });

      user.JoinedTest.push(loginCode);
      await user.save();
      
      const questions = await Test.find();
      res.status(201).json({
        message: "success",
        questions,
      });
    } else {
      res.status(404).json({ error: "Kod bulunamadı" });
    }
  } catch (error) {
    console.log("Error: ", error);
    // Hata durumunu istemciye bildir
    res.status(500).json({ error: "Sunucu Hatası" });
  }
};

export { newTest, loginTest };
