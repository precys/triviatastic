// Package imports
import { Route, Routes } from 'react-router-dom'
// Components imports
import Navbar from "./components/Navbar/Navbar";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import AuthentificationHook from './components/Context/AuthentificationHook';
// Page imports
import Login from './pages/Login/Login';
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";
import Quiz from "./pages/Quiz/Quiz"
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
// CSS imports
import './App.css'

function App() {
  const { token } = AuthentificationHook();

  return (
    <>
      {token && <Navbar/>}
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>}></Route>
        <Route path="/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>}></Route>
        <Route path="/create-game" element={<ProtectedRoute> <CreateQuiz /> </ProtectedRoute>}></Route>
        <Route path="/quiz/:game_id" element={<ProtectedRoute> <Quiz /> </ProtectedRoute>}></Route>
      </Routes>
    </>
  )
}

export default App
