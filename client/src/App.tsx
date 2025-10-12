import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import AuthentificationHook from "./components/Context/AuthentificationHook";
import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ProfilePage from "./pages/Comments/ProfilePage";
import CommentsFeedPage from "./pages/Comments/CommentsFeedPage";

import "./App.css";

function App() {
  const { token } = AuthentificationHook();

  return (
    <>
      <Navbar /> {/* always render navbar */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/create-game" element={<ProtectedRoute><CreateQuiz /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/feed" element={<ProtectedRoute><CommentsFeedPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;
