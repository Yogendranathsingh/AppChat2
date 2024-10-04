import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Loading from './Loading'
import SearchUserCard from "./SearchUserCard";
import axios from "axios";
import { IoClose } from "react-icons/io5";

function SearchUser({ user, setOpenSearchUser }) {
    // console.log('searchUser coming: ',user)
    const [searchInput, setSearchInput] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)

    // console.log('input: ',searchInput)

    useEffect(function () {
        const fetchUsers = async () => {
            setLoading(true);  // Start loading state

            try {
                const url = `${import.meta.env.VITE_BACKEND_URL}/api/searchUser`;
                const response = await axios.post(url, { searchInput }, { withCredentials: true });
                //   console.log('searchBar response',response.data.data)
                setUsers(response.data.data)
            } catch (error) {
                console.log('error: ', error);
                setUsers([]);  // Clear users on error
            } finally {
                setLoading(false);  // Stop loading state
            }
        };

        fetchUsers();

    }, [searchInput])

    function handleOnChange(e) {
        setSearchInput(e.target.value)
    }

    return (
        <div style={{ position: 'fixed', background: 'rgb(254, 220, 220,0.9)', height: '100vh', width: '100%'}}>
            <div style={{fontSize:'30px',position:'fixed',right:'10px',top:'10px'}}><IoClose cursor='pointer' onClick={()=>setOpenSearchUser(false)} /></div>

            <div style={{width:'400px',marginInline:'auto',padding:'5px',marginTop:'50px'}}>

                <div style={{ display: 'flex', alignItems: 'center', background: 'white', fontSize: '20px', paddingInline: '5px',border:'1px solid grey',borderRadius:"5px"}}>
                    <input style={{ paddingBlock: '10px', border: 'none', fontSize: '16px' }} type="text" placeholder="search by name or email..." value={searchInput} onChange={handleOnChange} />
                    <CiSearch />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', fontSize: "18px", padding: '20px' }}>

                    {users.length == 0 && !loading && (<div>users not found</div>)}

                    {loading && (
                        <Loading />
                    )}

                    <div style={{ width: '100%',height:'calc(100vh - 142px)', display: 'flex', flexDirection: 'column', gap: '5px',overflow:'auto'}}>
                        {
                            users.map(function (user, ind) {
                                return <SearchUserCard key={ind} user={user} setOpenSearchUser={setOpenSearchUser} />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchUser