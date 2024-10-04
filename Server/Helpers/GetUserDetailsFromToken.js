const jwt= require('jsonwebtoken')

async function getUserDEtailsFromToken(token){
    if(!token){
        return {email:"",id:""}
    }
    const data= jwt.verify(token,'belive')
    if(!data)  return {email:"",id:""}
    return {email:data.email,id:data.id}
}

module.exports= getUserDEtailsFromToken