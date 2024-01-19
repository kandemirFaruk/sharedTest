import express from "express";
import dotenv from "dotenv";
import conn from "./db.js"
import authRoute from "./routers/AuthRoute.js"
import userRoute from "./routers/UserRoute.js"
import testRoute from "./routers/TestRoute.js"


const app = express();
dotenv.config();
conn()

const port = process.env.PORT;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.use("/auth",authRoute)
app.use("/user",userRoute)
app.use("/test",testRoute)
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
