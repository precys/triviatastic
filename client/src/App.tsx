// Package imports
import { Route, Routes } from 'react-router-dom'
// Components imports
import Navbar from "./components/Navbar/Navbar";
import AuthentificationHook from './components/Context/AuthentificationHook';
// Page imports
import Login from './pages/Login/Login';
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";
// CSS imports
import './App.css'

function App() {
  const { token } = AuthentificationHook();

  return (
    <>
      {token && <Navbar/>}
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
      </Routes>
    </>
  )
}

export default App
