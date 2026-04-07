import React from 'react'

const Login = () => {


  return (
    
      <div className='flex items-center justify-center h-100'>
        <div className='bg-gray-200 p-10 rounded-lg shadow-lg w-96'>
          <h2 className='text-2xl font-bold mb-6 text-center'>Login</h2>
          <form>
            <input type="text" placeholder='E-mail' className='w-full mb-4 p-2 border border-gray-300 rounded' required/>
            <input type="password" placeholder='Password' className='w-full mb-6 p-2 border border-gray-300 rounded' required/>
            <button type="submit" className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>Login</button>
          </form>
        </div>
      </div>
    
  )
}

export default Login
