import express from "express"
import { verifyUser } from "../middleware/verifyUser.js";
import { addUserToGroup, createGroup, getGroupMembers } from "../controllers/groupsController.js";
import { getCurrentUser, getUserById } from "../controllers/userController.js";

import { validate } from "../middleware/validator.js"

const router = express.Router();

router.get("/current", verifyUser, getCurrentUser)
router.get("/:id", verifyUser, getUserById)

export default router