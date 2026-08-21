// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

import './App.css'
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import { Login } from './components/LoginPage/Login';
import { Registration } from './components/Registration/Registration';
import {Profile} from './components/Profile/Profile'; // <-- create this
// import { useSelector } from 'react-redux';
// import type { RootState } from './store/store';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
function App() {

  //  const auth = useSelector((state: RootState) => state.auth);
   
  return (
    <>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Default route - Login page without header */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            {/* Registration page without header */}
            <Route path="/register" element={<Registration />} />
            
            {/* Home page with header */}
            <Route 
              path="/home" 
              element={
                <>
                  <Header />
                  <div className='main-content'>
                    <Home />
                  </div>
                </>
              } 
            />
            
            {/* Profile page with header */}
            <Route 
              path="/profile" 
              element={
                <>
                  <Header />
                  <div className='main-content'>
                    <Profile />
                  </div>
                </>
              } 
            />
            {/* Redirect any unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
