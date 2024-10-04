const express= require('express')
const router= express.Router()
const registerUser= require('../Controllers/RegisterUser.js')
const checkEmail= require('../Controllers/CheckEmail.js')
const checkPassword= require('../Controllers/CheckPassword.js')
const userDetails= require('../Controllers/UserDetails.js')
const updateUserDetails= require('../Controllers/UpdateUserDetails.js')
const logout= require('../Controllers/Logout.js')
const searchUser = require('../Controllers/SearchUser.js')

router.post('/register',registerUser)
router.post('/email',checkEmail)
router.post('/password',checkPassword)
router.post('/userDetails',userDetails)
router.get('/logout',logout)
router.post('/updateUserDetails',updateUserDetails)
router.post('/searchUser',searchUser)

module.exports= router