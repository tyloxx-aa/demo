import React, { useState } from 'react';
import { ContentItem } from '../../types';
import { SpinnerIcon } from '../../components/Icons';
import { generateContentFromTitle } from '../../gemini';

const TmdbImporterPage: React.FC = () => {
    const [titleQuery, setTitleQuery] = useState('');
    const [contentType, setContentType] = useState<'movie' | 'tv'>('movie');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [importedItem, setImportedItem] = useState<ContentItem | null>(null);

    const handleImport = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titleQuery) {
            setError('Please provide a title to generate content.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setImportedItem(null);

        try {
            const newItem = await generateContentFromTitle(titleQuery, contentType);
            setImportedItem(newItem);
            console.log("Successfully Generated Data (Ready to Save):", newItem);

        } catch (err: any) {
            let message = 'An unknown error occurred while generating content.';
            if (err.message) {
                message = err.message;
            }
            if (err.toString().includes('400') || err.toString().includes('API key')) {
                message = "Failed to call the AI model. Please ensure the API key is configured correctly.";
            }
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setTitleQuery('');
        setImportedItem(null);
        setError(null);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
                <div className="p-4 sm:p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">AI Content Importer</h2>
                    <p className="mt-1 text-sm text-gray-400">Generate movie and series data using AI from just a title.</p>
                </div>

                <form onSubmit={handleImport}>
                    <div className="p-4 sm:p-6 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div className="sm:col-span-2">
                                <label htmlFor="titleQuery" className="block mb-2 text-sm font-medium text-gray-300">Title to Generate</label>
                                <input type="text" id="titleQuery" value={titleQuery} onChange={e => setTitleQuery(e.target.value)} placeholder="e.g., The Last Cyberpunk" className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5" />
                            </div>
                            <div>
                                <label htmlFor="contentType" className="block mb-2 text-sm font-medium text-gray-300">Content Type</label>
                                <select id="contentType" value={contentType} onChange={e => setContentType(e.target.value as 'movie' | 'tv')} className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5">
                                    <option value="movie">Movie</option>
                                    <option value="tv">TV Series</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end">
                        <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-cyan-600 text-white font-semibold text-sm rounded-lg hover:bg-cyan-500 focus:ring-4 focus:outline-none focus:ring-cyan-500/50 transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center gap-2">
                            {isLoading ? <><SpinnerIcon className="w-5 h-5 animate-spin" /> Generating...</> : 'Generate'}
                        </button>
                    </div>
                </form>
            </div>

            {error && (
                <div className="p-4 text-sm text-red-300 bg-red-900/50 rounded-lg border border-red-500/30" role="alert">
                    <span className="font-bold">Error:</span> {error}
                </div>
            )}

            {importedItem && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg animate-fade-in">
                    <div className="p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-semibold text-green-400">Generation Successful!</h3>
                            <p className="text-sm text-gray-400">Content has been generated. Review and save.</p>
                        </div>
                        <button onClick={handleClear} className="text-sm text-gray-400 hover:text-white">Clear</button>
                    </div>
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6">
                        <img src={importedItem.posterPath} alt={importedItem.title} className="w-32 h-48 object-cover rounded-lg shadow-md flex-shrink-0 bg-gray-700" />
                        <div>
                            <h4 className="text-2xl font-bold text-white">{importedItem.title} ({importedItem.releaseYear})</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400 my-2">
                                <span>{importedItem.type}</span>
                                <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                                <span>{importedItem.genres.join(', ')}</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed max-h-24 overflow-y-auto">{importedItem.overview}</p>
                            {importedItem.seasons && <p className="text-sm mt-3 text-cyan-400 font-semibold">{importedItem.seasons.length} seasons generated.</p>}
                        </div>
                    </div>
                    <div className="p-4 sm:p-6 bg-gray-800/50 border-t border-gray-700 flex justify-end">
                        <button className="px-6 py-2.5 bg-green-600 text-white font-semibold text-sm rounded-lg hover:bg-green-500 transition-colors">
                            Save to Database
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TmdbImporterPage;