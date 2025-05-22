import { useState } from 'react';
import { useAuth } from '../../context/authContext';

const UserRow = ({ user, onEdit, onDelete }) => {
  const { user: currentUser } = useAuth();

  const handleDeleteClick = async () => {
    if (currentUser._id === user._id) {
      alert("You cannot delete your own account.");
      return;
    }

    try {
      await onDelete(user._id);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  return (
    <tr className="hover:bg-gray-700/50 transition-colors">
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-white">{user.name}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{user.email}</td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 capitalize">
        <span className="inline-flex items-center rounded-md bg-gray-900/50 px-2 py-1 text-xs font-medium">
          {user.role}
        </span>
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
        {currentUser._id !== user._id && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => onEdit(user)}
              className="text-indigo-400 hover:text-indigo-300"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default UserRow;

