import { CloseIcon, PlusIcon } from '../../assets/SocialIcons/Icons';
import { ClothingCardProps } from '../../Types/types';
import { useState } from 'react';

const ClothingCard: React.FC<ClothingCardProps> = ({ 
  item, 
  onRemove, 
  className = '', 
  onSelect, 
  selected = false 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const imageSrc = imageError 
    ? 'https://via.placeholder.com/300x400?text=No+Image'
    : item.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image';

  return (
    <div className={`clothing-card relative ${selected ? 'ring-2 ring-amber-700' : ''} ${className}`}>
      <div className="wood-panel rounded-lg p-1 h-full">
        <div className="bg-amber-50 rounded-md p-4 h-full flex flex-col">
          <div className="card-handle"></div>
          <img 
            src={imageSrc}
            alt={`${item.name || `${item.color || ''} ${item.type || ''}`}`.trim()}
            className="w-full h-48 object-cover mb-4 rounded border-2 border-amber-200"
            onError={() => setImageError(true)}
          />
          
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute top-4 right-4 rounded-full bg-red-600 p-1 text-white hover:bg-red-700 shadow-md transition-colors"
              aria-label="Remove item"
            >
              <CloseIcon />
            </button>
          )}
          
          <div className="mt-2">
            <h3 className="font-bold text-amber-900 capitalize">
              {item.name || `${item.style || ''} ${item.type || ''}`}
            </h3>
            <div className="flex flex-wrap gap-1 mt-2">
              {item.style && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  {item.style}
                </span>
              )}
              {item.category && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  {item.category}
                </span>
              )}
              {item.subcategory && item.subcategory !== item.category && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  {item.subcategory}
                </span>
              )}
            </div>
          </div>
          
          {onSelect && (
            <button
              onClick={onSelect}
              className="absolute bottom-4 right-4 rounded-full bg-amber-600 p-1.5 text-white hover:bg-amber-700 shadow-md transition-colors"
              aria-label="Select item"
            >
              <PlusIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClothingCard;