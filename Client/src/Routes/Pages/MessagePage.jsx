import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { parsePath, useParams } from 'react-router-dom';
import Avatar from '../../Components/Avatar'
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import './MessagePage.css'
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import uploadFile from '../../Helpers/UploadFile'
import { IoClose } from "react-icons/io5";
import { IoSendSharp } from "react-icons/io5";
import Loading from '../../Components/Loading';
import { useRef } from 'react';
import moment from 'moment'

const MessagePage = () => {
    const sender = useSelector(state => state.user)
    const [openImageVideoUpload, setOPenImageVideoUpload] = useState(false)
    const [openImageVideoUploadPreview, setOpenImageVideoUploadPreview] = useState(false)
    const [message, setMessage] = useState({
        text: '',
        imageUrl: '',
        videoUrl: '',
    })
    const [allMessage, setAllMessage] = useState([])
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(false)
    const params = useParams()
    const socketConnection = useSelector(state => state.user.socketConnection)
    const socketListenerRef = useRef(false)
    const endOfMessagesRef = useRef(null);
    // console.log('endOfMessagesRef: ',endOfMessagesRef)
    let prevHour = 25


    async function handleImageOnChange(e) {
        setLoading(true)
        setOPenImageVideoUpload(false)
        const response = await uploadFile(e.target.files[0])
        setLoading(false)
        setMessage(prev => ({ ...prev, imageUrl: response.url }))
        setOpenImageVideoUploadPreview(true)

    }

    async function handleVideoOnChange(e) {
        setLoading(true)
        setOPenImageVideoUpload(false)
        const response = await uploadFile(e.target.files[0])
        setLoading(false)
        setMessage(prev => ({ ...prev, videoUrl: response.url }))
        setOpenImageVideoUploadPreview(true)

    }

    async function handleInputOnChange(e) {
        setMessage(prev => ({ ...prev, text: e.target.value }))
    }

    async function handleCloseImageVideoUploadPreview() {
        setMessage({
            imageUrl: '',
            videoUrl: '',
        })
        setOpenImageVideoUploadPreview(false)
    }

    function handleOnSend() {
        if (socketConnection && (message.text || message.imageUrl || message.videoUrl)) {
            socketConnection.emit('new message', {
                sender: sender._id,
                receiver: user._id,
                text: message.text,
                imageUrl: message.imageUrl,
                videoUrl: message.videoUrl,
            })
        }

        setMessage({
            text: '',
            imageUrl: '',
            videoUrl: '',
        })
        setOpenImageVideoUploadPreview(false)
    }

    useEffect(() => {
        if (socketConnection && sender._id && params.userId && !socketListenerRef.current) {
            // console.log('si: ',sender._id, ' ri: ',params.userId)
            socketConnection.emit('message-page', { senderId: sender._id, receiverId: params.userId });

            socketConnection.on('message-user', function (user) {
                setUser(user);
            });

            socketConnection.on('all message', function (data) {
                // console.log('all message: ', data.messages)
                // console.log('all message fronted')
                // if (data.secondUserId == params.userId.toString()) socketConnection.emit('message update', { senderId: sender._id, receiverId: params.userId })
                // console.log('uper')
                if (data.secondUserId == params.userId.toString()) {
                    console.log("hii")
                    setAllMessage(data.messages);
                }
            });

            socketConnection.on('all read', function () {
                socketConnection.emit('all read', { senderId: sender._id, receiverId: params.userId })
            })

            socketConnection.on('all message1', (data) => {
                if (data.secondUserId == params.userId.toString()) setAllMessage(data.messages);
            })

            socketListenerRef.current = true

            return function () {
                socketConnection.off('message-user')
                socketConnection.off('all message')
                socketConnection.off('all message1')
                socketConnection.off('message update')
                socketConnection.off('all read')
                socketListenerRef.current = false;
            }

        }

    }, [socketConnection, sender, params.userId]);

    useEffect(() => {
        if (allMessage.length > 0 && endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView();
        }
    }, [allMessage]);

    return (
        <div>
            <header style={{ background: 'rgb(229, 225, 225)', height: '80px', paddingInline: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '10px', height: '100%', alignItems: 'center' }}>
                    <div>
                        <Avatar height='35px' src={user.profilePic} _id={user._id} />
                    </div>
                    <div>
                        <div style={{ fontSize: '20px' }}>{user.name}</div>
                        <p>{user.online ? 'online' : 'offline'}</p>
                    </div>
                </div>

                <div>
                    <BsThreeDotsVertical />
                </div>
            </header>
            <div style={{ height: "calc(100vh - 160px)", overflowY: 'scroll', background: 'rgb(249, 246, 185)', padding: '30px' }}>
                {allMessage.map(function (message, ind) {
                    const currentHour = parseInt(moment(message.createdAt).format('HH'));
                    return <div key={ind}>
                        {prevHour > currentHour && <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div style={{ background: 'white', padding: '4px', marginBlock: '5px', borderRadius: '4px' }}>{moment(message.createdAt).format('D MMMM YYYY')}</div>
                        </div>}
                        <div ref={(message.yhaTak || message.sendBy == sender._id) ? endOfMessagesRef : null} key={ind} style={{ borderRadius: '5px', paddingInline: '5px', display: 'flex', flexDirection: 'column', minWidth: '80px', marginBlock: '10px', width: 'max-content', maxWidth: '60%', background: message.sendBy != sender._id ? 'white' : '#c0f3cf', marginLeft: message.sendBy == sender._id ? 'auto' : '0px' }} >
                            {message.imageUrl && (
                                <div style={{ height: '300px', width: '300px', padding: '5px' }}>
                                    <img style={{ height: '100%', width: '100%', objectFit: 'contain' }} src={message.imageUrl} alt="Message Attachment" />
                                </div>
                            )}
                            {(message.videoUrl !== '') && (
                                <div style={{ height: '300px', width: '300px', padding: '5px' }}>
                                    <video controls style={{ height: '100%', width: '100%', objectFit: 'contain' }} src={message.videoUrl} alt="Message Attachment" />
                                </div>
                            )}
                            {message.text && <div style={{ paddingInline: '5px', paddingTop: '3px', fontSize: '18px', borderRadius: '5px' }}>{message.text}</div>}
                            <div style={{ fontSize: '11.5px', marginLeft: 'auto', color: 'grey',paddingBottom:'1px'}}>
                                {moment(message.createdAt).format('hh:mm A').replace('AM', 'am').replace('PM', 'pm')}
                            </div>
                            {(prevHour = currentHour) && <div></div>}
                        </div>
                    </div>

                })}
                {/* <div ref={endOfMessagesRef}></div> */}
            </div>

            {/* loading*/}

            {loading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1', position: 'fixed', top: '80px', height: "calc(100vh - 160px)", width: '75%', border: '1px solid red', background: 'rgb(236, 236, 235,0.8)' }}>
                    <Loading />
                </div>
            )}

            {/* prview of image/video upload */}
            {openImageVideoUploadPreview && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: '1', position: 'fixed', top: '80px', height: "calc(100vh - 160px)", width: '75%', border: '1px solid red', background: 'rgb(236, 236, 235,0.8)' }}>
                    <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                        <IoClose onClick={handleCloseImageVideoUploadPreview} size='30px' cursor='pointer' />
                    </div>
                    <div style={{ height: '200px', width: '300px', background: 'white' }}>
                        {message.imageUrl && (
                            <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={message.imageUrl} ></img>
                        )}
                        {message.videoUrl && !message.imageUrl && (
                            <video controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={message.videoUrl} ></video>
                        )}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px', background: '', paddingInline: '20px' }}>
                <div style={{ position: 'relative', display: 'flex', gap: '10px', width: 'calc(100% - 35px)' }}>
                    {openImageVideoUpload && (
                        <div style={{ background: 'grey', position: 'absolute', bottom: '100px', fontSize: '18px', padding: '5px' }}>
                            <label htmlFor="image">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px', cursor: 'pointer' }}>
                                    <FaImage />
                                    Image
                                </div>
                            </label>
                            <label htmlFor="video">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px', cursor: 'pointer' }}>
                                    <FaVideo />
                                    Video
                                </div>
                            </label>
                            <input onChange={handleImageOnChange} style={{ display: 'none' }} type="file" name="image" id="image" />
                            <input onChange={handleVideoOnChange} style={{ display: 'none' }} type="file" name="video" id="video" />
                        </div>
                    )}
                    <div onClick={() => setOPenImageVideoUpload(prev => !prev)} className='plus' style={{ height: '40px', borderRadius: '5px', width: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', visibility: (loading || openImageVideoUploadPreview) ? 'hidden' : 'visible' }}>
                        <FaPlus />
                    </div>

                    <input value={message.text} onChange={handleInputOnChange} style={{ paddingInline: '15px', height: '40px', fontSize: '16px', width: 'calc(100%)', outline: 'none', border: '1px solid #e1e1e1', borderRadius: '20px' }} type="text" />
                </div>
                <div>
                    <IoSendSharp size='25px' cursor='pointer' onClick={handleOnSend} />
                </div>
            </div>
        </div>
    );
}

export default MessagePage;
