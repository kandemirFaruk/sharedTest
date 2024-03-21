import express from "express";
import * as testController from "../controllers/testController.js"

const router = express.Router();

router.route("/createTest").post(testController.newTest);
router.route("/logintest").post(testController.loginTest)
router.route("/getusersalltest").post(testController.getUsersAllTest)
router.route("/getusersonetest").post(testController.getUsersOneTest)
router.route("/questionResult").post(testController.questionResult)
router.route("/getCloseTest").post(testController.getCloseTest)
router.route("/getATestUserResult").post(testController.getATestUserResult)

export default router;