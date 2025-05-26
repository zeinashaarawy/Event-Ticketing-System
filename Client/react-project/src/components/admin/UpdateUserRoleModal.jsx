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
      onUpdate(selectedRole);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-60 px-4">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* MODAL CONTENT */}
      <div
        className="relative z-10 w-full max-w-lg transform overflow-hidden rounded-lg bg-gray-800 p-6 shadow-xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 focus:outline-none"
        >
          <span className="sr-only">Close</span>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal content */}
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-medium text-white mb-4">Update User Role</h3>
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="space-y-4">
              {roles.map((role) => (
                <label
                  key={role}
                  className="flex items-center p-3 cursor-pointer rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={selectedRole === role}
                    onChange={() => setSelectedRole(role)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-300 capitalize select-none">
                    {role}
                  </span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                Update Role
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserRoleModal;