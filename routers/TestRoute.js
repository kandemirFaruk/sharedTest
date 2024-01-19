import express from "express";
import * as testController from "../controllers/testController.js"

const router = express.Router();

router.route("/createTest").post(testController.newTest);
router.route("/loginTest").post(testController.loginTest)
router.route("/getAllTest").post(testController.getAllTest)
router.route("/getATest").post(testController.getATest)

export default router;