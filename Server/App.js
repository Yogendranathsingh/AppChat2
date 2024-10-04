require('dotenv').config()
const express= require('express')
const dbConnection= require('./Config/ConnectDB.js')
const userModel= require('./Models/User.js')
const conversationModel= require('./Models/Conversation.js')
const messageModel= require('./Models/Message.js')
const router= require('./Routes/Index.js')
const cookieParser= require('cookie-parser')
const {app,server}= require('./Socket/Index.js')
const cors= require('cors')



app.use(cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true // Allows credentials (cookies, etc.) to be sent
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',router)

app.get('/',(req,res)=>{
    res.send('today is 31st august.mai phone me cha rha kya?')
})
dbConnection().then(()=>{
    server.listen(3000,()=>{
        console.log('app is running on port number 3000...')
    })
})
