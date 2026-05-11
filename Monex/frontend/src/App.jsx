import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './css/pages/login.css';
import './css/pages/register.css';
import './css/components/sideBar.css';
import './css/components/navbar.css';
import './css/pages/home.css';
import './css/pages/categories.css';
import './css/pages/expenses.css';
import './css/pages/analisis.css';

import { Categorias } from './pages/categories/Categories';
import { Login } from './pages/Login/Login';
import { Home } from './pages/home/Home';
import { SideBar } from './components/SideBar/SideBar';
import { Register } from './pages/Registro/Register';
import { Expenses } from './pages/expenses/expenses';
<<<<<<< HEAD
import { EstMensual } from './pages/est_monthly/est_monthly';
=======
import { Analisis } from './pages/analisis/analisis';
>>>>>>> 504c59f9f7f3687b4c332891ca95d9778538f119

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Home" element={<Home/>}/>
          <Route path="/SideBar" element={<SideBar/>}/> 
          <Route path="/Register" element={<Register/>}/>
          <Route path="/categorias" element={<Categorias/>}/>
          <Route path="/Gastos" element={<Expenses/>}/>
<<<<<<< HEAD
          <Route path="/est_monthly" element={<EstMensual/>}/>
=======
          <Route path="/Analisis" element={<Analisis/>}/>
          
>>>>>>> 504c59f9f7f3687b4c332891ca95d9778538f119
        </Routes>
      </Router>
    </>
  )
}

export default App
