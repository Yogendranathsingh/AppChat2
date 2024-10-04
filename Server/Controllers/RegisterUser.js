const bcrypt = require('bcrypt')
const userModel = require('../Models/User.js');

async function registerUser(req, res) {
    try {
        const { name, email, password, profilePic } = req.body;
        const users = await userModel.find({ email })
        if (users.length > 0) return res.status(400).json({
            message: 'user already exist',
            error: true
        })
        bcrypt.genSalt(10, (error, salt) => {
            bcrypt.hash(password, salt, async (error, hash) => {
                const createdUser = await userModel.create({
                    name,
                    email,
                    password: hash,
                    profilePic
                })

                return res.status(200).json({
                    message: 'user created successfully',
                    data: createdUser,
                    success: true
                })
            })
        })
    } catch (error) {
        console.error('Error during user registration:', error);
        return res.status(400).json({
            message: 'Internal Server Error',
            error: error?.message,
        })
    }
}

module.exports = registerUser