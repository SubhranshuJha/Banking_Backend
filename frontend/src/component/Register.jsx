import React from 'react'

const Register = () => {
  return (
    <div>
      <form className='border-1 m-10 gap-7 p-10 flex-col items-center justify-center bg-gray-100  rounded-md'>
        <label className='text-xl font-bold mb-4'>Username: </label>
        <input type="text" placeholder='Name' className='border-2 border-gray-300 rounded-md px-4 py-2 mb-4 w-100' required />
        <br />
        <label className='text-xl font-bold mb-4'>Email: </label>
        <input type="email" placeholder='Email' className='border-2 border-gray-300 rounded-md px-4 py-2 mb-4 w-100' required />
        <br/>
        <label className='text-xl font-bold mb-4'>Password: </label>
        <input type="password" placeholder='Password' className='border-2 border-gray-300 rounded-md px-4 py-2 mb-4 w-100' required />
        <br />
        <button type="submit" className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>Register</button>
      </form>
    </div>
  )
}

export default Register
