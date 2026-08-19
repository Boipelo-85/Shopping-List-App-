// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

import './App.css'
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import { Login } from './components/LoginPage/Login';
import { Registration } from './components/Registration/Registration';
import {Profile} from './components/Profile/Profile'; // <-- create this


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {

  return (
    <>
     
      <Router>
      <div className="app-container">
        <Header />
        <div className='main-content'>
          {/* React-router-dom for re-directing pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/profile" element={<Profile/>} /> {/* profile route */}
          </Routes>
        </div>
      </div>
    </Router>
        
    </>
  )
}

export default App
