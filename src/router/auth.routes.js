import { Router } from 'express'
import { register, login, getMe } from '../controllers/authControllers.js'
const router = Router()


router.post('register',register)
router.post('/login', login)
router.post('/me', getMe)

export default router