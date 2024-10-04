import React, { useEffect } from 'react';
import { useState } from 'react';
import './RegisterPage.css'
import uploadFile from '../../Helpers/UploadFile';
import { Link } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {

    const token= localStorage.getItem('token')

    useEffect(() => {
        if (token) {
            window.location.reload();
        }
    },);
    
    const [data,setData]= useState({
        name:'',
        email:'',
        password:'',
        profilePic:''
    })

    const [isUploading,setIsUploading]=useState(false)

    const navigate= useNavigate()


    

    function handleOnChange(e){
        e.preventDefault()
        const {name,value}= e.target
        setData(function(prev){
            return {
                ...prev,
                [name]:value
            }
        })
        
    }

    async function handleSubmit(e){
        e.preventDefault()
        console.log('data is: ',data)
        const url= `${import.meta.env.VITE_BACKEND_URL}/api/register`
        try {
            const response= await axios.post(url,data,{withCredentials:true})
            toast.success(response.data.message)
            if(response.data.success){
                setData({
                    name:'',
                    email:'',
                    password:'',
                    profilePic:''
                })
                navigate('/email')
            }
        } catch (error) {
            // toast.error(error)
            toast.error(error?.response?.data?.message)
            console.log('error: ',error)
        }
    }

    async function handleUploadPhoto(e){
        const file= e.target.files[0]
        setIsUploading(true)
        const uploadPhoto= await uploadFile(file)
        setData(function(prev){
            return {
                ...prev,
                profilePic:uploadPhoto?.url,
            }
        })
        setIsUploading(false)
    }

    return (
        <div className='regiBox'>
            <div style={{ marginBottom: '10px' }}>Welocome to Chat App</div>
            <form action="" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input value={data.name} onChange={handleOnChange} type="text" name="name" id="name" placeholder="name" />
                </div>

                <div>
                    <label htmlFor="email">Email:</label>
                    <input value={data.email} onChange={handleOnChange} type="email" name="email" id="email" placeholder="email" />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input value={data.password} onChange={handleOnChange} type="password" name="password" id="password" placeholder="password" />
                </div>

                <div>
                    <label htmlFor="profilePic">Profile Picture:</label>
                    <input onChange={handleUploadPhoto} type="file" name="profilePic" id="profilePic" />
                </div>

                <div>
                    <input type="submit" value='Register User' disabled={isUploading}/>
                </div>
            </form>

            <div style={{marginTop:'30px'}}>
                Already have an account? <Link to='/email'><b>Login</b></Link>
            </div>

        </div>
    );
}

export default RegisterPage;
