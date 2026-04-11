import React from 'react'
import Footer from '../component/Footer';
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../component/Navbar';

const Dashboard = () => {

    const navigate = useNavigate();
    return (
        <div>

            <Navbar />

            <div className='flex items-left  justify h-100 '>
                <div className=' p-10 rounded-lg bg-gray-100 w-100% h-100% text-left'>
                    <h1 className='text-2xl font-bold'> Welcome to your Dashboard</h1>
                    <br />
                    <button className='ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>View Account</button>
                    <br /> <br />
                    <button className='ml-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'
                    onClick= {() => navigate('/transaction')}>Make a Transaction</button>
                </div>
                <div>

                </div>
            </div>


            <Footer />
        </div>
    )
}

export default Dashboard