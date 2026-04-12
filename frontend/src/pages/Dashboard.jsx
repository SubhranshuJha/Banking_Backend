// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = localStorage.getItem("token");
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
            <div className='p-10 bg-gray-100 min-h-screen'>
                <h1 className='text-2xl font-bold'>Your Dashboard</h1>
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
            <Footer />
        </div>
    );
};
export default Dashboard;