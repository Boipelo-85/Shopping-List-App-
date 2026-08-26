// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

import './App.css'
import { Header } from './components/Header/Header';
import { Home } from './components/Home/Home';
import { Login } from './components/LoginPage/Login';
import { Registration } from './components/Registration/Registration';
import {Profile} from './components/Profile/Profile'; // <-- create this
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';

import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useSelector((state: RootState) => state.auth);
  
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;

};

// Public Route component (redirects to home if already authenticated)

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const auth = useSelector((state: RootState) => state.auth);
  
  if (auth.isAuthenticated) {

    return <Navigate to="/home" replace />;
    
  }
  
  return <>{children}</>;

};

const HomePage = () => {
  const [searchParams] = useSearchParams();

  return (
    <>
      <Header />
      <div className='main-content'>
        <Home searchQuery={searchParams.get('search') || ''} />
      </div>
    </>
  );
};

function App() {
  return (
    <>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Default route - Login page without header */}
            <Route path="/" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            
            {/* Registration page without header */}
            <Route path="/register" element={
              <PublicRoute>
                <Registration />
              </PublicRoute>
            } />
            
            {/* Home page with header - protected */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Profile page with header - protected */}
            <Route 
              path="/profile" 
              element={ 
                <ProtectedRoute> 
                  <Header />
                  <div className='main-content'>
                    <Profile />
                  </div>
                </ProtectedRoute>
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
