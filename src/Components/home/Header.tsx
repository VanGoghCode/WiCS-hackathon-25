import React from 'react';
import {PlusIcon, ShirtIcon, DrawerIcon} from '../../assets/SocialIcons/Icons'
import Button from '../common/Button';

interface HeaderProps {
  onGenerateOutfit: () => void;
  onAddItem: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGenerateOutfit, onAddItem }) => {
  return (
    <header className="wood-panel p-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="bg-amber-100 p-0.5 rounded-full mr-3">
              <DrawerIcon />
            </div>
            <h1 className="text-2xl font-bold text-amber-100">Wooden Wardrobe</h1>
          </div>
          
          <div className="flex items-center sm:items-center gap-2 w-full sm:w-auto">
            {/* <div className="relative flex-grow sm:flex-grow-0 sm:w-64 mr-2">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full p-2 pr-8 border-2 border-amber-300 rounded-md bg-amber-50 text-amber-900"
              />
              <span className="absolute right-2 top-2.5 text-amber-700">
                <SearchIcon />
              </span>
            </div> */}
            
            <div className="flex gap-2">
              <Button onClick={onAddItem} variant="secondary">
                <PlusIcon /> Add
              </Button>
              <Button onClick={onGenerateOutfit}>
                <ShirtIcon /> Outfit
              </Button>
              {/* <button className="p-2.5 bg-amber-700 rounded-full text-white hover:bg-amber-800 transition-colors">
                <UserIcon />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;