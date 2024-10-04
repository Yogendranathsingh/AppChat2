import { createSlice } from '@reduxjs/toolkit';

const userSlice= createSlice({
    name:'user',
    initialState:{
        name:'',
        email:'',
        profilePic:'',
        token:'',
        _id:'',
        onlineUser:[],
        socketConnection:null,
    },
    reducers:{
        setUser: function(state,action){
            state.name= action.payload.name
            state.email= action.payload.email
            state.profilePic= action.payload.profilePic
            state._id= action.payload._id
        },
        setToken: function(state,action){
            state.token= action.payload
        },
        logout: function(state,action){
            state.name= ''
            state.email= ""
            state.profilePic= ''
            state.token= ''
            state.socketConnection=''
        },
        setOnlineUser: function(state,action){
            state.onlineUser= action.payload
        },
        setSocketConnection: function(state,action){
            state.socketConnection= action.payload
        }
    }
})

export const {setUser,setToken,logout,setOnlineUser,setSocketConnection}= userSlice.actions
export default userSlice.reducer
