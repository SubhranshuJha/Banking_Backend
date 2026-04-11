import React, { useState } from "react";
import axios from "axios";

const TransactionPage = () => {

    const [formData, setFormData] = useState({
        fromAccount: "",
        toAccount: "",
        amount: "",
        idempotencyKey: ""
    });

    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    
    

    return (
        <div className="flex items-center justify-center h-100 p-20">
            <div className="bg-gray-200 p-20 gap-10 rounded-lg shadow-lg w-100% h-100% text-center">
                <span className='text-blue-500 cursor-pointer'
                    onClick={() => navigate('/dashboard')}>Dashboard</span>
                    <br/>
                <h2 className='text-2xl font-bold mb-6 text-center'>Make Transaction</h2>
            <form>
                <input type="text" name="fromAccount" 
                placeholder="From Account" value={formData.fromAccount} onChange={handleChange} 
                className="rounded mb-4 border"/>
                <br />
                <input type="text" name="toAccount" 
                placeholder="To Account" value={formData.toAccount} onChange={handleChange} 
                className="rounded mb-4 border"/>
                <br />
                <input type="number" name="amount" 
                placeholder="Amount" value={formData.amount} onChange={handleChange} 
                className="rounded mb-4 border"/>
                <br />

                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Make Payment</button>
            </form>
            </div>
        </div>
    );
};

export default TransactionPage;
