async function logout(req,res){
   res.cookie('token','')
   // localStorage.setItem('token','')
   res.status(200).json({
    message:'logout done',
    success:true
   })
}

module.exports= logout