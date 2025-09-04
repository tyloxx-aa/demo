import React, { useState, useMemo } from 'react';
import { MOCK_ADS } from '../../constants';
import { AdPlacement } from '../../types';
import { PencilIcon, TrashIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon } from '../../components/Icons';

const ITEMS_PER_PAGE = 10;

const AdManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [ads] = useState<AdPlacement[]>(MOCK_ADS);

  const filteredAds = useMemo(() => {
    return ads.filter(ad =>
      ad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ad.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ads, searchTerm]);

  const totalPages = Math.ceil(filteredAds.length / ITEMS_PER_PAGE);
  const paginatedAds = filteredAds.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  }

  // A simple function to truncate the code for display
  const truncateCode = (code: string, length = 50) => {
      if (code.length <= length) return code;
      return code.substring(0, length) + '...';
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h2 className="text-xl font-semibold text-white">Ad Management</h2>
                <p className="text-sm text-gray-400 mt-1">Create, edit, and manage your ad placements.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search ads..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:w-64 pl-10 p-2.5"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <button className="flex items-center gap-2 text-sm bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>New Placement</span>
                </button>
            </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Placement Name</th>
              <th scope="col" className="px-6 py-3">Type</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Code / URL</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAds.map(ad => (
              <tr key={ad.id} className="border-b border-gray-700 hover:bg-gray-700/40">
                <td className="px-6 py-4 font-medium text-white">{ad.name}</td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ad.type === 'Direct Link' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-300'
                    }`}>{ad.type}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell font-mono text-xs">
                    <code>{truncateCode(ad.code)}</code>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <button className="text-blue-400 hover:text-blue-300 transition-colors" aria-label={`Edit ${ad.name}`}>
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-400 transition-colors" aria-label={`Delete ${ad.name}`}>
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
             {paginatedAds.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-10 text-gray-500">
                        No ad placements found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 sm:p-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between">
            <span className="text-sm text-gray-400 mb-4 sm:mb-0">
                Showing <span className="font-semibold text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, paginatedAds.length)}</span> of <span className="font-semibold text-white">{filteredAds.length}</span> results
            </span>
            <div className="inline-flex items-center -space-x-px">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 ml-0 leading-tight text-gray-400 bg-gray-900 border border-gray-600 rounded-l-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeftIcon className="w-4 h-4"/>
                </button>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight text-gray-400 bg-gray-900 border border-gray-600 rounded-r-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRightIcon className="w-4 h-4"/>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdManagementPage;