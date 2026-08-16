import React, { useState } from 'react'
import { FaEye } from 'react-icons/fa';

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
          <h1> Shopping-list app </h1>
          <p className="login-subtitle"> </p>

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
               <FaEye /> 
              </button>
            </div>

            <a href="#" className="forgot-password">Forgot Password?</a>

            <button type="submit" className="login-btn">Login</button>
          </form>

          <p className="register-link">Not a member? <a href="/src/components/Registration">Register now</a></p>
        </div>
      </div>

      {/* Right Side - Illustration & Info */}
      
    </div>
  )
}
