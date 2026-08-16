import React, { useState } from 'react'
import './Profile.css'

export const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: ' ',
    lastName: ' ',
    email: ' ',
    phone: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="profile-container">
        
      {/* Header */}

      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p className="profile-subtitle">Manage your personal information and account details</p>
      </div>

      {/* Profile Card */}

      <div className="profile-card">
        <div className="profile-info">
          <img src="https://via.placeholder.com/80" alt="Profile" className="profile-avatar" />
          <div className="profile-details">

          </div>
          <button className="change-photo-btn">📷 Change Photo</button>
        </div>
      </div>

      {/* Personal Information Section */}

      <div className="personal-info-section">
        <h3>Personal Information</h3>

        <form className="form-grid">
          <div className="form-group">
            <label htmlFor="firstName">First name</label>
            <input 
              type="text" 
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="firstname"
              
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last name</label>
            <input 
              type="text" 
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Lastname"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email@gmail.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone number</label>
            <input 
              type="tel" 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+27"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
