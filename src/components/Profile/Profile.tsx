import React, { useEffect, useState } from 'react'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Text } from '../Text/Text';
import type { AppDispatch, RootState } from '../../store/store';
import { clearError, updateUserCredentials, updateUserProfile } from '../../store/authSlice';

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const isCredentialsMode = mode === 'credentials';

  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
    celphone: '',
  });

  const [credentialsFormData, setCredentialsFormData] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    setProfileFormData({
      firstName: auth.user?.firstName || '',
      lastName: auth.user?.lastName || '',
      celphone: auth.user?.celphone || '',
    });

    setCredentialsFormData((prev) => ({
      ...prev,
      email: auth.user?.email || '',
    }));
  }, [auth.user]);

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (auth.error) {
      dispatch(clearError());
    }

    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (auth.error) {
      dispatch(clearError());
    }

    setCredentialsFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(updateUserProfile(profileFormData)).unwrap();
      showToastMessage('Profile updated successfully');
    } catch (error) {
      showToastMessage(
        typeof error === 'string'
          ? error
          : 'Failed to update profile'
      );
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(updateUserCredentials(credentialsFormData)).unwrap();
      setCredentialsFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
      showToastMessage('Login details updated successfully');
    } catch (error) {
      showToastMessage(
        typeof error === 'string'
          ? error
          : 'Failed to update login details'
      );
    }
  };

  return (
    <div className="profile-container">
      {showToast && (
        <div className='toast-notification'>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="profile-header">
        <Text variant={'h1'} style={{color:'#000',fontWeight: 'bold',fontFamily: "'Courier New', Courier, monospace"}}>
          {isCredentialsMode ? 'Update Login Details' : 'Personal Information'}
        </Text>
        <p className="profile-subtitle">
          {isCredentialsMode
            ? 'Update the email and password you use to log in'
            : 'Manage your personal information and account details'}
        </p>
      </div>

      <div className="personal-info-section">
        {isCredentialsMode ? (
          <form className="profile-credentials-form" onSubmit={handleCredentialsSubmit}>
            <div className="form-group">
              <label className='label-content'>Email address</label>
              <input type="email" name="email" value={credentialsFormData.email} onChange={handleCredentialsChange} placeholder="Email@gmail.com" required />
            </div>

            <div className="form-group">
              <label className='label-content'>Current password</label>
              <input type="password" name="currentPassword" value={credentialsFormData.currentPassword} onChange={handleCredentialsChange} placeholder="Enter current password" required />
            </div>

            <div className="form-group">
              <label className='label-content'>New password</label>
              <input type="password" name="newPassword" value={credentialsFormData.newPassword} onChange={handleCredentialsChange} placeholder="Enter new password" required />
            </div>

            <div className="form-group">
              <label className='label-content'>Confirm new password</label>
              <input type="password" name="confirmNewPassword" value={credentialsFormData.confirmNewPassword} onChange={handleCredentialsChange} placeholder="Confirm new password" required />
            </div>

            <div className="profile-actions">
              <button type="submit" className="profile-save-btn" disabled={auth.loading}>
                {auth.loading ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>
        ) : (
          <form className="form-grid" onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label className='label-content'>First name</label>
              <input type="text" name="firstName" placeholder="Firstname" value={profileFormData.firstName} onChange={handleProfileChange} required />
            </div>
            <div className="form-group">
              <label className='label-content'>Last name</label>
              <input type="text" name="lastName" value={profileFormData.lastName} onChange={handleProfileChange} placeholder="Lastname" required />
            </div>
            <div className="form-group profile-form-span-full">
              <label className='label-content'>Phone number</label>
              <PhoneInput className='cel-input' defaultCountry="za" forceDialCode={true} value={profileFormData.celphone} onChange={(phone) => {
                if (auth.error) {
                  dispatch(clearError());
                }
                setProfileFormData((prev) => ({ ...prev, celphone: phone }));
              }} />
            </div>
            <div className="profile-actions">
              <button type="submit" className="profile-save-btn" disabled={auth.loading}>
                {auth.loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
