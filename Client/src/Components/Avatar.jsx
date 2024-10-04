import React from 'react';
import { CgProfile } from "react-icons/cg";
import { useSelector } from 'react-redux';

const Avatar = (data) => {
    const onlineUser= useSelector(state=>state.user.onlineUser)
    const isOnline= onlineUser.includes(data._id)
    // console.log('isOnline: ',isOnline)
    return (
        <div style={{ display: 'flex', 'justifyContent': 'center',position:'relative'}}>
            {!data.src ? <CgProfile style={{ fontSize: data.height }} /> :
                <img src={data.src} style={{ height: data.height,width:data.height,borderRadius:'100%',overflow:'hidden',objectFit:"cover",boxShadow:'0px 0px 4px 2px grey'}} alt="" />
            }

            {isOnline && (
                <div style={{height:'5px',width:'5px',background:'green',borderRadius:'50%',position:'absolute',right:'1px',bottom:'1px'}}></div>
            )}

        </div>
    );
}

export default Avatar;

// import React from 'react';
// import { CgProfile } from "react-icons/cg";

// const Avatar = () => {
//     return (
//         <div style={{ height: '60px', backgroundColor: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <CgProfile style={{ height: '100%', width: 'auto', fontSize: '60px' }} />
//         </div>
//     );
// }

// export default Avatar;

