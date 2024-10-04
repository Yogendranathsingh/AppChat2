import React, { useEffect } from 'react';
import { useState } from 'react';
import './RegisterPage.css'
import { Link } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Avatar from '../../Components/Avatar.jsx';

const CheckEmailPage = () => {
    const [data, setData] = useState({
        email: '',
    })

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
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/email`
        try {
            const response = await axios.post(url, data)
            toast.success(response.data.message)
            if (response.data.success) {
                setData({
                    email: '',
                })
                navigate('/password',{
                    state:response?.data?.data
                })
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
            console.log('error: ', error)
        }
    }

    return (
        <div className='regiBox'>
            <div style={{ marginBottom: '10px' }}>Welocome to Chat App</div>
            <Avatar height='50px'/>
            <form action="" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input value={data.email} onChange={handleOnChange} type="email" name="email" id="email" placeholder="email" />
                </div>

                <div>
                    <input type="submit" value="Let's Go" />
                </div>
            </form>

            <div style={{ marginTop: '30px' }}>
                Not have an account? <Link to='/register'><b>Register</b></Link>
            </div>

        </div>
    );
}

export default CheckEmailPage