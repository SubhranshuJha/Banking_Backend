import React from 'react'
import { Link } from 'react-router-dom'
import img from '../assests/logo.png'


const Navbar = () => {
   
  return (
    <div>
          <div className='flex items-center justify-between bg-blue-300 px-10 py-2 text-center text-3xl font-bold text-black '>
                <img 
                    src={img} 
                    alt="example"
                    className='w-30 h-18 mr-3 cusor-pointer'
                    onClick={() => navigate('/')}
                />
              

              <div className="flex gap-10 text-lg ">
                  <Link to='/about' className='hover:text-blue-500'>About</Link>
                  <Link to='/contact' className='hover:text-blue-500'>Contact</Link>
                  <Link to='/services' className='hover:text-blue-500'>Services</Link>
                  <Link to='/profile' className='hover:text-blue-500'>Profile</Link>
              </div>

          </div>
          
    </div>
  )
}

export default Navbar
