import React, { useState } from 'react';

const TestRadioGroup = () => {
  const roles = ['user', 'organizer', 'admin'];
  const [selectedRole, setSelectedRole] = useState('user');

  return (
    <div style={{ padding: 20 }}>
      <h3>Test Radio Group</h3>
      <form>
        {roles.map(role => (
          <div key={role}>
            <input
              type="radio"
              id={role}
              name="role"
              value={role}
              checked={selectedRole === role}
              onChange={e => setSelectedRole(e.target.value)}
            />
            <label htmlFor={role}>{role}</label>
          </div>
        ))}
      </form>
    </div>
  );
};

export default TestRadioGroup; 