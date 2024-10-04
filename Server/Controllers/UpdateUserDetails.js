const getUserDetailsFromToken= require('../Helpers/GetUserDetailsFromToken.js')
const userModel= require('../Models/User.js')

async function updateUserDetails(req,res){
    const token= req.cookies.token
    const {id,email}= await getUserDetailsFromToken(token)
    if(!email){
        return res.status(400).json({
            message:'token empty or incorrect',
            error:true
        })
    }
    const {name,profilePic}= req.body
    const user= await userModel.updateOne({email},{name,profilePic})

    res.status(400).json({
        message:'update done',
        data:user,
        success:true
    })

}

module.exports= updateUserDetails