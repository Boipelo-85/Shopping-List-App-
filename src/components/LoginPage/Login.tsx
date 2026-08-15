import React, { useState } from 'react'
import './Login.css'

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
          <h1>Welcome back!</h1>
          <p className="login-subtitle">Simplify </p>

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
                👁️
              </button>
            </div>

            <a href="#" className="forgot-password">Forgot Password?</a>

            <button type="submit" className="login-btn">Login</button>
          </form>

          <div className="social-login">
            <p>or continue with</p>
            <div className="social-buttons">
              <button className="social-btn google-btn">G</button>
              <button className="social-btn github-btn">⚙️</button>
              <button className="social-btn facebook-btn">f</button>
            </div>
          </div>

          <p className="register-link">Not a member? <a href="to={'Registration'}">Register now</a></p>
        </div>
      </div>

      {/* Right Side - Illustration & Info */}
      
    </div>
  )
}
