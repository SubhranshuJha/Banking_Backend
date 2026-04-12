import React from 'react'
import Header from './component/Header'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Transaction from './pages/Transaction'
import CreateAc from './pages/CreateAc'
import UserContext from './context/UserContext'



const App = () => {
  
  return (
    
    <div>
      
      <div>
        <UserContext>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/transaction' element={<Transaction />} />
          <Route path='/createac' element={<CreateAc />} />
        </Routes>
      
      </UserContext>
      </div>
    </div>
  )
}

export default App
