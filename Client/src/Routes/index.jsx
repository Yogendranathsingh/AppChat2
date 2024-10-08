import { createBrowserRouter } from "react-router-dom";
import App from '../App'
import RegisterPage from "./Pages/RegisterPage";
import Home from "./Pages/Home";
import MessagePage from "./Pages/MessagePage";
import CheckEmailPage from "./Pages/CheckEmailPage";
import CheckPasswordPage from "./Pages/CheckPasswordPage";
import AuthLayout from "../Layouts";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
    console.log('token: ',localStorage.getItem('token'))
    return localStorage.getItem('token') != ''
}

const router= createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        children:[
            // {
            //     index:true,
            //     element: <Navigate to='/register'></Navigate>
            // },
            // {
            //     path:':userId',
            //     element: <Home><MessagePage></MessagePage></Home>
            // },
            {
                path:'',
                element:isAuthenticated() ? <Home/> : <AuthLayout><RegisterPage/></AuthLayout>,
                
            },
            {
                path:':userId',
                element:isAuthenticated() ? <Home><MessagePage></MessagePage></Home> : <Navigate to='/register' />,
                
            },
            {
                path:'register',
                element:isAuthenticated() ? <Navigate to='/'/>:<AuthLayout><RegisterPage/></AuthLayout>
            },
            {
                path:'email',
                element:<AuthLayout><CheckEmailPage/></AuthLayout>
            },
            {
                path:'password',
                element:<AuthLayout><CheckPasswordPage/></AuthLayout>
            }
        ]
    }
])

export default router
