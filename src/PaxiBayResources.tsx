import { useState } from 'react';

// Pixabay Image interface
export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

//PixaBay key
const PIXABAY_API_KEY = import.meta.env.VITE_PIXABAY_API_KEY;

// Pixabay Image API
export const imageApi = {
  search: async (query: string): Promise<PixabayImage[]> => {
    const response = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20`
    );
    const data = await response.json();
    return data.hits;
  },
};

interface PaxiBayResourcesProps {
  onImageSelect: (imageUrl: string) => void;
}

export const PaxiBayResources = ({ onImageSelect }: PaxiBayResourcesProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<PixabayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const results = await imageApi.search(searchTerm);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search for images. Please try again.');
      console.error('Image search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleImageSearch();
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    onImageSelect(imageUrl);
  };

  return (
    <div className="pixabay-search-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for images (e.g., apple, banana, grocery)"
          className="pixabay-search-input"
        />
        
        <button
          type="button"
          onClick={handleImageSearch}
          disabled={loading}
          className="pixabay-search-button"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <div className="pixabay-error">{error}</div>}

      {searchResults.length > 0 && (
        <div className="pixabay-results-grid">
          {searchResults.map((image) => (
            <div
              key={image.id}
              className={`pixabay-image-card ${selectedImage === image.webformatURL ? 'selected' : ''}`}
              onClick={() => handleImageClick(image.webformatURL)}
            >
              <img
                src={image.previewURL}
                alt={image.tags}
                className="pixabay-image"
                loading="lazy"
              />
              {selectedImage === image.webformatURL && (
                <div className="selected-badge">✓</div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="selected-image-preview">
          <p className="selected-label">Selected image:</p>
          <img src={selectedImage} alt="Selected" className="selected-preview" />
        </div>
      )}
    </div>
  );
};