import React, { useState } from 'react';

const SettingsPage: React.FC = () => {
    const [settings, setSettings] = useState({
        siteName: 'MovieHubBD',
        logoUrl: 'https://i.ibb.co/hZ5g0J1/Movie-Hub-BD-Logo.png',
        tmdbApiKey: '',
        primaryColor: '#06b6d4', // cyan-500
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically save the settings to a backend.
        // For now, we'll just log them.
        console.log('Settings saved:', settings);
        alert('Settings saved successfully! (Check console)');
    };
    
    const FormField: React.FC<{label: string, name: string, value: string, type?: string, placeholder?: string}> = 
        ({ label, name, value, type = "text", placeholder }) => (
        <div>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-300">{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
            />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
                <div className="p-4 sm:p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">General Settings</h2>
                    <p className="mt-1 text-sm text-gray-400">Manage your website's core settings and appearance.</p>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="p-4 sm:p-6 space-y-6">
                        <FormField 
                            label="Site Name" 
                            name="siteName" 
                            value={settings.siteName} 
                            placeholder="Your Website Title"
                        />
                        <FormField 
                            label="Logo URL" 
                            name="logoUrl" 
                            value={settings.logoUrl} 
                            placeholder="https://example.com/logo.png"
                        />
                        <FormField 
                            label="TMDB API Key" 
                            name="tmdbApiKey" 
                            value={settings.tmdbApiKey} 
                            type="password"
                            placeholder="Enter your TMDB API v3 Key"
                        />
                        <div>
                             <label htmlFor="primaryColor" className="block mb-2 text-sm font-medium text-gray-300">Primary Accent Color</label>
                             <div className="relative">
                                <input
                                    type="color"
                                    id="primaryColor"
                                    name="primaryColor"
                                    value={settings.primaryColor}
                                    onChange={handleInputChange}
                                    className="p-1 h-10 w-16 block bg-gray-900 border border-gray-600 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
                                />
                                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">{settings.primaryColor}</span>
                             </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-cyan-600 text-white font-semibold text-sm rounded-lg hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-cyan-500/50 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;