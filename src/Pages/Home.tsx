import React, { useState, useEffect } from 'react';
import { 
  ClothingItem, 
  Outfit,
} from '../Types/types';
import Header from '../Components/home/Header';
import Button from '../Components/common/Button';
import ClothingCard from '../Components/common/ClothingCard';
import UploadModal from '../Components/common/UploadModal';
import Footer from '../Components/home/Footer';
import { HeartIcon, PaletteIcon, PlusIcon, ShirtIcon, ShuffleIcon, ThumbsDownIcon, ThumbsUpIcon } from '../assets/SocialIcons/Icons';
import LoadingSpinner from '../Components/common/LoadingSpinner';

const USER_ID = '123';
const WEATHER_OPTIONS = ['cloudy', 'sunny', 'rainy', 'cold'];

const Home: React.FC = () => {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [allClothes, setAllClothes] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingOutfit, setLoadingOutfit] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outfitError, setOutfitError] = useState<string | null>(null);
  const [currentOutfit, setCurrentOutfit] = useState<Outfit | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'recommendation'>('wardrobe');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        setLoading(true);
        const apiUrl = `https://54.90.107.6:5000/images?userId=${USER_ID}`;
        
        const response = await fetch(apiUrl);
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const textResponse = await response.text();
          console.error('Received non-JSON response:', textResponse.substring(0, 100) + '...');
          throw new Error(`Expected JSON response but got ${contentType || 'unknown'} content type`);
        }
        
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.images || !Array.isArray(data.images)) {
          console.error('API response is not in the expected format:', data);
          throw new Error('API response is not in the expected format (missing images array)');
        }
        
        const clothingItems: ClothingItem[] = data.images.map((item: { imageUrl: string; type: string; style: string }, index: number) => ({
          id: `item-${index}-${Date.now()}`,
          imageUrl: item.imageUrl,
          category: item.type.toLowerCase(),
          style: item.style,
          dateAdded: new Date().toISOString(),
          name: `${item.style} ${item.type}`,
          color: 'unknown',
          type: 'clothing',
          userId: USER_ID,
          subcategory: item.type.toLowerCase(),
          imageName: `${item.type.toLowerCase()}-${index}.jpg`
        }));
        
        setAllClothes(clothingItems);
        setClothes(clothingItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching clothing items:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        
        if (process.env.NODE_ENV === 'development') {
          const mockItems = getMockClothingItems();
          setAllClothes(mockItems);
          setClothes(mockItems);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClothingItems();
  }, []);

  useEffect(() => {
    const filteredItems = categoryFilter === 'all' 
      ? allClothes 
      : allClothes.filter(item => item.category === categoryFilter);
    
    setClothes(filteredItems);
  }, [categoryFilter, allClothes]);

  const getMockClothingItems = (): ClothingItem[] => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: `mock-${i}`,
      name: `Item ${i}`,
      category: i % 4 === 0 ? 'top' : i % 4 === 1 ? 'bottom' : i % 4 === 2 ? 'accessory' : 'footwear',
      type: 'clothing',
      userId: USER_ID,
      subcategory: i % 4 === 0 ? 'shirt' : i % 4 === 1 ? 'pants' : i % 4 === 2 ? 'watch' : 'shoes',
      color: i % 3 === 0 ? 'blue' : i % 3 === 1 ? 'red' : 'black',
      style: i % 2 === 0 ? 'casual' : 'formal',
      imageUrl: `https://via.placeholder.com/150?text=Item${i}`,
      imageName: `item-${i}.jpg`,
      dateAdded: new Date().toISOString()
    }));
  };

  const handleAddItem = (newItem: Omit<ClothingItem, 'id'>) => {
    const item: ClothingItem = {
      ...newItem,
      id: `item-${Date.now()}`,
      dateAdded: new Date().toISOString()
    };
    setAllClothes(prevItems => [...prevItems, item]);
    
    if (categoryFilter === 'all' || categoryFilter === item.category) {
      setClothes(prevItems => [...prevItems, item]);
    }
  };

  const handleRemoveItem = (id: string) => {
    setAllClothes(prevItems => prevItems.filter(item => item.id !== id));
    setClothes(prevItems => prevItems.filter(item => item.id !== id));
  };

  const generateOutfit = async () => {
    try {
      setActiveTab('recommendation')
      setLoadingOutfit(true);
      setOutfitError(null);
      
      const randomWeather = WEATHER_OPTIONS[Math.floor(Math.random() * WEATHER_OPTIONS.length)];
      const apiUrl = `https://54.90.107.6:5000/recommend?weather=${randomWeather}&userId=${USER_ID}`;
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const outfitItems: Partial<Outfit> = {
        id: `outfit-${Date.now()}`,
        dateCreated: new Date().toISOString()
      };
      
      if (data.top) outfitItems.top = createClothingItemFromUrl(data.top, 'top');
      if (data.bottom) outfitItems.bottom = createClothingItemFromUrl(data.bottom, 'bottom');
      if (data.shoes) outfitItems.footwear = createClothingItemFromUrl(data.shoes, 'footwear');
      if (data.watch) outfitItems.accessory = createClothingItemFromUrl(data.watch, 'accessory');
      
      setCurrentOutfit(outfitItems as Outfit);
      setActiveTab('recommendation');
    } catch (err) {
      console.error('Error generating outfit:', err);
      setOutfitError(err instanceof Error ? err.message : 'An unknown error occurred');
      fallbackRandomOutfit();
    } finally {
      setLoadingOutfit(false);
    }
  };

  const createClothingItemFromUrl = (url: string, category: string): ClothingItem => {
    const urlParts = url.split('/');
    const style = urlParts.length > 4 ? urlParts[4] : 'casual';
    const subcategory = urlParts.length > 6 ? urlParts[6] : category;
    
    return {
      id: `api-${category}-${Date.now()}`,
      imageUrl: url,
      category: category,
      style: style,
      dateAdded: new Date().toISOString(),
      name: `${style} ${subcategory}`,
      color: 'unknown',
      type: 'clothing',
      userId: USER_ID,
      subcategory: subcategory,
      imageName: `${category}-api.jpg`
    };
  };

  const fallbackRandomOutfit = () => {
    const tops = allClothes.filter(item => item.category === 'top');
    const bottoms = allClothes.filter(item => item.category === 'bottom');
    const accessories = allClothes.filter(item => item.category === 'accessory');
    const footwear = allClothes.filter(item => item.category === 'footwear');

    if (tops.length === 0 || bottoms.length === 0) {
      alert("You need at least one top and one bottom to generate an outfit!");
      return;
    }

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const randomAccessory = accessories.length > 0 ? 
      accessories[Math.floor(Math.random() * accessories.length)] : undefined;
    const randomFootwear = footwear.length > 0 ? 
      footwear[Math.floor(Math.random() * footwear.length)] : undefined;

    setCurrentOutfit({
      id: `outfit-${Date.now()}`,
      top: randomTop,
      bottom: randomBottom,
      accessory: randomAccessory,
      footwear: randomFootwear,
      dateCreated: new Date().toISOString()
    });
    
    setOutfitError('Using locally generated outfit due to API error');
  };

  const filteredItemsCount = categoryFilter === 'all' 
    ? allClothes.length 
    : allClothes.filter(item => item.category === categoryFilter).length;

  return (
    <div className="min-h-screen flex flex-col">
      <Header onGenerateOutfit={generateOutfit} onAddItem={() => setIsUploadModalOpen(true)}  />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="wood-panel rounded-lg p-1 mb-8">
            <div className="flex bg-amber-50 rounded-md">
              <button
                className={`tab-button flex-1 rounded-tl-md ${
                  activeTab === 'wardrobe'
                    ? 'bg-amber-100 border-b-2 border-amber-700 text-amber-900 font-bold'
                    : 'text-amber-700 hover:bg-amber-100'
                }`}
                onClick={() => setActiveTab('wardrobe')}
              >
                <div className="flex items-center justify-center gap-2">
                  <ShirtIcon />
                  <span>My Wardrobe</span>
                </div>
              </button>
              <button
                className={`tab-button flex-1 rounded-tr-md ${
                  activeTab === 'recommendation'
                    ? 'bg-amber-100 border-b-2 border-amber-700 text-amber-900 font-bold'
                    : 'text-amber-700 hover:bg-amber-100'
                }`}
                onClick={() => setActiveTab('recommendation')}
              >
                <div className="flex items-center justify-center gap-2">
                  <PaletteIcon />
                  <span>Outfit Recommendation</span>
                </div>
              </button>
            </div>
          </div>

          {activeTab === 'wardrobe' && (
            <div className="bg-amber-50 wood-border rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-amber-900">
                  My Clothing Items ({filteredItemsCount})
                </h2>
                <div className="flex gap-2">
                  <select 
                    className="p-2 border-2 border-amber-300 rounded-md text-sm bg-amber-50 text-amber-900"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="top">Tops</option>
                    <option value="bottom">Bottoms</option>
                    <option value="watch">Watches</option>
                    <option value="shoes">Shoes</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-4 border border-red-300 rounded">
                  <p className="font-bold mb-2">Error loading your wardrobe:</p>
                  <p>{error}</p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="mt-2 text-sm">Check the console for more details.</p>
                  )}
                </div>
              ) : clothes.length === 0 ? (
                <div className="empty-state">
                  <div className="card-handle"></div>
                  <p className="text-amber-800 mb-4">
                    {allClothes.length === 0 
                      ? "Your wardrobe is empty. Add your first item!" 
                      : "No items match the selected category."}
                  </p>
                  <Button onClick={() => setIsUploadModalOpen(true)}>
                    <PlusIcon /> Add {allClothes.length === 0 ? "Your First Item" : "New Item"}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-5">
                  {clothes.map((item) => (
                    <div 
                      key={item.id} 
                      className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-13.33px)] lg:w-[calc(25%-15px)]"
                    >
                      <ClothingCard
                        item={item}
                        onRemove={() => handleRemoveItem(item.id)}
                      />
                    </div>
                  ))}
                  <div
                    className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.33%-13.33px)] lg:w-[calc(25%-15px)] border-2 border-dashed border-amber-300 rounded-lg flex flex-col items-center justify-center p-6 h-66 cursor-pointer hover:bg-amber-100 transition-colors"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <div className="text-amber-700 mb-2">
                      <PlusIcon />
                    </div>
                    <p className="text-sm text-amber-700">Add New Item</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'recommendation' && (
            <div className="bg-amber-50 wood-border rounded-lg p-6">
              {loadingOutfit ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <LoadingSpinner />
                  <p className="mt-4 text-amber-800">Generating your outfit recommendation...</p>
                </div>
              ) : currentOutfit ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-amber-900">Today's Recommended Outfit</h2>
                    <div className="flex gap-2">
                      <Button onClick={generateOutfit} variant="secondary" disabled={loadingOutfit}>
                        <ShuffleIcon /> Try Another
                      </Button>
                      <Button onClick={() => {}} disabled={loadingOutfit}>
                        <HeartIcon /> Save Outfit
                      </Button>
                    </div>
                  </div>

                  {outfitError && (
                    <div className="bg-amber-100 border border-amber-300 p-3 rounded-lg mb-4 text-amber-800 text-sm">
                      <p>{outfitError}</p>
                    </div>
                  )}

                  <div className="wood-panel rounded-lg p-6 mb-6">
                    <div className="card-handle"></div>
                    <div className="bg-amber-50 p-6 rounded-md">
                      <div className="flex flex-wrap gap-4 justify-center">
                        {currentOutfit.top && (
                          <div className="min-w-[200px] flex-1">
                            <ClothingCard item={currentOutfit.top} />
                          </div>
                        )}
                        {currentOutfit.bottom && (
                          <div className="min-w-[200px] flex-1">
                            <ClothingCard item={currentOutfit.bottom} />
                          </div>
                        )}
                        {currentOutfit.accessory && (
                          <div className="min-w-[200px] flex-1">
                            <ClothingCard item={currentOutfit.accessory} />
                          </div>
                        )}
                        {currentOutfit.footwear && (
                          <div className="min-w-[200px] flex-1">
                            <ClothingCard item={currentOutfit.footwear} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-4 mb-6">
                    <Button onClick={() => {}} variant="secondary" className="px-6" disabled={loadingOutfit}>
                      <ThumbsDownIcon /> Not for me
                    </Button>
                    <Button onClick={() => {}} className="px-6" disabled={loadingOutfit}>
                      <ThumbsUpIcon /> I like it!
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="card-handle"></div>
                  <p className="text-amber-800 mb-4">No outfit generated yet.</p>
                  <Button onClick={generateOutfit} disabled={loadingOutfit}>
                    <ShuffleIcon /> Generate Outfit
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleAddItem}
      />
    </div>
  );
};

export default Home;