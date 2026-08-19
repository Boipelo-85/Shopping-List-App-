import React, { useState } from 'react'
import { Text } from '../Text/Text';
import {PhoneInput} from 'react-international-phone'
import 'react-international-phone/style.css'
import { DiVim } from 'react-icons/di';

export const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    celphone: '',
    password: '',
    confirmPassword: ''
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Registration data:', formData)
  }
  return (
    <div className="registration-container">
      <div className="registration-header">
        <Text variant={'h1'} style={{ fontWeight: 'bold', fontFamily: "'Courier New', Courier, monospace"}}>Create Account</Text>
        <p className="registration-subtitle">Join us today and get started with your shopping list</p>
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className='reg-labels'>First name</label>
            <input
              type="text"
             
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
            />
          </div>

          <div className="form-group">
            <label className='reg-labels'>Last name</label>
            <input
              type="text"
          
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className='reg-labels-emals'>Email address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
          />
        </div>

        <div className="form-group">
          <label className='reg-labels-phone'>Phone number</label>
          <div className="phone-input-group">
            {/* <PhoneInput  defaultCountry='za' forceDialCode={true} value={formData.celphone}  onChange={(phone) => setFormData(phone)} /> */}
            {/* <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone number" required /> */}
            <PhoneInput className='cel-input' defaultCountry="za" forceDialCode={true} value={formData.celphone} onChange={(phone) => setFormData({ ...formData,celphone: phone})} />
        </div>
          </div> 

        <div className="form-group">
          <label className='reg-labels-password'>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>

        <div className="form-group">
          <label className='reg-labels-emals'>Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
        </div>

        <button type="submit" className="register-btn">Create Account</button>

        <p className="login-link">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </form>
    </div>
  )
}
