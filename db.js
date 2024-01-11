import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set("strictQuery", true);
const conn = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      dbName: "bitirme-projesi",
    });
    console.log("Veritabanına başarıyla bağlandı!");
  } catch (err) {
    console.error("Veritabanına bağlanırken bir hata oluştu:");
    console.error(err);
  }
};

export default conn;
