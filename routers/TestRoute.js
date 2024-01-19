import express from "express";
import * as testController from "../controllers/testController.js"

const router = express.Router();

router.route("/createTest").post(testController.newTest);
router.route("/loginTest").post(testController.loginTest)

export default router;