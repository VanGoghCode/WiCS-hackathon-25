export type ClothingStyle = 'casual' | 'formal';
export type ClothingCategory = 'top' | 'bottom' | 'accessory' | 'footwear';

export type ClothingItem = {
  id: string;
  type: string;
  color: string;
  name?: string;
  imageUrl: string;
  category: ClothingCategory | string;
  brand?: string;
  season?: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  favorite?: boolean;
  dateAdded?: string;
  userId: string;
  style: ClothingStyle | string;
  subcategory: string;
  imageName: string;
};

export type Outfit = {
  id: string;
  name?: string;
  top?: ClothingItem;
  bottom?: ClothingItem;
  accessory?: ClothingItem;
  footwear?: ClothingItem;
  favorite?: boolean;
  dateCreated?: string;
};

export type ButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
};

export type ClothingCardProps = {
  item: ClothingItem;
  onRemove?: () => void;
  onSelect?: () => void;
  className?: string;
  selected?: boolean;
};

export type UploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (item: Omit<ClothingItem, 'id'>) => void;
};

export type OutfitCardProps = {
  outfit: Outfit;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
};

export type ClothingSortOption = 'newest' | 'oldest' | 'alphabetical' | 'color';

export type ClothingFilterOptions = {
  category?: ClothingCategory | 'all';
  color?: string;
  favorite?: boolean;
  season?: string;
};

export type UserPreferences = {
  favoriteColors: string[];
  favoriteStyles: string[];
  seasonalPreferences: Record<string, boolean>;
  outfitHistory: string[];
};

export interface SelectInputProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder: string;
  disabled?: boolean;
  required?: boolean
}

export interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export const generateS3Url = (
  userId: string,
  style: string,
  category: string,
  subcategory: string,
  imageName: string
): string => {
  return `http://wics-cloth-recommender-images.s3.amazonaws.com/${userId}/${style}/${category}/${subcategory}/${imageName}`;
};

export type S3ImageParams = {
  style: string;
  category: string;
  subcategory: string;
  imageName: string;
};