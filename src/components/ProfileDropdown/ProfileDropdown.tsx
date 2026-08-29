import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt, FaPencilAlt } from 'react-icons/fa';
import type { RootState } from '../../store/store';
import { logout } from '../../store/authSlice';

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  // Close dropdown when clicking outside

  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleViewProfile = () => {
    navigate('/profile?mode=credentials');
    setIsOpen(false);
  };

  const handleEditProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsOpen(false);
  };


  // Get user displayed name
  const displayName = auth.user?.firstName && auth.user?.lastName 
    ? `${auth.user.firstName} ${auth.user.lastName}` 
    : auth.user?.username || 'User';

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button 
        className="profile-dropdown-trigger"
        onClick={toggleDropdown}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',

        }}
      >
        <FaUserCircle className="profile-icon" />
      </button>

      {isOpen && (
        <div 

          className="profile-dropdown-menu"
          style={{    position: 'absolute', top: '100%', right: '20px', marginTop: '0px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', minWidth: '300px', zIndex: 1000, overflow: 'hidden',}}
        >
          {/* User Info Header */}

          <div 
            className="profile-dropdown-header"
            style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',

            }}
          >
            <div 
              className="profile-dropdown-name"
              style={{

                fontWeight: 'bold',
                fontSize: '16px',
                color: '#111827',
                marginBottom: '4px',
                fontFamily: "'Courier New', Courier, monospace",
              }}
            >
              {displayName}

            </div>
            <div 
              className="profile-dropdown-email"
              style={{
                fontSize: '14px',
                color: '#6b7280',
                fontFamily: "'Courier New', Courier, monospace",

              }}
            >
              {auth.user?.email || 'No email'}

            </div>
          </div>

          {/* Menu Options */}
          <div className="profile-dropdown-options">
            
          

            <button
              className="profile-dropdown-option"
              onClick={handleEditProfile}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                color: '#374151',
                fontFamily: "'Courier New', Courier, monospace",
                transition: 'background-color 0.2s',

              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaPencilAlt style={{ color: '#6b7280', fontSize: '16px' }} />
              <span>Edit Profile</span>
            </button>

            {/* <button
              className="profile-dropdown-option"
              onClick={handleCreateProfile}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                color: '#374151',
                fontFamily: "'Courier New', Courier, monospace",
                transition: 'background-color 0.2s'


              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}

            >
              <FaUserPlus style={{ color: '#6b7280', fontSize: '16px' }} />
              <span>Create Profile</span>

            </button> */}

              <button
              className="profile-dropdown-option"
              onClick={handleViewProfile}
              style={{ width: '100%', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '14px', color: '#374151', fontFamily: "'Courier New', Courier, monospace", transition: 'background-color 0.2s',}}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaPencilAlt   style={{ color: '#6b7280', fontSize: '16px' }} />

              <span>Update login details</span>

            </button>
            <div style={{ borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
               
            <button
              className="profile-dropdown-option"
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                color: '#dc2626',
                fontFamily: "'Courier New', Courier, monospace",
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <FaSignOutAlt style={{ color: '#dc2626', fontSize: '16px' }} />
              <span>Logout</span>
            </button>
          </div>
        </div>

      )}

    </div>
  
  );
};
