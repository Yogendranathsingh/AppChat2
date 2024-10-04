const userModel= require('../Models/User.js')

async function checkEmail(req,res){
    const {email}= req.body
    const user= await userModel.findOne({email}).select('-password')
    if(!user){
        return res.status(400).json({
            message:'user not exist',
            error:true
        })
    }
    return res.status(200).json({
        message:'email verified',
        data:user,
        success:true
    })
}

module.exports= checkEmail