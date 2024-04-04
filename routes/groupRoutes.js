import express from "express"
import { verifyUser } from "../middleware/verifyUser.js";
import { createGroup } from "../controllers/groupsController.js";

const router = express.Router();

router.post("/create", verifyUser, createGroup)

export default router