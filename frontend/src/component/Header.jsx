import { Link } from 'react-router-dom'
import img from '../assests/logo.png'
import { useNavigate } from 'react-router-dom'

const Header = () => {
    const navigate = useNavigate();
    return (
        
        <div className='flex items-center justify-between bg-blue-300 px-10 py-2 text-center text-3xl font-bold text-black '>
            <img 
                src={img} 
                alt="example"
                className='w-30 h-18 mr-3 cusor-pointer'
                onClick={() => navigate('/')}
            />
            <h1 className='text-xl font-bold text-black'>Banking App</h1>
            <div className="flex gap-10 text-lg ">
                <Link to='/' className='hover:text-blue-500'>Home</Link>
                <Link to='/register' className='hover:text-blue-500'>Register</Link>
                <Link to='/login' className='hover:text-blue-500'>Login</Link> 
            </div>
        </div>
    )

}

export default Header
