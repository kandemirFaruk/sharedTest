import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.route("/changepassword").post(userController.passwordChanged);

export default router;