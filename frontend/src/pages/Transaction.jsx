// src/pages/Transaction.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Transaction = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fromAccount: "",
        toAccount: "",
        amount: "",
        idempotencyKey: `txn-${Date.now()}` // Generate unique key
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post("http://localhost:8000/api/transactions/create", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(res.data.message || "Transfer Successful");
            navigate('/dashboard');
        } catch (error) {
            alert(error.response?.data?.message || "Transaction failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-20">
            <div className="bg-gray-200 p-10 rounded-lg shadow-lg w-full max-w-md">
                <span className='text-blue-500 cursor-pointer' onClick={() => navigate('/dashboard')}>Back to Dashboard</span>
                <h2 className='text-2xl font-bold my-6 text-center'>Make Transaction</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input type="text" name="fromAccount" placeholder="Your Account ID" onChange={handleChange} className="p-2 rounded border" required />
                    <input type="text" name="toAccount" placeholder="Recipient Account ID" onChange={handleChange} className="p-2 rounded border" required />
                    <input type="number" name="amount" placeholder="Amount" onChange={handleChange} className="p-2 rounded border" required />
                    <button type="submit" className="bg-green-500 text-white py-2 rounded hover:bg-green-600">Send Money</button>
                </form>
            </div>
        </div>
    );
};
export default Transaction;