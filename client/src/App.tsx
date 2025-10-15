// Package imports
import { Route, Routes, useLocation } from 'react-router-dom';
// Components imports
import Navbar from "./components/Navbar/Navbar";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import AuthentificationHook from './components/Context/AuthentificationHook';
// Page imports

import Profile from './pages/Profile'; // Gwen's Profile Page, will condense into 1 profile page later

import Login from './pages/Login/Login';
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";
import Quiz from "./pages/Quiz/Quiz"
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProfilePage from "./pages/Comments/ProfilePage";
import CommentsFeedPage from "./pages/Comments/CommentsFeedPage";
import SubmitQuestion from './pages/SubmitQuestion/SubmitQuestion';
import FeedPage from './pages/Comments/FeedPage';
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
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/create-game" element={<ProtectedRoute> <CreateQuiz /> </ProtectedRoute>}></Route>
        <Route path="/quiz/:game_id" element={<ProtectedRoute> <Quiz /> </ProtectedRoute>}></Route>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/feed" element={<CommentsFeedPage />} />
        <Route path="/submit-question" element={<ProtectedRoute> <SubmitQuestion /> </ProtectedRoute>} />
        {/* Admin Only */}
        {userRole == "ADMIN" && <Route path="/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>}></Route>}
      </Routes>
    </>
  );
}

export default App;
