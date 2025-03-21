const express = require('express')
const router = express.Router()
const {registerUser, loginUser, getUser} = require('../controller/userController')
const userMiddleware = require('../middlewares/userMiddleware')

router.post('/user-register', registerUser)
router.post('/user-login', loginUser)
router.get('/user-get-details',userMiddleware, getUser)

module.exports = router
