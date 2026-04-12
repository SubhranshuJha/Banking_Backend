// src/pages/CreateAc.jsx
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/Navbar';

const CreateAc = () => {
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:8000/api/accounts/create", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Account created successfully!");
      navigate('/dashboard');
    } catch (error) {
      alert("Failed to create account");
    }
  };

  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center h-screen'>
        <div className='bg-gray-200 p-10 rounded-lg shadow-lg text-center'>
          <h1 className='text-2xl font-bold'>Need a Banking Account?</h1>
          <button onClick={handleCreateAccount} className='mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>
            Create New Account
          </button>
        </div>
      </div>
    </div>
  );
};
export default CreateAc;