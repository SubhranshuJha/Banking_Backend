import { Link } from 'react-router-dom'

const Header = () => {
    
    return (

        <div className='flex items-center justify-between bg-blue-200 px-10 py-7 text-center text-3xl font-bold text-black '>
            <h2 className="text-xl">Header </h2>
            <div className="flex gap-10 text-lg ">
                <Link to='/' className='hover:text-blue-500'>Home</Link>
                <Link to='/register' className='hover:text-blue-500'>Register</Link>
                <Link to='/login' className='hover:text-blue-500'>Login</Link> 
            </div>
        </div>
    )

}

export default Header
