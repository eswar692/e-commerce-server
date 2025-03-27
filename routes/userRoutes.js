const express = require('express')
const router = express.Router()
const {registerUser, loginUser, logoutUser, getUser, otpSend, otpVerify} = require('../controller/userController')
const tokenVarify = require('../middlewares/tokenVarify')

router.post('/user-register', registerUser)
router.post('/user-login', loginUser)
router.get('/user-logout', tokenVarify, logoutUser)
router.get('/user-get-details', tokenVarify, getUser)
router.post('/user-otp-send',  otpSend)
router.post('/user-otp-verify',  otpVerify)



module.exports = router
