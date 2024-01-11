import Test from "../models/test.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";

const newTest = async (req, res) => {
  try {
    // Gelen istekten gerekli bilgileri al
    const {userId, testName, description, questions } = req.body;

    // Oluşturulan kodun veritabanında var olup olmadığını kontrol et
    let isCodeExist = true;
    let generatedCode;

    // Kod veritabanında var olduğu sürece yeni kod oluştur
    while (isCodeExist) {
      generatedCode = nanoid(6);
      isCodeExist = await Test.findOne({ code: generatedCode });
    }

    // Yeni bir test belgesi oluştur
    const user = await User.findById({_id:userId});

    const createdTest = await Test.create({
      creator:user._id,
      testName,
      description,
      questions,
      code: generatedCode,
    });

    user.createdTest.push(generatedCode);

    await user.save();
    
    // Başarı durumunu istemciye bildir
    res.status(201).json({ test: createdTest, code: generatedCode });
    
  } catch (error) {
    console.log("Eroor: ", error);
    // Hata durumunu istemciye bildir
    res.status(500).json({ error: "Sunucu Hatası" });
  }
};

export { newTest };
