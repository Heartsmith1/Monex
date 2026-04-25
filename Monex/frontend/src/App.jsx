import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import './css/pages/login.css'
import './css/components/SideBar.css'
import { Login } from './pages/Login/Login';
import {Home} from './pages/home/Home';
import { SideBar } from './components/SideBar/SideBar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Home" element={<Home/>}/>
          <Route path="/SideBar" element={<SideBar/>}/> 
        </Routes>
      </Router>
    </>
  )
}

export default App
