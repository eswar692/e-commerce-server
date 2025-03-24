const express = require('express')
const router = express.Router()
<<<<<<< HEAD
const {registerUser, loginUser, logoutUser, getUser} = require('../controller/userController')
const tokenVarify = require('../middlewares/tokenVarify')

router.post('/user-register', registerUser)
router.post('/user-login', loginUser)
router.get('/user-logout', tokenVarify, logoutUser)
router.get('/user-get-user', tokenVarify, getUser)


=======
const {registerUser, loginUser, getUser} = require('../controller/userController')
const userMiddleware = require('../middlewares/userMiddleware')

router.post('/user-register', registerUser)
router.post('/user-login', loginUser)
router.get('/user-get-details',userMiddleware, getUser)
>>>>>>> d0bd6e27f496b93dbc2b1cd4a9a5156238953fe7

module.exports = router
