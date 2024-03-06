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
const getUsersAllTest = async (req, res) => {
  try {
    const { userId } = req.body;
    const tests = await Test.find({ creator: userId });
    res.status(200).json({
      message: "success",
      tests,
    });
    console.log("************ Test ************* /n", tests);
  } catch (error) {
    console.log("Error: ", error);
    // Hata durumunu istemciye bildir
    res.status(500).json({ error: "Sunucu Hatası" });
  }
};
const getUsersOneTest = async (req, res) => {
  try {
    const { testId, userId } = req.body;
    const test = await Test.findOne({ _id: testId, creator: userId });
    res.status(200).json({
      message: "success",
      test,
    });
  } catch (error) {
    console.log("Error: ", error);
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
      console.log("************ ", user, " ***************");

      user.joinedTest.push(loginCode);
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
const questionResult = async (req, res) => {
  try {
    const { userID, testID, questionID, answer } = req.body;

    // Kullanıcı ve testi bul
    const user = await User.findOne({ _id: userID });
    const test = await Test.findById(testID);

    // Soruyu bul
    const question = test.questions.find(
      (q) => q._id.toString() === questionID
    );

    if (!question) {
      return res.status(404).json("Soru bulunamadı!");
    }

    // Doğru cevabı kontrol et
    const correctAnswer = question.trueAnswer;

    // Cevap nesnesi oluştur
    const answerObject = {
      userId: user._id,
      questionId: question._id,
      answer: answer,
      result: answer === correctAnswer,
    };

    const resultObj = {
      testID,
      users: [
        {
          userID,
          answer: [
            {
              question: question.question,
              answer: answerObject.answer,
              trueAnswer: correctAnswer,
              result: answerObject.result,
            },
          ],
        },
      ],
    };

    // **Cevapları Kaydet:**

    // Mevcut cevabı kontrol et
    const existingAnswer = await Answer.findOne({ testID, userID });
    console.log(existingAnswer);

    if (existingAnswer) {
      // Mevcut cevaba yeni soru ekle
      existingAnswer.users[0].answer.push({
        question: question.question,
        answer: answerObject.answer,
        trueAnswer: correctAnswer,
        result: answerObject.result,
      });

      await existingAnswer.save();
    } else {
      // Yeni bir cevap nesnesi oluştur ve kaydet
      await new Answer(resultObj).save();
    }

    // **Sonuç Gönder:**

    res.status(201).json({
      message: "Cevap başarıyla kaydedildi!",
      data: resultObj,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu Hatası!" });
  }
};
export { newTest, getUsersAllTest, getUsersOneTest, loginTest ,questionResult};
