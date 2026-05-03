import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import './css/pages/login.css'
import './css/pages/register.css'
import './css/components/sideBar.css'
import './css/components/navbar.css'
import { Login } from './pages/Login/Login';
import {Home} from './pages/home/Home';
import { SideBar } from './components/SideBar/SideBar';
import { Register } from './pages/Registro/Register'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Home" element={<Home/>}/>
          <Route path="/SideBar" element={<SideBar/>}/> 
          <Route path="/Register" element={<Register/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
