// Package imports
import { Route, Routes } from 'react-router-dom';
// Components imports
import Navbar from "./components/Navbar/Navbar";
// Page imports
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import ProfilePage from "./pages/ProfilePage";
import CommentsFeedPage from "./pages/CommentsFeedPage";
// CSS imports
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/feed" element={<CommentsFeedPage />} />
      </Routes>
    </>
  );
}

export default App;
