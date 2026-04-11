import React from 'react'
import Navbar from '../component/Navbar'

const CreateAc = () => {
  return (
    <div>
      <Navbar />
      <div className='flex items-center justify-center h-100 '>
        <div className='bg-gray-200 p-10 rounded-lg shadow-lg w-100% h-100% text-center'>
        <h1 className='text-2xl font-bold'> Haven't created an account yet?</h1>
        <br/>
        <button className='ml-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600'>Create Account</button>
        <br/> <br/>
        <button className='ml-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600'>Go to Account</button>        
        </div> 
      </div>  
    </div>
  )
}

export default CreateAc
