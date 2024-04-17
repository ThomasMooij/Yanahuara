import express from "express"
import { verifyUser } from "../middleware/verifyUser.js";
import { addUserToGroup, createGroup, getCurrentUserGroups, getGroupById, getGroupMembers } from "../controllers/groupsController.js";
import { validate } from "../middleware/validator.js"
import { createGroupSchema } from "../utils/YupSchemas/createGroupSchema.js";


const router = express.Router();

router.get('/getMyGroups', verifyUser, getCurrentUserGroups)
router.get('/getGroupById/:id', verifyUser, getGroupById)

router.get("/getGroupMembers/:id", verifyUser, getGroupMembers)
router.post("/create", verifyUser, createGroup)
router.post('/addUser/:id', verifyUser, addUserToGroup)



export default router