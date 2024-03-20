import express from "express"
import { upload } from "../controllers/uploadController.js"

const router = express.Router()
//ADD AUTHENTICATION MIDDLEWARE(VERIFYTOKEN)
router.get('/upload', upload)

export default router