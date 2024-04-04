import express from "express"
import { verifyUser } from "../middleware/verifyUser.js";
import { addUserToGroup, createGroup, getGroupMembers } from "../controllers/groupsController.js";
import { validate } from "../middleware/validator.js"
import { createGroupSchema } from "../utils/YupSchemas/createGroupSchema.js";


const router = express.Router();

router.get("/:id", verifyUser, getGroupMembers)
router.post("/create", verifyUser, createGroup)
router.post('/addUser', verifyUser, addUserToGroup)

export default router