const userModel= require('../Models/User')

async function searchUser(req,res){
    const searchData= req.body.searchInput
    const query= new RegExp(searchData,'i','g')
    const users= await userModel.find({
        $or:[
            {
                name:query
            },
            {
                email:query
            }
        ]
    }).select('-password')
    return res.status(200).json({
        data:users
    })
}

module.exports= searchUser