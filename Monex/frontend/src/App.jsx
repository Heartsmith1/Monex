import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './css/pages/login.css';
import './css/pages/register.css';
import './css/components/sideBar.css';
import './css/components/navbar.css';
import './css/pages/home.css';
import './css/pages/categories.css';
import './css/pages/expenses.css';

import { Categorias } from './pages/categories/Categories';
import { Login } from './pages/Login/Login';
import { Home } from './pages/home/Home';
import { SideBar } from './components/SideBar/SideBar';
import { Register } from './pages/Registro/Register';
import { Expenses } from './pages/expenses/expenses';
import { EstMensual } from './pages/est_monthly/est_monthly';

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
          <Route path="/est_monthly" element={<EstMensual/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
