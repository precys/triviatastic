// Package imports
import { Route, Routes } from 'react-router-dom'
// Components imports
import Navbar from "./components/Navbar/Navbar";
// Page imports
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Profile from './pages/Profile';
// CSS imports
import './App.css'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/users/:userId" element={<Profile />}></Route>
        <Route path="/users/:userId/friends" element={<Profile />}></Route>
      </Routes>
    </>
  )
}

export default App
