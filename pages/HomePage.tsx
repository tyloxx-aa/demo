import React from 'react';
import HeroSlider from '../components/HeroSlider';
import ContentSection from '../components/ContentSection';
import PopularPlatforms from '../components/PopularPlatforms';
import { MOCK_DATA } from '../constants';
import { ItemType } from '../types';

const HomePage: React.FC = () => {
  // Base filtered lists
  const trendingItemsRaw = MOCK_DATA.slice().sort((a, b) => b.rating - a.rating);
  const bengaliMoviesRaw = MOCK_DATA.filter(item => item.language?.includes('Bangla'));
  const hindiMoviesRaw = MOCK_DATA.filter(item => item.language?.includes('Hindi'));
  const seriesRaw = MOCK_DATA.filter(item => item.type === ItemType.Series);
  const animeRaw = MOCK_DATA.filter(item => item.type === ItemType.Anime);
  const kdramaRaw = MOCK_DATA.filter(item => item.type === ItemType.Kdrama);
  const heroItems = trendingItemsRaw.slice(0, 5);
  
  // Create larger datasets for pagination demonstration
  const trendingItems = [
    ...trendingItemsRaw, 
    ...trendingItemsRaw.map(i => ({...i, id: `${i.id}-d1`, slug: `${i.slug}-d1`}))
  ]; // 22 items
  
  const hindiMovies = [
    ...hindiMoviesRaw, 
    ...hindiMoviesRaw.map(i => ({...i, id: `${i.id}-d1`, slug: `${i.slug}-d1`})), 
    ...hindiMoviesRaw.map(i => ({...i, id: `${i.id}-d2`, slug: `${i.slug}-d2`})), 
    ...hindiMoviesRaw.map(i => ({...i, id: `${i.id}-d3`, slug: `${i.slug}-d3`}))
  ]; // 16 items, will show 2 pages
  
  const series = [
    ...seriesRaw,
    ...seriesRaw.map(i => ({...i, id: `${i.id}-d1`, slug: `${i.slug}-d1`})),
    ...seriesRaw.map(i => ({...i, id: `${i.id}-d2`, slug: `${i.slug}-d2`})),
  ]; // 9 items, will show 2 pages
  

  return (
    <>
      <HeroSlider items={heroItems} />
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          
          <PopularPlatforms />

          <ContentSection title="Trending" items={trendingItems} isTrending={true} />
          <ContentSection title="Bengali Movies" items={bengaliMoviesRaw} />
          <ContentSection title="Hindi Movies" items={hindiMovies} />
          <ContentSection title="Series" items={series} />
          <ContentSection title="Anime" items={animeRaw} />
          <ContentSection title="Kdrama" items={kdramaRaw} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
