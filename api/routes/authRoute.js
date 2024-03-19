import express from "express"
import { login, register, logout } from "../controllers/authController.js"

const router = express.Router()
//ADD MIDDLEWARE
router.post("/login", login)
router.post("/register", register)
router.post("/logout",logout)

export default router