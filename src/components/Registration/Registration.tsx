import React, { useState } from 'react';
import { Text } from '../Text/Text';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { registerUser } from '../../store/authSlice';

export const Registration = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    celphone: '',
    password: '',
    confirmPassword: '',
  });

  const [successMessage, setSuccessMessage] = useState('');

    //  HANDLE INPUT CHANGES


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear success message when user starts editing again
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  /* =====================================================
     HANDLE PHONE CHANGE
  ===================================================== */

  const handlePhoneChange = (phone: string) => {
    setFormData((prev) => ({
      ...prev,
      celphone: phone,
    }));

    if (successMessage) {
      setSuccessMessage('');
    }
  };

  /* =====================================================
     HANDLE REGISTRATION
  ===================================================== */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setSuccessMessage('');

    try {
      
      await dispatch(
        registerUser(formData)
      ).unwrap();

      // Registration was successful
      setSuccessMessage(
        'Account created successfully! You can now sign in.'
      );

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        celphone: '',
        password: '',
        confirmPassword: '',
      });

    } catch (err) {
    
      console.error(
        'Registration failed:',
        err
      );
    }
  };

  return (
    <div className="registration-container">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="registration-header">
        <Text
          variant="h1"
          style={{
            color: '#000',
            fontWeight: 'bold',
            fontFamily:
              "'Courier New', Courier, monospace",
          }}
        >
          Create Account
        </Text>

        <p className="registration-subtitle">
          Join us today and get started with your
          shopping list
        </p>
      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <form
        className="registration-form"
        onSubmit={handleSubmit}
      >

        {/* FIRST + LAST NAME */}

        <div className="form-row">

          <div className="form-group">
            <label className="reg-labels">
              First name
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First name"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="reg-labels">
              Last name
            </label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last name"
              required
              disabled={loading}
            />
          </div>

        </div>

        {/* EMAIL */}

        <div className="form-group">
          <label className="reg-labels-emals">
            Email address
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            disabled={loading}
          />
        </div>

        {/* PHONE */}

        <div className="form-group">
          <label className="reg-labels-phone">
            Phone number
          </label>

          <div className="phone-input-group">
            <PhoneInput
              className="cel-input"
              defaultCountry="za"
              forceDialCode={true}
              value={formData.celphone}
              onChange={handlePhoneChange}
              disabled={loading}
            />
          </div>
        </div>

        {/* PASSWORD */}

        <div className="form-group">
          <label className="reg-labels-password">
            Password
          </label>

          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            disabled={loading}
          />
        </div>

        {/* CONFIRM PASSWORD */}

        <div className="form-group">
          <label className="reg-labels-emals">
            Confirm Password
          </label>

          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            disabled={loading}
          />
        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="registration-error">
            {error}
          </div>
        )}

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {successMessage && (
          <div className="registration-success">
            {successMessage}
          </div>
        )}

        {/* =================================================
            SUBMIT BUTTON
        ================================================= */}

        <button
          type="submit"
          className="register-btn"
          disabled={loading}
        >
          {loading
            ? 'Creating Account...'
            : 'Create Account'}
        </button>

        {/* LOGIN LINK */}

        <p className="login-link">
          Already have an account?{' '}
          <a href="/login">
            Sign in
          </a>
        </p>

      </form>
    </div>
  );
};