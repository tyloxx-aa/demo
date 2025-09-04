import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpinnerIcon } from '../../components/Icons';

// Default credentials - in a real app, this would be from an API or environment variables
const DEFAULT_USER = 'admin';
const DEFAULT_PASS = 'password';

// Helper functions to manage credentials, using localStorage for this demo
const getStoredPassword = () => localStorage.getItem('adminPassword') || DEFAULT_PASS;
const getStoredUsername = () => localStorage.getItem('adminUsername') || DEFAULT_USER;


const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect them away from the login page
    if (localStorage.getItem('isLoggedIn') === 'true') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate an API call delay for better UX
    setTimeout(() => {
      const storedUsername = getStoredUsername();
      const storedPassword = getStoredPassword();

      if (username === storedUsername && password === storedPassword) {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid username or password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                 <img className="h-12 w-auto mx-auto" src="https://i.ibb.co/hZ5g0J1/Movie-Hub-BD-Logo.png" alt="MovieHubBD Logo" />
                 <h2 className="mt-6 text-2xl font-bold text-white">Admin Panel Login</h2>
                 <p className="mt-2 text-sm text-gray-400">Please sign in to continue</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                            Username
                        </label>
                        <div className="mt-1">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                placeholder="default: admin"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                                placeholder="default: password"
                            />
                        </div>
                    </div>
                    
                    {error && (
                         <div className="p-3 text-sm text-red-300 bg-red-900/50 rounded-lg border border-red-500/30 text-center" role="alert">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isLoading ? (
                                <SpinnerIcon className="w-5 h-5 animate-spin" />
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default LoginPage;
