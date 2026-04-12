import React from 'react'
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = async () => {
        try {
            const res = await axios.post("http://localhost:8000/api/auth/login", {
                email,
                password
            });

           
            localStorage.setItem("token", res.data.token);
            console.log("Login successful, token stored:", res.data.token);
            alert("Login successful");
            
            navigate('/createac');

        } catch (error) {
            console.error("Error logging in:", error);
            alert("Login failed");
        }
    }
    return (

        <div className='flex items-center justify-center h-100'>
            <div className='bg-gray-200 p-10 rounded-lg shadow-lg w-96'>
                <span className='text-blue-500 cursor-pointer'
                    onClick={() => navigate('/')}>Home Page</span>
                <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}>
                    <input type="text" placeholder='E-mail'
                        className='w-full mb-4 p-2 border border-gray-300 rounded' required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input type="password" placeholder='Password'
                        className='w-full mb-6 p-2 border border-gray-300 rounded' required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>Login</button>
                </form>
                <br />
                <h3 className='text-center mt-6'>Don't have an account?
                    <span className='text-blue-500 cursor-pointer'
                        onClick={() => navigate('/register')}> Register here</span></h3>
            </div>
        </div>

    )
}

export default Login