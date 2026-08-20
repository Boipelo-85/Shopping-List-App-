import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Registration } from '../Registration/Registration';
import { Text } from '../Text/Text';

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', formData)
  }

  return (
    <div className="login-container">
      {/* Left Side - Login Form */}
      <div className="login-left">
        <div className="login-content">
          <Text  variant={'h1'} style={{ color : '#000',fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace",paddingBottom:'10px'}}> Shopping-list app </Text>
          {/* className="login-subtitle" */}
          <Text  variant={'p'} style={{fontFamily: "'Courier New', Courier, monospace",paddingBottom:'70px'}} >  Smart lists for stress‑free shopping </Text>

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="form-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
               {/* <FaEye />  */}
              </button>
            </div>

            <a href="#" className="forgot-password">Forgot Password?</a>

            <button type="submit" className="login-btn">Login</button>
          </form>

         <p className="register-link"> Not a member? <Link to="/register">Register now</Link></p>
         
        </div>
      </div>

      {/* Right Side - Illustration & Info */}
      
    </div>
  )
}
