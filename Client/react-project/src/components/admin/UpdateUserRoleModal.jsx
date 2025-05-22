import { useState, useEffect } from 'react';

const UpdateUserRoleModal = ({ isOpen, onClose, onUpdate, currentRole }) => {
  const roles = ['user', 'organizer', 'admin'];
  const [selectedRole, setSelectedRole] = useState(currentRole);

  useEffect(() => {
    setSelectedRole(currentRole); // Reset when modal opens
  }, [isOpen, currentRole]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRole && selectedRole !== currentRole) {
      onUpdate(selectedRole); // Call update
    }
    onClose(); // Then close
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-60 px-4">
      {/* BACKDROP (click outside to close) */}
      <div
        className="absolute inset-0 z-0"
        onClick={onClose}
      />

      {/* MODAL CONTENT */}
      <div
        className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Close button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-200 focus:outline-none"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal content */}
        <h3 className="text-lg font-medium text-white mb-4">Update User Role</h3>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {roles.map((role) => (
              <div key={role} className="flex items-center">
                <input
                  type="radio"
                  id={role}
                  name="role"
                  value={role}
                  checked={selectedRole === role}
                  onChange={() => setSelectedRole(role)}
                  className="h-4 w-4 border-gray-600 text-indigo-600 bg-gray-700 focus:ring-indigo-500"
                />
                <label
                  htmlFor={role}
                  className="ml-3 text-sm font-medium text-gray-300 capitalize"
                >
                  {role}
                </label>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Update Role
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateUserRoleModal;

