import React, { useState, useMemo } from 'react';
import { ContentItem } from '../../types';
import { PencilIcon, TrashIcon, SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '../../components/Icons';
import { Link } from 'react-router-dom';

interface ContentListPageProps {
  title: string;
  items: ContentItem[];
}

const ITEMS_PER_PAGE = 10;

const ContentListPage: React.FC<ContentListPageProps> = ({ title, items }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        if (statusFilter === 'All') return true;
        return item.adminStatus === statusFilter;
      })
      .filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [items, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  }

  const getEditPath = (item: ContentItem) => {
    const type = item.type.toLowerCase();
    if (type === 'series' || type === 'anime' || type === 'kdrama') {
        return `/admin/series/edit/${item.id}`;
    }
    if (type === 'movie') {
        return `/admin/movies/edit/${item.id}`;
    }
    return '#'; // Default fallback
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
      <div className="p-4 sm:p-6 border-b border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">{title} Management</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <select
                    value={statusFilter}
                    onChange={e => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1); // Reset to first page on filter change
                    }}
                    className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:w-auto p-2.5"
                >
                    <option value="All">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Pending">Pending</option>
                </select>
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder={`Search ${title}...`}
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        className="bg-gray-900 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:w-64 pl-10 p-2.5"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Poster</th>
              <th scope="col" className="px-6 py-3">Title</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Year</th>
              <th scope="col" className="px-6 py-3 hidden sm:table-cell">Rating</th>
              <th scope="col" className="px-6 py-3 hidden md:table-cell">Status</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(item => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/40">
                <td className="px-6 py-4">
                  <img src={item.posterPath} alt={item.title} className="w-10 h-14 object-cover rounded-md" />
                </td>
                <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                <td className="px-6 py-4 hidden md:table-cell">{item.releaseYear}</td>
                <td className="px-6 py-4 hidden sm:table-cell">{item.rating.toFixed(1)}</td>
                <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`px-2 py-1 text-xs font-semibold leading-tight rounded-full ${
                        item.adminStatus === 'Published' ? 'bg-green-900 text-green-300' :
                        item.adminStatus === 'Draft' ? 'bg-yellow-900 text-yellow-300' :
                        item.adminStatus === 'Pending' ? 'bg-gray-700 text-gray-300' : ''
                    }`}>
                        {item.adminStatus}
                    </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-3">
                    <Link to={getEditPath(item)} className="text-blue-400 hover:text-blue-300 transition-colors" aria-label={`Edit ${item.title}`}>
                      <PencilIcon className="w-5 h-5" />
                    </Link>
                    <button className="text-red-500 hover:text-red-400 transition-colors" aria-label={`Delete ${item.title}`}>
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
             {paginatedItems.length === 0 && (
                <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-500">
                        No items found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 sm:p-6 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between">
            <span className="text-sm text-gray-400 mb-4 sm:mb-0">
                Showing <span className="font-semibold text-white">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-semibold text-white">{Math.min(currentPage * ITEMS_PER_PAGE, filteredItems.length)}</span> of <span className="font-semibold text-white">{filteredItems.length}</span> results
            </span>
            <div className="inline-flex items-center -space-x-px">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 ml-0 leading-tight text-gray-400 bg-gray-900 border border-gray-600 rounded-l-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeftIcon className="w-4 h-4"/>
                </button>
                {/* Page numbers can be generated here for more complex pagination */}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 leading-tight text-gray-400 bg-gray-900 border border-gray-600 rounded-r-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRightIcon className="w-4 h-4"/>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default ContentListPage;