const express = require('express')
const router = express.Router()
const {registerUser, loginUser, logoutUser, getUser} = require('../controller/userController')
const tokenVarify = require('../middlewares/tokenVarify')

router.post('/user-register', registerUser)
router.post('/user-login', loginUser)
router.get('/user-logout', tokenVarify, logoutUser)
router.get('/user-get-user', tokenVarify, getUser)



module.exports = router
