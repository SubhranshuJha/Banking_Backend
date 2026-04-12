
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                
                const res = await axios.get("http://localhost:8000/api/accounts/get", {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                
                setAccounts(res.data.account || []);
            } catch (err) {
                console.error("Fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

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
                        onClick={() => navigate('/transaction')}>Make a Transaction</button>
                    <button className='ml-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600'
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate('/login');
                        }}>
                        Logout
                    </button>
                </div>
            
            <div className='p-10 bg-gray-100 '>
                {loading ? <p>Loading...</p> : (
                    <div className='mt-6'>
                        {accounts.map(acc => (
                            <div key={acc._id} className='bg-white p-4 mb-4 rounded shadow'>
                                <p><strong>Account ID:</strong> {acc._id}</p>
                                <p><strong>Status:</strong> {acc.status}</p>
                                <p><strong>Currency:</strong> {acc.currency}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
            
            <Footer />
        </div>
    );
};
export default Dashboard;