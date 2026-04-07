import React from 'react'
import Header from './component/Header'
import { Route, Routes } from 'react-router-dom'
import Register from './component/Register'
import Login from './component/Login'
import Home from './component/Home'
import Footer from './component/Footer'


const App = () => {
  
  return (
    <div>
      <Header />
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
