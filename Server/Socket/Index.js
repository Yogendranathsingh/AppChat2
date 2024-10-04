const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const app = express()
const server = http.createServer(app)
const getUserDEtailsFromToken = require('../Helpers/GetUserDetailsFromToken')
const userModel = require('../Models/User')
const messageModel = require('../Models/Message')
const conversationModel = require('../Models/Conversation')
const mongoose= require('mongoose') 

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Frontend origin
    methods: ['GET', 'POST'],
    credentials: true
}
})

const onlineUser = new Set()

io.on('connection', async function (socket) {
  console.log('connected frontend: ', socket.id)

  const token = socket.handshake.auth.token
  const user = await getUserDEtailsFromToken(token)
  // console.log('userId: ',user.id)
  const conversations = await conversationModel.find({
    '$or': [
      { sender: user.id },
      { receiver: user.id },
    ]
  }).populate('sender').populate('receiver').populate('messages')
  const convUsers = conversations.map(function (conv) {
    const unSeenMsgCnt = conv.messages.reduce(function (accumulator, current) {
      return accumulator + (!current.seen && current.sendBy != user.id)
    }, 0)
    if (conv.sender._id == user.id) return {
      user: conv.receiver,
      lastMsg: conv.messages[conv.messages.length - 1],
      unSeenMsgCnt,
    }
    return {
      user: conv.sender,
      lastMsg: conv.messages[conv.messages.length - 1],
      unSeenMsgCnt,
    }
  })
  // console.log('convUsers: ',convUsers)
  socket.emit('convUsers', convUsers)
  socket.join(user?.id.toString())
  onlineUser.add(user.id.toString())

  io.emit('onlineUser', Array.from(onlineUser))

  socket.on('message-page', async function ({ senderId, receiverId }) {
    // console.log('message-page (sender Id): ',senderId)
    // console.log('senderId: ', senderId, ' receiverId: ', receiverId)
    const user = await userModel.findById(receiverId).select('-password')
    const payload = {
      name: user.name,
      email: user.email,
      _id: user._id,
      online: onlineUser.has(user._id.toString()),
      profilePic: user.profilePic,
    }
    socket.emit('message-user', payload)

    let conversation = await conversationModel.findOne({
      '$or': [
        { sender: senderId, receiver: receiverId },
        { receiver: senderId, sender: receiverId },
      ]
    })

    let messages = []
    if (conversation) {
      conversation = await conversation.populate('messages')
      messages = conversation.messages
      await Promise.all(messages.map(async (message) => {
        if (message.sendBy == receiverId && !message.seen) {
          message.seen = true;
          await message.save();
        }
      }));
    }

    socket.emit('all message', {messages,secondUserId:receiverId})
    await Promise.all(messages.map(async (message,ind) => {
      if (ind == (messages.length-1) && message.sendBy != senderId) {
          message.yhaTak= true
          await message.save()
      }
    }));

    const conversations = await conversationModel.find({
      '$or': [
        { sender: senderId },
        { receiver: senderId },
      ]
    }).populate('sender').populate('receiver').populate('messages')
    const convUsers = conversations.map(function (conv) {
      const unSeenMsgCnt = conv.messages.reduce(function (accumulator, current) {
        return accumulator + (!current.seen && current.sendBy != senderId)
      }, 0)
      if (conv.sender._id == senderId) return {
        user: conv.receiver,
        lastMsg: conv.messages[conv.messages.length - 1],
        unSeenMsgCnt,
      }
      return {
        user: conv.sender,
        lastMsg: conv.messages[conv.messages.length - 1],
        unSeenMsgCnt,
      }
    })
    // console.log('convUsers: ',convUsers)
    socket.emit('convUsers', convUsers)
    
  })
  socket.on('message update',async function({senderId,receiverId}){
    // console.log(senderId,receiverId)
      let conversation= conversationModel.findOne({
        '$or':[
          {sender:new mongoose.Types.ObjectId(senderId),receiver:new mongoose.Types.ObjectId(receiverId)},
          {sender:new mongoose.Types.ObjectId(receiverId),receiver:new mongoose.Types.ObjectId(senderId)},
        ]
      })
      let messages= []
      if(conversation){
        conversation= await conversation.populate('messages')
        messages= conversation.messages
        await Promise.all(messages.map(async (message) => {
          if (message.sendBy == receiverId && !message.seen) {
            message.seen = true;
            await message.save();
          }
        }));

        await Promise.all(messages.map(async (message,ind) => {
          if (ind == (messages.length-1) && message.sendBy != senderId) {
              message.yhaTak= true
              await message.save()
          }
        }));
        socket.emit('all message1', {messages,secondUserId:receiverId})
      }
  })

  socket.on('new message', async function (data) {
    const createdMessage = await messageModel.create({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      sendBy: data.sender,
    })

    let conversation = await conversationModel.findOne({
      '$or': [
        { sender: data.sender, receiver: data.receiver },
        { receiver: data.sender, sender: data.receiver },
      ]
    })

    if (!conversation) {
      conversation = await conversationModel.create({
        sender: data.sender,
        receiver: data.receiver,
        messages: [],
      })
    }


    conversation.messages.push(createdMessage._id)
    await conversation.save()

    const conversations = await conversationModel.find({
      '$or': [
        { sender: user.id },
        { receiver: user.id },
      ]
    }).populate('sender').populate('receiver').populate('messages')
    const convUsers = conversations.map(function (conv) {
      const unSeenMsgCnt = conv.messages.reduce(function (accumulator, current) {
        return accumulator + (!current.seen && current.sendBy != user.id)
      }, 0)
      if (conv.sender._id == user.id) return {
        user: conv.receiver,
        lastMsg: conv.messages.length?conv.messages[conv.messages.length - 1]:{},
        unSeenMsgCnt,
      }
      return {
        user: conv.sender,
        lastMsg: conv.messages[conv.messages.length - 1],
        unSeenMsgCnt,
      }
    })

    socket.emit('convUsers', convUsers)

    // console.log('new message receiver: ', data.receiver)
    socket.to(data.receiver).emit('receiver sideBar', data.sender)

    conversation = await conversation.populate('messages')
    // console.log('conversation: ',conversation)
    const messages = conversation.messages
    // console.log('messages: ',messages)
    socket.emit('all message', {messages,secondUserId:data.receiver})
    // socket.to(data.receiver).emit('all message', {messages,secondUserId:user.id})
    socket.to(data.receiver).emit('all read')
  })

  socket.on('all read',async ({senderId,receiverId})=>{
    console.log('all read')
    let conversation = await conversationModel.findOne({
      '$or': [
        { sender: senderId, receiver: receiverId },
        { receiver: senderId, sender: receiverId },
      ]
    })

    let messages = []
    if (conversation) {
      conversation = await conversation.populate('messages')
      messages = conversation.messages
      await Promise.all(messages.map(async (message) => {
        if (message.sendBy == receiverId && !message.seen) {
          message.seen = true;
          await message.save();
        }
      }));
    }

    await Promise.all(messages.map(async (message,ind) => {
      if (message.sendBy != senderId) {
          message.yhaTak= true
          await message.save()
      }
    }));
    socket.emit('all message',{messages,secondUserId:receiverId})
  })

  socket.on('receiver sideBar', async function (params) {
    // console.log('r')
    // console.log('params: ',params)
    if (params.userId) {
      // console.log('senderId ',user.id,' receiverId ',params.userId)
      // console.log('senderId ',typeof(user.id),' receiverId ',typeof(params.userId))
      let conversation = await conversationModel.findOne({
        '$or': [
          { sender: new mongoose.Types.ObjectId(user.id), receiver: new mongoose.Types.ObjectId(params.userId) },
          { receiver: new mongoose.Types.ObjectId(user.id), sender: new mongoose.Types.ObjectId(params.userId) },
        ]
      });
      
      // console.log('conversation: ',conversation)
      let messages = []
      if (conversation) {
        conversation = await conversation.populate('messages')
        messages = conversation.messages
        await messages.forEach(async function (message) {
          // console.log('message: ',message)
          if (message.sendBy.equals(new mongoose.Types.ObjectId(params.userId))){
            // console.log('..................................')
            message.seen = true;
          }
          await message.save()
        })

        // console.log('messages: ',messages)
        
        // await conversation.save()
      }
    }

    const conversations = await conversationModel.find({
      '$or': [
        { sender: new mongoose.Types.ObjectId(user.id) },
        { receiver: new mongoose.Types.ObjectId(user.id) },
      ]
    }).populate('sender').populate('receiver').populate('messages')
    const convUsers = conversations.map(function (conv) {
      const unSeenMsgCnt = conv.messages.reduce(function (accumulator, current) {
        return accumulator + (!current.seen && current.sendBy != user.id)
      }, 0)
      if (conv.sender._id == user.id) return {
        user: conv.receiver,
        lastMsg: conv.messages[conv.messages.length - 1],
        unSeenMsgCnt,
      }
      return {
        user: conv.sender,
        lastMsg: conv.messages[conv.messages.length - 1],
        unSeenMsgCnt,
      }
    })

    socket.emit('convUsers', convUsers)
  })



  socket.on('disconnect', function () {
    onlineUser.delete(user.id)
    io.emit('onlineUser', Array.from(onlineUser))
    console.log('disconnected frontend: ', socket.id)
  })
})

module.exports = { app, server }

