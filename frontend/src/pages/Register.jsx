import { useState } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";

const Register = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const sendData = async () =>{
      try {
        const res = await axios.post("http://localhost:8000/api/auth/register", {
          name,
          email,
          password
        });
        
        localStorage.setItem("token", res.data.token);
        console.log(res.data);
        alert("Registration successful");
        navigate('/'); 
      } catch (error) {
        console.error("Error registering user:", error);
        alert("Registration failed");
      }
  }

  return (
    <div className='flex items-center justify-center h-100'>
      <div className='bg-gray-100 p-10 rounded-lg shadow-lg w-100%'>

        <h2 className='text-2xl font-bold mb-6 text-center'>Register</h2>

        <form onSubmit={(e) => {
          e.preventDefault();          
          sendData();
        }}>


          <input type="text" placeholder='UserName' 
          className='w-full mb-4 p-2 border border-gray-300 rounded' required 
          value = {name}
          onChange={(e) => setName(e.target.value)}
          />


          <input type="email" placeholder='Email' 
          className='w-full mb-4 p-2 border border-gray-300 rounded' required 
          value = {email}
          onChange={(e) => setEmail(e.target.value)}
          />


          <input type="password" placeholder='Password' className='w-full mb-6 p-2 border border-gray-300 rounded' required 
          value = {password}
          onChange={(e) => setPassword(e.target.value)}
          />

          
          <button type="submit" 
          className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
          >
            Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register
