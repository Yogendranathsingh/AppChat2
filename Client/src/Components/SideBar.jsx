import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoMdPersonAdd } from "react-icons/io";
import { BiLogOut } from "react-icons/bi";
import './SideBar.css'
import './SearchUserCard.css'
import { Link, NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";
import { useSelector } from "react-redux";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";

// function SideBar({ user }) {
//     const [convUsers, setConvUsers] = useState([])
//     const [openSearchUser, setOpenSearchUser] = useState(false)
//     const socketConnection = useSelector(state => state.user.socketConnection)
//     const params= useParams()

//     useEffect(() => {
//         console.log('convUsers: ', convUsers)
//         if (socketConnection) {
//             socketConnection.on('convUsers', (data) => {
//                 setConvUsers(data)
//             })

//             socketConnection.on('receiver sideBar', function(data){
                
//                 console.log('params: ',params.userId)
//                 socketConnection.emit('receiver sideBar',params)
//             })

//         }
    // }, [socketConnection, params.userId])

// import Avatar from "./Avatar";
// import { useEffect, useState, useRef } from "react";
// import { GoArrowUpLeft } from "react-icons/go";
// import SearchUser from "./SearchUser";
// import { useSelector } from "react-redux";
// import { FaImage, FaVideo } from "react-icons/fa6";
// import { useParams } from "react-router-dom";

function SideBar({ user }) {
    const [convUsers, setConvUsers] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const socketConnection = useSelector(state => state.user.socketConnection);
    const params = useParams();
    const socketListenersRef = useRef(false); // To avoid multiple event listeners.

    useEffect(() => {
        if (socketConnection && !socketListenersRef.current) {
            // Attach socket listeners only once.
            socketConnection.on('convUsers', (data) => {
                setConvUsers(data);
            });

            socketConnection.on('receiver sideBar', function (data) {
                console.log('params.userId: ', params.userId); // Tracking the userId
                socketConnection.emit('receiver sideBar', { userId: params.userId });
            });

            // Mark that listeners are attached
            socketListenersRef.current = true;

            // Clean up listeners on component unmount
            return () => {
                socketConnection.off('convUsers');
                socketConnection.off('receiver sideBar');
                socketListenersRef.current = false;
            };
        }
    }, [socketConnection, params.userId]);

    async function handleLogout(){
        localStorage.setItem('token','');
        sessionStorage.setItem('token','');
        window.location.reload();
        const url= `${import.meta.env.VITE_BACKEND_URL}/api/logout`
        const response= await axios.get(url,{ withCredentials: true })
        // if(response.data.success){
            
        // }
        window.location.reload()
        // console.log('response: ',response);
    }

    return (
        <div style={{ width: '100%', display: 'flex', border: '1px solid yellow' }}>
            <div style={{ width: '20%', paddingTop: '20px', position: 'relative', border: '1px solid red' }}>
                <NavLink to='/' className="icons" style={({ isActive }) => ({
                    fontSize: '35px', display: 'flex', justifyContent: 'center', cursor: 'pointer',
                    paddingBlock: '15px', background: isActive ? '#F2F1F1' : 'white'
                })} title="Chat">
                    < IoChatbubbleEllipsesSharp />
                </NavLink>

                <NavLink onClick={() => setOpenSearchUser(!openSearchUser)} title="Add Friend" className="icons" style={{
                    fontSize: '35px', display: 'flex', justifyContent: 'center', cursor: 'pointer',
                    paddingBlock: '15px'
                }}>
                    <IoMdPersonAdd />
                </NavLink>

                <NavLink onClick={handleLogout} title="Logout" className="icons" style={{
                    fontSize: '35px', width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer',
                    paddingBlock: '15px', position: 'absolute', bottom: '10px'
                }}>
                    <BiLogOut />
                </NavLink>

                <NavLink title={user.name} className="icons" style={{
                    fontSize: '35px', width: '100%', display: 'flex', justifyContent: 'center', cursor: 'pointer',
                    paddingBlock: '15px', position: 'absolute', bottom: '75px'
                }}>
                    <Avatar height='35px' src={user.profilePic} _id={user._id} />
                </NavLink>
            </div>

            <div style={{ width: '80%', paddingTop: '21px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ paddingBlock: '15.3px', fontSize: '30px', background: '#a7a7a7', paddingLeft: '10px' }}>Message</div>
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '0px' }}>
                    {

                        convUsers.length == 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '20px', marginTop: '30px', color: '#b6b6b6' }}>
                                <GoArrowUpLeft fontSize="35px" />
                                <div style={{ textAlign: 'center' }}>Explore users to start a conversation with</div>
                            </div>
                        )

                    }

                    {
                        convUsers.map((conv, ind) => {
                            return <Link to={`/${conv.user._id}`} id={ind} className='searchUserCard' style={{ display: 'flex', alignItems: 'center', background: "rgb(255,204,204)", paddingBlock: '5px', gap: '10px', cursor: 'pointer', textDecoration: "none", paddingLeft: '10px', margin: '4px', borderRadius: '4px' }}>
                                <Avatar height='35px' src={conv.user.profilePic} _id={conv._id} />
                                <div style={{ width: 'calc(100% - 80px)' }}>
                                    <div style={{ fontSize: '20px' }}>{conv.user.name}</div>

                                    {conv.lastMsg?.imageUrl && (
                                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            <FaImage size='12px' />
                                            <span style={{ whiteSpace: "nowrap", overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>{conv.lastMsg.text ? conv.lastMsg.text : 'Image'}</span>
                                        </div>
                                    )}
                                    {conv.lastMsg?.videoUrl && (
                                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                            <FaVideo size='12px' />
                                            <span style={{ whiteSpace: "nowrap", overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>{conv.lastMsg.text ? conv.lastMsg.text : 'Video'}</span>
                                        </div>
                                    )}
                                    {!conv.lastMsg?.imageUrl && !conv.lastMsg?.videoUrl && conv.lastMsg?.text && (
                                        <div style={{ whiteSpace: "nowrap", overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px' }}>
                                            {conv.lastMsg.text}
                                        </div>
                                    )}


                                </div>
                                {conv.unSeenMsgCnt != 0 && <div style={{ background: '#06c033', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', height: '18px', width: '18px', color: 'white', marginTop: "15px" }}>
                                    <div>{conv.unSeenMsgCnt}</div>
                                </div>}
                            </Link>
                        })
                    }
                </div>
            </div>

            {/* search user component */}

            {openSearchUser && (
                <SearchUser user={user} setOpenSearchUser={setOpenSearchUser} />
            )}

        </div>
    )
}

export default SideBar

