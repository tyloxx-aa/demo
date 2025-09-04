import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_DATA } from '../../constants';
import { ContentItem, Season } from '../../types';
import SeasonAccordion from '../../components/admin/SeasonAccordion';
import { PlusCircleIcon } from '../../components/Icons';

const SeriesEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);
  
  useEffect(() => {
    const itemToEdit = MOCK_DATA.find(item => item.id === id);
    if (itemToEdit) {
      setContentItem(JSON.parse(JSON.stringify(itemToEdit))); // Deep copy to avoid mutating mock data
    }
  }, [id]);

  if (!contentItem) {
    return <div className="text-center p-8">Loading content data...</div>;
  }

  const handleInputChange = (field: keyof ContentItem, value: any) => {
    setContentItem(prev => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleSeasonChange = (index: number, updatedSeason: Season) => {
     if (!contentItem || !contentItem.seasons) return;
     const newSeasons = [...contentItem.seasons];
     newSeasons[index] = updatedSeason;
     setContentItem({ ...contentItem, seasons: newSeasons });
  }

  const addSeason = () => {
    if (!contentItem) return;
    const newSeasonNumber = (contentItem.seasons?.length || 0) + 1;
    const newSeason: Season = {
        seasonNumber: newSeasonNumber,
        episodes: [],
    };
    const updatedSeasons = contentItem.seasons ? [...contentItem.seasons, newSeason] : [newSeason];
    setContentItem({ ...contentItem, seasons: updatedSeasons });
  }

  const deleteSeason = (index: number) => {
    if (!contentItem || !contentItem.seasons) return;
    const newSeasons = contentItem.seasons.filter((_, i) => i !== index);
    setContentItem({ ...contentItem, seasons: newSeasons });
  }
  
  // Dynamically determine titles and navigation paths
  const pageTitle = `Edit ${contentItem.type}`;
  const detailsTitle = `${contentItem.type} Details`;
  const cancelPath = `/admin/${contentItem.type.toLowerCase()}`;

  const handleSaveChanges = () => {
    console.log("Saving changes for:", contentItem);
    // In a real app, you'd send this data to your backend API
    alert("Changes saved to console!");
    navigate(cancelPath);
  }

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-white">{pageTitle}</h1>
            <p className="text-gray-400 mt-1">Editing: <span className="font-semibold text-cyan-400">{contentItem.title}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(cancelPath)} className="px-5 py-2.5 bg-gray-700 text-white font-semibold text-sm rounded-lg hover:bg-gray-600 transition-colors">
            Cancel
          </button>
          <button onClick={handleSaveChanges} className="px-5 py-2.5 bg-cyan-600 text-white font-semibold text-sm rounded-lg hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-cyan-500/50 transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Main Details Form */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-6">{detailsTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Title</label>
                <input type="text" value={contentItem.title} onChange={e => handleInputChange('title', e.target.value)} className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-300">Poster Path URL</label>
                <input type="text" value={contentItem.posterPath} onChange={e => handleInputChange('posterPath', e.target.value)} className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
            </div>
            <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-300">Overview</label>
                <textarea value={contentItem.overview} onChange={e => handleInputChange('overview', e.target.value)} rows={4} className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"></textarea>
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
                  value={contentItem.seoTitle || ''} 
                  onChange={e => handleInputChange('seoTitle', e.target.value)} 
                  className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" 
                  placeholder={`e.g. Watch ${contentItem.title} (${contentItem.releaseYear}) Online - MovieHubBD`}
                />
                <p className="mt-1 text-xs text-gray-400">Recommended: 50-60 characters. Current: {contentItem.seoTitle?.length || 0}</p>
            </div>
            <div>
                <label htmlFor="seoDescription" className="block mb-2 text-sm font-medium text-gray-300">Meta Description</label>
                <textarea 
                  id="seoDescription"
                  value={contentItem.seoDescription || ''} 
                  onChange={e => handleInputChange('seoDescription', e.target.value)} 
                  rows={3} 
                  className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                  placeholder={`e.g. Stream and download ${contentItem.title}, a captivating ${contentItem.type.toLowerCase()} about...`}
                ></textarea>
                <p className="mt-1 text-xs text-gray-400">Recommended: 150-160 characters. Current: {contentItem.seoDescription?.length || 0}</p>
            </div>
        </div>
      </div>

      {/* Seasons & Episodes Management */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Seasons & Episodes</h2>
            <button onClick={addSeason} className="flex items-center gap-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                <PlusCircleIcon className="w-5 h-5"/>
                Add New Season
            </button>
        </div>
        <div className="space-y-4">
            {contentItem.seasons?.map((season, index) => (
                <SeasonAccordion
                    key={season.seasonNumber}
                    season={season}
                    onSeasonChange={(updatedSeason) => handleSeasonChange(index, updatedSeason)}
                    onDelete={() => deleteSeason(index)}
                />
            ))}
            {(!contentItem.seasons || contentItem.seasons.length === 0) && (
              <div className="text-center py-6 text-gray-500">
                <p>No seasons found. Click 'Add New Season' to get started.</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SeriesEditPage;
