import React, { useState } from 'react'
import {PhoneInput} from 'react-international-phone'
import 'react-international-phone/style.css'
import { Text } from '../Text/Text';

export const Profile = () => {
  const [formData, setFormData] = useState({

    firstName: '',
    lastName: '',
    email: '',
    celphone: ''

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
        <Text variant={'h1'} style={{color:'#000',fontWeight: 'bold',fontFamily: "'Courier New', Courier, monospace"}}> Personal Information </Text>
        <p className="profile-subtitle">Manage your personal information and account details</p>
      </div>

      {/* Profile Card */}

      {/* <div className="profile-card">
        <div className="profile-info">
          <img src="https://via.placeholder.com/80" alt="Profile" className="profile-avatar" />
          <div className="profile-details">

          </div>
          <button className="change-photo-btn">📷 Change Photo</button>
        </div>
      </div> */}

      {/* Personal Information Section */}

      <div className="personal-info-section">
        {/* <h3>Personal Information</h3> */}

        <form className="form-grid">
          <div className="form-group">
            <label className='label-content'>First name</label>
            <input  type="text" name="firstName" placeholder="Firstname" value={formData.firstName} onChange={handleChange}  required />
          </div>
          <div className="form-group">
            <label className='label-content'>Last name</label>
            <input  type="text" name="lastName" value={formData.lastName} onChange={handleChange}  placeholder="Lastname" required />
          </div>
          <div className="form-group">
            <label className='label-content'>Email address</label>
            <input type="email" name="email" value={formData.email}  onChange={handleChange} placeholder="Email@gmail.com" required />

          </div>
          <div className="form-group">
            <label className='label-content'>Phone number</label>
            <PhoneInput className='cel-input' defaultCountry="za" forceDialCode={true} value={formData.celphone} onChange={(phone) => setFormData({ ...formData,celphone: phone})} />
          </div>
        </form>
      </div>
    </div>
  )
}
