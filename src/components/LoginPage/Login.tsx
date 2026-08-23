import React, { useEffect, useState } from 'react';
// import { FaEye } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Text } from '../Text/Text';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from  '../../store/authSlice'
import type { RootState } from '../../store/store';
import type { AppDispatch } from '../../store/store';


export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Local state for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Redux state for form data
  const auth = useSelector((state: RootState) => state.auth);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous errors
    dispatch(clearError());

    // Basic validation
    if (!formData.username || !formData.password) {
      alert("Please enter both username and password");
      return;
    }

    // Dispatch login thunk
    dispatch(loginUser({
      username: formData.username,
      password: formData.password,
    }));
  };

  // Navigate only if authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/home');
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <div className="login-container">
      {/* Left Side - Login Form */}
      <div className="login-left">
        <div className="login-content">
          <Text  variant={'h1'} style={{ color : '#000',fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace",paddingBottom:'10px'}}> Shopping-list app </Text>
          {/* className="login-subtitle" */}

          <Text  variant={'p'} style={{fontFamily: "'Courier New', Courier, monospace",paddingBottom:'70px',width:'110%'}} >  Smart lists for stress‑free shopping </Text>

          {auth.error && (
            <div style={{ color: 'red', marginBottom: '16px', padding: '8px', backgroundColor: '#fee', borderRadius: '4px' }}>
              {auth.error}
            </div>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label className='username-label'>Username</label>
              <input  name="username" placeholder="Username"  value={formData.username}  onChange={handleChange}  className="input-field" />

            </div>
            <div className="form-group password-group">
              <label className='password-label'>Password</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input  type={showPassword ? 'text' : 'password'} name='password' placeholder="Password" value={formData.password}  onChange={handleChange} className="input-field"/>
                {/* <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
                </button> */}
              </div>
            </div>
            <a href="#" className="forgot-password">Forgot Password?</a>
          
            <button type="submit" className="login-btn">Login</button>
          
          </form>
          
           <p className="register-link"> Not a member? <Link to="/register">Register now</Link></p>
                 
        </div>
      </div>
    </div>

  )
}
