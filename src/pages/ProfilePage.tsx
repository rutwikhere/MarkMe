import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { User, Mail, Save, Edit2, Plus } from 'lucide-react';

interface TA {
  email: string;
  phone: string;
}

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [tas, setTAs] = useState<TA[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [taEmail, setTAEmail] = useState('');
  const [taPhone, setTAPhone] = useState('');

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateProfile({ name, department });
      setSaving(false);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  const handleAddTA = () => {
    if (taEmail && taPhone) {
      setTAs([...tas, { email: taEmail, phone: taPhone }]);
      setTAEmail('');
      setTAPhone('');
      setShowModal(false);
      // 🔒 Add backend call to give access if needed
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-gray-400" />
            )}
          </div>

          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600 flex items-center mt-1">
            <Mail size={16} className="mr-1" />
            {user.email}
          </p>
          <span className="mt-2 inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
            {user.role === 'professor' ? 'Professor' : 'Teaching Assistant'}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {!isEditing ? (
            <>
              <div>
                <h4 className="text-sm text-gray-500">Department</h4>
                <p className="text-gray-800 mt-1">{user.department}</p>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                <Edit2 size={16} className="inline-block mr-2" />
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Full Name</label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Department</label>
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  {saving ? 'Saving...' : (
                    <>
                      <Save size={16} className="inline-block mr-2" />
                      Save
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name);
                    setDepartment(user.department);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>

              {saveSuccess && (
                <div className="bg-green-100 text-green-700 px-3 py-2 rounded-md text-sm text-center">
                  Profile updated!
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* TA Management */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Teaching Assistants</h3>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            <Plus size={18} className="mr-2" />
            Add TA
          </button>
        </div>

        {tas.length === 0 ? (
          <p className="text-gray-500 text-sm">No TAs added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tas.map((ta, i) => (
              <li key={i} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">{ta.email}</p>
                  <p className="text-gray-500 text-sm">{ta.phone}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm space-y-4 animate-fade-in">
            <h4 className="text-lg font-semibold">Add TA Access</h4>
            <input
              type="email"
              placeholder="TA's Email"
              value={taEmail}
              onChange={(e) => setTAEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <input
              type="tel"
              placeholder="TA's Phone Number"
              value={taPhone}
              onChange={(e) => setTAPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTA}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
