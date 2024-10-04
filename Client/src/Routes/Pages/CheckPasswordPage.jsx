import React, { useEffect } from 'react';
import { useState } from 'react';
import './RegisterPage.css'
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../Components/Avatar';
import { setToken } from '../../Redux/UserSlice';
import { useDispatch } from 'react-redux';

const CheckPasswordPage = () => {
    const [data, setData] = useState({
        password: '',
    })
    
    const dispatch=useDispatch()

    const location= useLocation()
    // console.log(location)

    const navigate = useNavigate()


    useEffect(function () {
        // console.log('data: ',data)
    }, [data])

    function handleOnChange(e) {
        e.preventDefault()
        const { name, value } = e.target
        setData(function (prev) {
            return {
                ...prev,
                [name]: value
            }
        })

    }

    async function handleSubmit(e) {
        e.preventDefault()
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/password`
        try {
            const response = await axios.post(url, {
                password: data.password,
                userId: location.state._id
            }, {
                withCredentials: true // To include credentials in the request
            });
            toast.success(response.data.message)
            if (response.data.success) {
                setData({
                    password: '',
                })
                localStorage.setItem('token',response.data.token)
                sessionStorage.setItem('token',response.data.token)
                dispatch(setToken(response.data.token))
                // window.location.reload()
                navigate('/')
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
            console.log('error: ', error)
        }
    }

    return (
        <div className='regiBox'>
            <div style={{ marginBottom: '10px' }}>Welocome to Chat App</div>
            <Avatar height='50px' src={location.state?.profilePic}/>
            <form action="" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Password:</label>
                    <input value={data.password} onChange={handleOnChange} type="password" name="password" id="password" placeholder="password" />
                </div>

                <div>
                    <input type="submit" value="Verify Password" />
                </div>
            </form>

            <div style={{ marginTop: '30px' }}>
                <Link to='/resetPssword'><b>Forgot Password?</b></Link>
            </div>

        </div>
    );
}

export default CheckPasswordPage;
