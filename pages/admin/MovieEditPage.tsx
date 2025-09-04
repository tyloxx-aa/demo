import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../../constants';
import { ContentItem } from '../../types';

const MovieEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<ContentItem | null>(null);
  
  useEffect(() => {
    const itemToEdit = MOCK_DATA.find(item => item.id === id);
    if (itemToEdit) {
      setMovie(JSON.parse(JSON.stringify(itemToEdit))); // Deep copy
    }
  }, [id]);

  if (!movie) {
    return <div className="text-center p-8">Loading movie data...</div>;
  }

  const handleInputChange = (field: keyof ContentItem, value: any) => {
    setMovie(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleSaveChanges = () => {
    console.log("Saving changes for movie:", movie);
    alert("Changes saved to console!");
    navigate('/admin/movies');
  }

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-white">Edit Movie</h1>
            <p className="text-gray-400 mt-1">Editing: <span className="font-semibold text-cyan-400">{movie.title}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin/movies')} className="px-5 py-2.5 bg-gray-700 text-white font-semibold text-sm rounded-lg hover:bg-gray-600 transition-colors">
            Cancel
          </button>
          <button onClick={handleSaveChanges} className="px-5 py-2.5 bg-cyan-600 text-white font-semibold text-sm rounded-lg hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-cyan-500/50 transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Details Form */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">Movie Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Title</label>
                <input type="text" value={movie.title} onChange={e => handleInputChange('title', e.target.value)} className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Poster Path URL</label>
                <input type="text" value={movie.posterPath} onChange={e => handleInputChange('posterPath', e.target.value)} className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
            </div>
            <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-300">Overview</label>
                <textarea value={movie.overview} onChange={e => handleInputChange('overview', e.target.value)} rows={4} className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"></textarea>
            </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">SEO Settings</h2>
        <div className="space-y-6">
            <div>
                <label htmlFor="seoTitle" className="block mb-2 text-sm font-medium text-gray-300">Meta Title</label>
                <input 
                  type="text" 
                  id="seoTitle"
                  value={movie.seoTitle || ''} 
                  onChange={e => handleInputChange('seoTitle', e.target.value)} 
                  className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" 
                  placeholder="e.g. Watch Movie Title (Year) Online - MovieHubBD"
                />
                <p className="mt-1 text-xs text-gray-400">Recommended: 50-60 characters. Current: {movie.seoTitle?.length || 0}</p>
            </div>
            <div>
                <label htmlFor="seoDescription" className="block mb-2 text-sm font-medium text-gray-300">Meta Description</label>
                <textarea 
                  id="seoDescription"
                  value={movie.seoDescription || ''} 
                  onChange={e => handleInputChange('seoDescription', e.target.value)} 
                  rows={3} 
                  className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                  placeholder="e.g. Stream and download Movie Title, an action-packed film about..."
                ></textarea>
                <p className="mt-1 text-xs text-gray-400">Recommended: 150-160 characters. Current: {movie.seoDescription?.length || 0}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default MovieEditPage;