import './App.css';
import React from 'react';
import { BrowserRouter , Routes , Route } from 'react-router-dom';
import LandingPage from "./components/LandingPage/LandingPage"
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';
import ProblemPage from './components/ProblemPage/ProblemPage';
import UserProfile from './components/UserProfile/UserProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbarfunc from './components/Navbar/Navbar';
import Submissions from './components/Submissions/Submissions';

function App() {
  return (
    <>
    <BrowserRouter>
        <Navbarfunc />
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/ProblemPage/:pid" element={<ProblemPage />} />
            <Route path="/UserProfile" element={<UserProfile />} />
            <Route path="/Submissions" element={<Submissions />} />
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;