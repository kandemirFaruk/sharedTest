import Answer from "../models/answer.js";
import Test from "../models/test.js";
import User from "../models/user.js";
import { customAlphabet } from "nanoid";

const newTest = async (req, res) => {
  try {
    // Gelen istekten gerekli bilgileri al
    const { userId, testName, description, questions, time } = req.body;

    // Oluşturulan kodun veritabanında var olup olmadığını kontrol et
    let isCodeExist = true;
    let generatedCode;

    const alphabet =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    // Kod veritabanında var olduğu sürece yeni kod oluştur
    while (isCodeExist) {
      const generateRandomString = customAlphabet(alphabet, 6); // 6 karakterlik rastgele bir dize oluştur
      generatedCode = generateRandomString();
      isCodeExist = await Test.findOne({ code: generatedCode });
    }

    // Yeni bir test belgesi oluştur
    const user = await User.findOne({ _id: userId });

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
  } catch (error) {
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
    // Hata durumunu istemciye bildir
    res.status(500).json({ error: "Sunucu Hatası" });
  }
};
const loginTest = async (req, res) => {
  try {
    const { userID, loginCode } = req.body; // loginCode'ı req.body.code olarak alın

    const isCodeExist = await Test.findOne({ code: loginCode });
    if (isCodeExist?.isClosed === true) {
      res.status(400).json({ status: "Girdiğiniz test kapalıdır" });
    } else {
      const user = await User.findOne({ _id: userID });

      if (user.joinedTest.includes(loginCode)) {
        // Kullanıcı daha önce bu teste giriş yapmışsa
        res.status(400).json({ status: "Bu teste zaten giriş yapmışsınız" });
      } else {
        // Kullanıcı ilk defa teste giriş yapıyorsa
        if (isCodeExist) {
          user.joinedTest.push(loginCode);
          await user.save();

          const test = await Test.findOne({ code: loginCode });
          res.status(201).json({
            message: "success",
            test,
          });
        } else {
          res.status(404).json({ error: "Kod bulunamadı" });
        }
      }
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
    console.log(question);

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
          name: user.name,
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

    // Mevcut cevabı kontrol et
    const existingAnswer = await Answer.findOne({
      testID,
      users: { $elemMatch: { userID } },
    });

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

const getCloseTest = async (req, res) => {
  try {
    const { testID } = req.body;
    const test = await Test.findOne({ _id: testID });

    if (test.isClosed === false) {
      test.isClosed = true;
      test.code = "0";
      await test.save();
      res.status(200).json({ status: "Succeses", test });
    } else {
      res.status(400).json({ status: "Test Kapalı." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu Hatası!" });
  }
};

const getATestUserResult = async (req, res) => {
  try {
    const { userID } = req.body;
    const testResults = await Answer.find({
      users: { $elemMatch: { userID } },
    }).sort({ createDate: -1 });

    if (!testResults || testResults.length === 0) {
      return res.status(404).json("Bu sınav için cevap bulunamadı.");
    }

    // Tüm testlerin ID'lerini bir diziye topla
    const testIDs = testResults.map((result) => result.testID);

    // Tüm testlerin adlarını bir kereye mahsus olarak al
    const tests = await Test.find({ _id: { $in: testIDs } }).select(
      "_id testName"
    );

    // Her testin ID'sini anahtar olarak kullanarak bir obje oluştur
    const testNamesMap = {};
    tests.forEach((test) => {
      testNamesMap[test._id] = test.testName;
    });

    const formattedResults = [];

    testResults.forEach((result) => {
      const testName = testNamesMap[result.testID];
      const formattedResult = {
        TestId: result.testID,
        TestName: testName,
        Answers: result.users.map((user) => ({
          UserID: user.userID,
          Name: user.name,
          createDate: result.users.createDate,
          AnswerList: user.answer.map((answer) => ({
            Question: answer.question,
            Answer: answer.answer,
            TrueAnswer: answer.trueAnswer,
            Result: answer.result,
          })),
        })),
        createDate: testResults.createDate,
      };

      formattedResults.push(formattedResult);
    });

    res.status(201).json(formattedResults);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Sunucu Hatası" });
  }
};
const getAllUsersTestResponses = async (req, res) => {
  try {
    const { testID } = req.body;
  
    // Verilen testID'ye sahip olan tüm cevapları bul
    const testResults = await Answer.find({ testID }).sort({ createDate: -1 });
  
    // Eğer sonuç yoksa veya boşsa, 404 döndür
    if (!testResults || testResults.length === 0) {
      return res.status(404).json("Bu test için cevap bulunamadı.");
    }
  
    // Tüm testlerin adını bul
    const testName = await Test.findOne({ _id: testID }).select("testName");
  
    // Formatlanmış sonuçları tutacak bir dizi oluştur
    const formattedResults = [];
  
    // Her test sonucunu döngüye al ve formatla
    testResults.forEach((result) => {
      const formattedResult = {
        TestId: result.testID,
        TestName: testName.testName,
        Answers: result.users.map((user) => ({
          UserID: user.userID,
          Name: user.name,
          AnswerList: user.answer.map((answer) => ({
            Question: answer.question,
            Answer: answer.answer,
            TrueAnswer: answer.trueAnswer,
            Result: answer.result,
          })),
          createDate: result.createDate
        }))
      };
  
      formattedResults.push(formattedResult);
    });
  
    res.status(200).json(formattedResults);
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Sunucu Hatası" });
  }
  
};
export {
  newTest,
  getUsersAllTest,
  getUsersOneTest,
  loginTest,
  questionResult,
  getCloseTest,
  getATestUserResult,
  getAllUsersTestResponses,
};
