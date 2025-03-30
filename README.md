# Wooden Wardrobe

A personal closet organizer and outfit generator web application built with React and TypeScript.

## Overview

Wooden Wardrobe helps users manage their clothing items and generate outfit recommendations. The application features a wooden-themed UI with amber color accents, providing a warm and inviting user experience.

## Features

- **Wardrobe Management**: Add, view, and organize clothing items by category
- **Outfit Generation**: Create outfit combinations based on your wardrobe
- **Smart Color Detection**: Automatically detects dominant colors from uploaded images
- **Weather-Based Suggestions**: Tag items with suitable weather conditions
- **Style Categories**: Organize items by style (casual, formal) and category (tops, bottoms, shoes, etc.)

## Tech Stack

- React 19
- TypeScript
- Tailwind CSS for styling
- Vite as the build tool
- UUID for unique identifier generation

## Component Structure

### Common Components
- `Button`: Customizable button with different variants
- `ClothingCard`: Card display for clothing items
- `ColorInput`: Color picker with presets and custom selection
- `LoadingSpinner`: Loading indicator
- `SelectInput`: Dropdown selector component
- `UploadModal`: Modal for adding new clothing items

### Page Components
- `Header`: Application header with navigation and action buttons
- `Footer`: Footer with links and contact information

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd wooden-wardrobe

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

## Application Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User browses   │────▶│  User uploads   │────▶│   Item added    │
│    wardrobe     │     │   new items     │     │   to wardrobe   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                               │
        ▼                                               ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User generates │◀────│  Application    │◀────│    Items are    │
│     outfit      │     │ processes items │     │  categorized    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Key Features Implementation

### Image Color Detection
The application can detect dominant colors from uploaded images to help categorize clothing items correctly.

### Clothing Categories
Items are organized into main categories and subcategories:
- Tops: shirts, t-shirts
- Bottoms: jeans, pants, shorts
- Shoes: formal, sneakers, sports
- Accessories: watches (analog, digital, smart)

### Weather & Style Tagging
Each item can be tagged with:
- Weather suitability: summer, fall, cold, rainy
- Style: casual, formal

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Build CSS
npm run build:css

# Watch CSS changes
npm run watch:css
```

## Notes

- The API endpoint for uploading images is configured to `https://54.90.107.6:5000/upload`
- The project uses a wooden theme with amber color palette for UI elements

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
