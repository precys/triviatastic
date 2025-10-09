// Package imports
import { Route, Routes, useLocation } from 'react-router-dom';
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
import ProfilePage from "./pages/ProfilePage";
import CommentsFeedPage from "./pages/CommentsFeedPage";
// CSS imports
import './App.css';

function App() {
  const { token, userRole } = AuthentificationHook();
  const location = useLocation();


  return (
    <>
      {token && location.pathname !== "/" && <Navbar/>}
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />
        {/* Protected */}
        <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>}></Route>
        <Route path="/create-game" element={<ProtectedRoute> <CreateQuiz /> </ProtectedRoute>}></Route>
        <Route path="/quiz/:game_id" element={<ProtectedRoute> <Quiz /> </ProtectedRoute>}></Route>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<CommentsFeedPage />} />
        {/* Admin Only */}
        {userRole == "ADMIN" && <Route path="/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>}></Route>}
      </Routes>
    </>
  );
}

export default App;
