import express from "express";
import * as testController from "../controllers/testController.js"

const router = express.Router();

router.route("/createTest").post(testController.newTest);
router.route("/logintest").post(testController.loginTest)
router.route("/getusersalltest").post(testController.getUsersAllTest)
router.route("/getusersonetest").post(testController.getUsersOneTest)

export default router;