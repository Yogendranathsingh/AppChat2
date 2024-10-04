const getUserDEtailsFromToken= require('../Helpers/GetUserDetailsFromToken')
const userModel= require('../Models/User.js')

async function userDetails(req,res){
    // const token= req.cookies.token
    const token= req.body.token
    const {id,email}= await getUserDEtailsFromToken(token)
    if(!email){
       return res.status(400).json({
            message:'token is empty or incorrect',
            error:true
        })
    }
    const user = await userModel.findById(id).select('-password')
    res.status(200).json(user)
}

module.exports= userDetails