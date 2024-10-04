const userModel= require('../Models/User.js')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')

async function checkPassword(req,res){
    const {password,userId}= req.body
    const user= await userModel.findOne({_id:userId})
    if(!user){
        return res.status(500).json({
            message:'userId not exist',
            error:true
        })
    }
    const correct= await bcrypt.compare(password,user.password)
    if(!correct){
        return res.status(400).json({
            message:'password wrong',
            error:true
        })
    }
    const token= jwt.sign({email:user.email,id:userId},'belive',{expiresIn:'1d'})
    res.cookie('token',token)
    return res.status(200).json({
        message:'login success',
        token,
        user,
        success:true
    })
}

module.exports= checkPassword