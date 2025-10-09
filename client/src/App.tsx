// Package imports
import { Route, Routes } from 'react-router-dom';
// Components imports
import Navbar from "./components/Navbar/Navbar";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import AuthentificationHook from './components/Context/AuthentificationHook';
// Page imports

import Profile from './pages/Profile'; // Gwen's Profile Page, will condense into 1 profile page later

import Login from './pages/Login/Login';
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ProfilePage from "./pages/ProfilePage";
import CommentsFeedPage from "./pages/CommentsFeedPage";

// CSS imports
import './App.css';

function App() {
  const { token } = AuthentificationHook();
  return (
    <>
      {token && <Navbar/>}
      <Routes>

        {/* <Route path="/users/:userId" element={<Profile />}></Route>
        <Route path="/users/:userId/friends" element={<Profile />}></Route> */} //Gwen's Profile Routes

        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>}></Route>
        <Route path="/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>}></Route>
        <Route path="/create-game" element={<ProtectedRoute> <CreateQuiz /> </ProtectedRoute>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<CommentsFeedPage />} />

      </Routes>
    </>
  );
}

export default App;
