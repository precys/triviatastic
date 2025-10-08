// Package imports
import { Route, Routes } from 'react-router-dom'
// Components imports
import Navbar from "./components/Navbar/Navbar";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
// Page imports
import Home from "./pages/Home";
import Admin from "./pages/Admin";
// CSS imports
import './App.css'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/create-game" element={<CreateQuiz />}></Route>
      </Routes>
    </>
  )
}

export default App
