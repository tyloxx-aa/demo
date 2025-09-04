import React from 'react';
import { MOCK_DATA } from '../../constants';
import { ItemType } from '../../types';
import StatCard from '../../components/admin/StatCard';
import { FilmIcon, TvIcon, UsersIcon, SunIcon, HeartIcon } from '../../components/Icons';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const totalMovies = MOCK_DATA.filter(item => item.type === ItemType.Movie).length;
  const totalSeries = MOCK_DATA.filter(item => item.type === ItemType.Series).length;
  const totalAnime = MOCK_DATA.filter(item => item.type === ItemType.Anime).length;
  const totalKdrama = MOCK_DATA.filter(item => item.type === ItemType.Kdrama).length;
  const totalUsers = '1,254'; // Mock data

  const recentItems = MOCK_DATA.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard 
          title="Total Movies" 
          value={totalMovies} 
          icon={<FilmIcon className="w-7 h-7 text-cyan-400"/>}
          colorClass="from-cyan-500 to-blue-500"
        />
        <StatCard 
          title="Total Series" 
          value={totalSeries} 
          icon={<TvIcon className="w-7 h-7 text-purple-400"/>}
          colorClass="from-purple-500 to-indigo-500"
        />
        <StatCard 
          title="Anime Count" 
          value={totalAnime} 
          icon={<SunIcon className="w-7 h-7 text-amber-400"/>}
          colorClass="from-amber-500 to-orange-500"
        />
        <StatCard 
          title="K-Drama Count" 
          value={totalKdrama} 
          icon={<HeartIcon className="w-7 h-7 text-pink-400"/>}
          colorClass="from-pink-500 to-rose-500"
        />
        <StatCard 
          title="Total Users" 
          value={totalUsers} 
          icon={<UsersIcon className="w-7 h-7 text-emerald-400"/>}
          colorClass="from-emerald-500 to-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Title</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Year</th>
                  <th scope="col" className="px-6 py-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map(item => (
                  <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/40">
                    <td className="px-6 py-4 font-medium text-white flex items-center">
                        <img src={item.posterPath} alt={item.title} className="w-8 h-12 object-cover rounded-sm mr-4"/>
                        <Link to={`/item/${item.slug}`} className="hover:underline">{item.title}</Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-cyan-900 text-cyan-300">{item.type}</span>
                    </td>
                    <td className="px-6 py-4">{item.releaseYear}</td>
                    <td className="px-6 py-4">{item.rating.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Breakdown */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Content Breakdown</h2>
          <div className="space-y-4">
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-cyan-400">Movies</span>
                    <span className="text-sm font-medium text-cyan-400">{totalMovies}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-cyan-500 h-2.5 rounded-full" style={{width: `${(totalMovies / MOCK_DATA.length) * 100}%`}}></div>
                </div>
            </div>
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-purple-400">Series</span>
                    <span className="text-sm font-medium text-purple-400">{totalSeries}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{width: `${(totalSeries / MOCK_DATA.length) * 100}%`}}></div>
                </div>
            </div>
             <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-amber-400">Anime</span>
                    <span className="text-sm font-medium text-amber-400">{totalAnime}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{width: `${(totalAnime / MOCK_DATA.length) * 100}%`}}></div>
                </div>
            </div>
             <div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-pink-400">K-Drama</span>
                    <span className="text-sm font-medium text-pink-400">{totalKdrama}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-pink-500 h-2.5 rounded-full" style={{width: `${(totalKdrama / MOCK_DATA.length) * 100}%`}}></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;