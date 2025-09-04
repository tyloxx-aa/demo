import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ContentItem, ItemType, Episode, Server, DownloadGroup } from '../types';
import { MOCK_DATA } from '../constants';
import ContentSection from '../components/ContentSection';
import SeriesControls from '../components/EpisodeList';
import ItemDetails from '../components/ItemDetails';
import DownloadSection from '../components/DownloadSection';
import Breadcrumbs from '../components/Breadcrumbs';
import MovieControls from '../components/MovieControls';
import PreDetailsSection from '../components/PreDetailsSection';

const DetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<ContentItem | null>(null);
  const [relatedItems, setRelatedItems] = useState<ContentItem[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [playerUrl, setPlayerUrl] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const foundItem = MOCK_DATA.find(i => i.slug === slug) || null;
    setItem(foundItem);

    if (foundItem) {
      const isSeries = foundItem.type === ItemType.Series || foundItem.type === ItemType.Anime || foundItem.type === ItemType.Kdrama;

      if (isSeries) {
        const firstEpisode = foundItem.seasons?.[0]?.episodes?.[0];
        if (firstEpisode) {
          setCurrentEpisode(firstEpisode);
          setPlayerUrl(firstEpisode.servers?.[0]?.url || null);
        }
      } else { // It's a Movie
        setPlayerUrl(foundItem.servers?.[0]?.url || "https://www.youtube.com/embed/dQw4w9WgXcQ");
      }

      const related = MOCK_DATA.filter(
        relItem =>
          relItem.id !== foundItem.id &&
          relItem.genres.some(g => foundItem.genres.includes(g))
      ).slice(0, 12);
      setRelatedItems(related);
    }
  }, [slug]);

  useEffect(() => {
    const originalTitle = document.title;
    const metaDescriptionTag = document.querySelector("meta[name='description']");
    const originalDescription = metaDescriptionTag ? metaDescriptionTag.getAttribute('content') : '';

    if (item) {
        const defaultTitle = `${item.title} (${item.releaseYear}) - Watch Online on MovieHubBD`;
        const defaultDescription = item.overview ? item.overview.substring(0, 160) + '...' : `Watch ${item.title} online. Discover more movies and series on MovieHubBD.`;

        const metaTitle = item.seoTitle || defaultTitle;
        const metaDescription = item.seoDescription || defaultDescription;
        const metaImage = item.backdropPath;
        const metaUrl = window.location.href;

        document.title = metaTitle;

        const setMetaTag = (attr: 'name' | 'property', value: string, content: string) => {
            let element = document.querySelector<HTMLMetaElement>(`meta[${attr}='${value}']`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attr, value);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        setMetaTag('name', 'description', metaDescription);
        
        // Open Graph & Twitter Cards
        setMetaTag('property', 'og:title', metaTitle);
        setMetaTag('property', 'og:description', metaDescription);
        setMetaTag('property', 'og:image', metaImage);
        setMetaTag('property', 'og:url', metaUrl);
        setMetaTag('property', 'og:type', item.type === ItemType.Movie ? 'video.movie' : 'video.tv_show');
        setMetaTag('property', 'og:site_name', 'MovieHubBD');

        setMetaTag('name', 'twitter:card', 'summary_large_image');
        setMetaTag('name', 'twitter:title', metaTitle);
        setMetaTag('name', 'twitter:description', metaDescription);
        setMetaTag('name', 'twitter:image', metaImage);
    }

    // Cleanup function
    return () => {
        document.title = originalTitle;
        if (metaDescriptionTag && originalDescription) {
            metaDescriptionTag.setAttribute('content', originalDescription);
        }
    };
  }, [item]);
  
  if (!item) {
    return <div className="text-center py-20">Item not found.</div>;
  }
  
  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentEpisode(episode);
    setPlayerUrl(episode.servers?.[0]?.url || null);
  };

  const handleServerSelect = (server: Server) => {
    setPlayerUrl(server.url);
  };

  const isSeriesType = item.type === ItemType.Series || item.type === ItemType.Anime || item.type === ItemType.Kdrama;

  let downloadGroupsToShow: DownloadGroup[] | undefined = undefined;

  if (item.type === ItemType.Movie) {
    downloadGroupsToShow = item.downloadGroups;
  } else if (isSeriesType && currentEpisode && currentEpisode.downloadLinks.length > 0) {
    downloadGroupsToShow = [
      {
        title: `DOWNLOAD EPISODE ${currentEpisode.episodeNumber}: ${currentEpisode.title}`,
        icon: 'server',
        links: currentEpisode.downloadLinks,
      },
    ];
  }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-12">
            
            <Breadcrumbs crumbs={[
                { name: 'Home', path: '/' },
                { name: item.type },
                { name: item.title }
            ]}/>

            {/* Player Section */}
            <section>
                <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-700 relative">
                     {playerUrl ? (
                        <iframe
                            key={playerUrl} // Add key to force re-render on src change
                            src={playerUrl}
                            title="Video Player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-900">
                            <p>No video source available.</p>
                        </div>
                    )}
                    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ boxShadow: 'inset 0 0 15px 10px rgba(0,0,0,0.5)' }}></div>
                </div>
            </section>
            
            {/* Player Controls (Series or Movie) */}
            {isSeriesType && currentEpisode ? (
                <SeriesControls 
                    item={item}
                    activeEpisode={currentEpisode}
                    activeServerUrl={playerUrl || ''}
                    onSelectEpisode={handleEpisodeSelect}
                    onSelectServer={handleServerSelect}
                />
            ) : item.type === ItemType.Movie && ((item.servers && item.servers.length > 0) || (item.downloadLinks && item.downloadLinks.length > 0)) ? (
                <MovieControls 
                    item={item}
                    activeServerUrl={playerUrl || ''}
                    onSelectServer={handleServerSelect}
                />
            ) : null}

            <PreDetailsSection />

            <ItemDetails item={item} />
            
            {/* Download Section */}
            {downloadGroupsToShow && downloadGroupsToShow.length > 0 && (
                <DownloadSection groups={downloadGroupsToShow} />
            )}

            {/* Related Content */}
            {relatedItems.length > 0 && <ContentSection title="Related" items={relatedItems} />}
        </div>
    </div>
  );
};

export default DetailPage;