import React from 'react';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, setToken, logout, setOnlineUser, setSocketConnection } from '../../Redux/UserSlice';
import axios from 'axios';
import SideBar from '../../Components/SideBar';
import { io } from 'socket.io-client'


const Home = ({children}) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    useEffect(() => {

        const token = sessionStorage.getItem('token');
        if (token == '' || token == undefined) {
            console.error('Token not found');
            return;
        }
        dispatch(setToken(sessionStorage.getItem('token')))
        const socketConnection = io(`${import.meta.env.VITE_BACKEND_URL}`, {
            auth: {
                token,
            },
            transports: ['websocket']
        })
        dispatch(setSocketConnection(socketConnection))

        // Fetch user details on component mount
        async function fetchUserDetails() {
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/api/userDetails`;
                const response = await axios.post(url, { token }, { withCredentials: true });
                dispatch(setUser(response.data));
            } catch (error) {
                console.log('error: ', error);
            }
        }

        fetchUserDetails();

        // Set up socket connection on component mount
        socketConnection.on('onlineUser', function (data) {
            dispatch(setOnlineUser(data));
        });

        // Cleanup function to disconnect socket when component unmounts
        return () => {
            socketConnection.disconnect();
        };
    }, []); // Make sure to only include necessary dependencies

    return (
        <div style={{ display: 'flex', height: '100vh' }}>

            <section style={{ width: '25%',display: 'flex' }}>
                <SideBar width='100%' user={user}></SideBar>
            </section>

            <section style={{ width: '75%' }}>
                {children}
            </section>

        </div>
    );
}

export default Home;
