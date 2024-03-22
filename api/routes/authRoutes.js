import express from "express"
import { login, register, logout } from "../controllers/authController.js"
import { validate } from "../middleware/validator.js"
import { createUserSchema } from "../utils/YupSchemas/createUserSchema.js"

const router = express.Router()

router.post("/login", login)
router.post("/register", validate(createUserSchema) , register)
router.post("/logout",logout)

export default router