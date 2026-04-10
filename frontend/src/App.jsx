import React from 'react'
import Header from './component/Header'
import { Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Footer from './component/Footer'
import Dashboard from './pages/Dashboard'
import Transaction from './pages/Transaction'


const App = () => {
  
  return (
    <div>
      
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/transaction' element={<Transaction />} />
        </Routes>
      </div>
      
    </div>
  )
}

export default App
