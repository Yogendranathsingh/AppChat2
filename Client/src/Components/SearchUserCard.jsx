import Avatar from './Avatar'
import './searchUserCard.css'
import { Link } from 'react-router-dom';


function SearchUserCard({user,setOpenSearchUser}){

    // console.log('searchUserCard se User: ',user)

    return (
        <Link to={`/${user._id}`} onClick={()=>setOpenSearchUser(false)} className='searchUserCard' style={{display:'flex',alignItems:'center',background:"rgb(255,204,204)",paddingInline:'10px',paddingBlock:'5px',gap:'10px',cursor:'pointer',textDecoration:"none",borderRadius:'4px',color:"#476dd1"}}>
            <Avatar height='35px' src={user.profilePic} _id={user._id}/>
            <div style={{}}>
                <div style={{fontSize:'20px'}}>{user.name}</div>
                <div style={{fontSize:'14px'}}>{user.email}</div>
            </div>
        </Link>
    )
}

export default SearchUserCard