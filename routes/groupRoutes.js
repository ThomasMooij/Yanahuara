import express from "express"
import { verifyUser } from "../middleware/verifyUser.js";
import { addUserToGroup, createGroup } from "../controllers/groupsController.js";
import { validate } from "../middleware/validator.js"
import { createGroupSchema } from "../utils/YupSchemas/createGroupSchema.js";


const router = express.Router();

router.post("/create", verifyUser, createGroup)
router.post('/addUser', verifyUser, addUserToGroup)

export default router