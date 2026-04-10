import React from 'react'
import Footer from '../component/Footer';
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>

      <div className='flex items-center justify-between bg-blue-300 px-10 py-2 text-center text-3xl font-bold text-black '>
        
        <h1 className='text-xl font-bold text-black'>Dashboard</h1>
        <div className="flex gap-10 text-lg ">
          <Link to='/' className='hover:text-blue-500'>Home</Link>
          <Link to='/transaction' className='hover:text-blue-500'>Transaction</Link>
          <button  >logout</button>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Dashboard
