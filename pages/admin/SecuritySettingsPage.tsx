import React, { useState } from 'react';

// Default credentials - in a real app, this would be from an API or environment variables
const DEFAULT_PASS = 'password';

// Helper functions to manage the password, using localStorage for this demo
const getStoredPassword = () => localStorage.getItem('adminPassword') || DEFAULT_PASS;
const setStoredPassword = (pass: string) => localStorage.setItem('adminPassword', pass);

const SecuritySettingsPage: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    // Clear feedback on new input
    if (feedback.message) {
      setFeedback({ message: '', type: '' });
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ message: '', type: '' });

    // --- Validation ---
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setFeedback({ message: "New passwords do not match.", type: 'error' });
        return;
    }

    if (passwordForm.newPassword.length < 6) {
        setFeedback({ message: "New password must be at least 6 characters long.", type: 'error' });
        return;
    }

    const storedPassword = getStoredPassword();
    if (passwordForm.currentPassword !== storedPassword) {
        setFeedback({ message: "Incorrect current password.", type: 'error' });
        return;
    }

    if (passwordForm.newPassword === storedPassword) {
        setFeedback({ message: "New password cannot be the same as the old one.", type: 'error' });
        return;
    }
    
    // --- Update Password ---
    setStoredPassword(passwordForm.newPassword);
    setFeedback({ message: "Password updated successfully!", type: 'success' });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });

    // Hide success message after a few seconds
    setTimeout(() => setFeedback({ message: '', type: '' }), 4000);
  };

  const FormField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> =
    ({ label, name, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
        <input
            type="password"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required
            className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
        />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        {/* Change Password Card */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
            <div className="p-4 sm:p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Change Password</h2>
                <p className="mt-1 text-sm text-gray-400">For your security, we recommend choosing a strong password.</p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
                <div className="p-4 sm:p-6 space-y-6">
                    <FormField label="Current Password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
                    <FormField label="New Password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} />
                    <FormField label="Confirm New Password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} />

                    {feedback.message && (
                        <div className={`p-3 text-sm rounded-lg border text-center ${
                            feedback.type === 'success' ? 'bg-green-900/50 border-green-500/30 text-green-300' : 'bg-red-900/50 border-red-500/30 text-red-300'
                        }`}>
                           {feedback.message}
                        </div>
                    )}
                </div>
                <div className="p-4 sm:p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-cyan-600 text-white font-semibold text-sm rounded-lg hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-cyan-500/50 transition-colors"
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </div>

        {/* Admin URL Card */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
            <div className="p-4 sm:p-6 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">Admin URL</h2>
                <p className="mt-1 text-sm text-gray-400">Manage the access path to the admin panel.</p>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
                <div>
                    <label htmlFor="adminUrl" className="block mb-2 text-sm font-medium text-gray-300">Current Admin Path</label>
                    <input
                        type="text"
                        id="adminUrl"
                        value="/#/admin"
                        disabled
                        className="bg-gray-900 border border-gray-600 text-gray-400 text-sm rounded-lg block w-full p-2.5 cursor-not-allowed font-mono"
                    />
                </div>
                <p className="text-xs text-gray-500 bg-gray-900/50 p-3 rounded-md border border-gray-700">
                    <strong className="text-gray-400">Note:</strong> Changing the admin panel URL is a server-level configuration that requires modifications to the application's core routing code and deployment configuration. It cannot be changed from this interface.
                </p>
            </div>
        </div>
    </div>
  );
};

export default SecuritySettingsPage;
