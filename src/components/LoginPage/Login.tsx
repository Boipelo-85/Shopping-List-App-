// src/components/Login.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Text } from '../Text/Text';

import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';

import {
  loginUser,
  clearError,
} from '../../store/authSlice';

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  /* =====================================================
     REDUX AUTH STATE
  ===================================================== */

  const {
    loading,
    error,
    isAuthenticated,
  } = useSelector(
    (state: RootState) => state.auth
  );

  /* =====================================================
     FORM STATE
  ===================================================== */

 const [formData, setFormData] = useState({
  email: '',
  password: '',
});

  /* =====================================================
     PASSWORD VISIBILITY
  ===================================================== */
  


  const [showPassword, setShowPassword] =
    useState(false);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove old login error while typing
    if (error) {
      dispatch(clearError());
    }
  };

  /* =====================================================
     HANDLE LOGIN
  ===================================================== */

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    dispatch(clearError());

    const email = formData.email.trim();
    const password = formData.password;

    /* ---------------------------------------------------
       VALIDATION
    --------------------------------------------------- */

    if (!email) {
      return;
    }

    if (!password) {
      return;
    }

    try {
  

      await dispatch(
        loginUser({
          email,
          password,
        })
      ).unwrap();

      /*
       * Successful login.
       *
       * authSlice has already stored:
       * token
       * user
       *
       * in localStorage.
       */

      navigate('/home');

    } catch (loginError) {
      /*
       * loginUser rejected.
       *
       * authSlice.error will display the
       * actual error message.
       */

      console.error(
        'Login failed:',
        loginError
      );
    }
  };

  /* =====================================================
     REDIRECT IF ALREADY LOGGED IN
  ===================================================== */

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', {
        replace: true,
      });
    }
  }, [
    isAuthenticated,
    navigate,
  ]);

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="login-container">

      <div className="login-left">

        <div className="login-content">

          {/* =================================================
              HEADER
          ================================================= */}

          <Text
            variant="h1"
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontFamily:
                "'Courier New', Courier, monospace",
              paddingBottom: '10px',
            }}
          >
            Shopping-list app
          </Text>

          <Text
            variant="p"
            style={{
              fontFamily:
                "'Courier New', Courier, monospace",
              paddingBottom: '70px',
              width: '110%',
            }}
          >
            Smart lists for stress-free shopping
          </Text>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              style={{
                color: 'red',
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#fee',
                borderRadius: '6px',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          {/* =================================================
              LOGIN FORM
          ================================================= */}

          <form
            onSubmit={handleLogin}
            className="login-form"
          >

            {/* USERNAME / EMAIL */}

            <div className="form-group">

              <label className="username-label">
                Username
              </label>

              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                autoComplete="email"
                disabled={loading}
                required
              />

            </div>

            {/* PASSWORD */}

            <div className="form-group password-group">

              <label className="password-label">  Password </label>

              <div
                style={{
                  position: 'relative',
                }}
              >

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform:
                      'translateY(-50%)',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword
                    ? 'Hide'
                    : 'Show'}
                </button>

              </div>

            </div>

            {/* FORGOT PASSWORD */}

            <Link
              to="/forgot-password"
              className="forgot-password"
            >
              Forgot Password?
            </Link>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading
                ? 'Logging in...'
                : 'Login'}
            </button>

          </form>

          {/* REGISTER */}

          <p className="register-link">
            Not a member?{' '}

            <Link to="/register">
              Register now
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};