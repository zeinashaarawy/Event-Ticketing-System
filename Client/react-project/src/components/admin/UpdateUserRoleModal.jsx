import { useState, useEffect } from 'react';

const UpdateUserRoleModal = ({ isOpen, onClose, onUpdate, currentRole }) => {
  const roles = ['user', 'organizer', 'admin'];
  const [selectedRole, setSelectedRole] = useState(currentRole);

  useEffect(() => {
    setSelectedRole(currentRole);
  }, [isOpen, currentRole]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(selectedRole);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '24px',
        borderRadius: '12px',
        width: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h2 style={{ 
          marginBottom: '24px', 
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Update User Role
        </h2>
        
        <form onSubmit={handleSubmit}>
          {roles.map((role) => (
            <div 
              key={role} 
              style={{ 
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: selectedRole === role ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                border: '1px solid',
                borderColor: selectedRole === role ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedRole(role)}
            >
              <input
                type="radio"
                id={role}
                name="role"
                value={role}
                checked={selectedRole === role}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{
                  marginRight: '12px',
                  width: '18px',
                  height: '18px',
                  accentColor: '#6366f1'
                }}
              />
              <label 
                htmlFor={role}
                style={{
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </label>
            </div>
          ))}
          
          <div style={{ 
            marginTop: '24px', 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: '12px' 
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease-in-out',
                ':hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease-in-out',
                ':hover': {
                  backgroundColor: '#4f46e5'
                }
              }}
            >
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserRoleModal;