# Pricefy - Smart Price Comparison Platform

## 🚀 Project Overview

Pricefy is a comprehensive price comparison platform that allows users to search, compare, and track product prices across multiple Turkish e-commerce stores including Trendyol, Hepsiburada, N11, and Amazon Turkey. The platform features a modern, responsive design with advanced user management, favorites system, price alerts, and detailed product analytics.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Backend Implementation](#backend-implementation)
- [Core Components](#core-components)
- [API Integration](#api-integration)
- [User Management](#user-management)
- [Database Schema](#database-schema)
- [UI/UX Design](#uiux-design)
- [Use Case Scenarios](#use-case-scenarios)
- [Component Documentation](#component-documentation)
- [State Management](#state-management)
- [Styling System](#styling-system)
- [Testing Guidelines](#testing-guidelines)
- [Deployment](#deployment)
- [GitHub Actions CI/CD](#github-actions-cicd)
- [Contributing](#contributing)

## ✨ Features

### Core Functionality
- **Multi-Store Search**: Search across Trendyol, Hepsiburada, N11, and Amazon Turkey
- **Real-time Price Comparison**: Compare prices from multiple stores simultaneously
- **Advanced Filtering**: Filter by price range, category, store, and rating
- **Sorting Options**: Sort by name, price, rating, or store (ascending/descending)
- **View Modes**: Switch between grid and list view for product display

### User Management
- **Authentication System**: Login/Register with email and password
- **Social Login**: Google and Facebook authentication integration
- **Profile Management**: Edit profile, change avatar, email, and password
- **Email Preferences**: Customizable notification settings

### Favorites & Alerts
- **Favorites System**: Save products to favorites with full product data
- **Price Alerts**: Set price drop notifications with customizable thresholds
- **Alert Management**: View, edit, and remove price alerts from profile
- **Persistent Storage**: Favorites and alerts persist across sessions

### Product Features
- **Detailed Product Pages**: Comprehensive product information and images
- **Price History**: Interactive charts showing price trends over time
- **Product Comparison**: Compare similar products side-by-side
- **Store Integration**: Direct links to purchase on original store websites
- **Rating & Reviews**: Display product ratings and review counts

### Advanced Features
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Consistent dark theme with electric glass-morphism effects
- **Search Suggestions**: Intelligent search suggestions based on product catalog
- **Category Navigation**: Browse products by categories
- **Universal Search**: Search functionality available on all pages

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks (useState, useEffect, useContext)

### Backend Integration
- **API Layer**: Mock APIs for Turkish e-commerce stores
- **Data Fetching**: Native fetch API with async/await
- **Error Handling**: Comprehensive error boundaries and user feedback

### Development Tools
- **Build Tool**: Next.js built-in bundler
- **Type Checking**: TypeScript strict mode
- **Linting**: ESLint with Next.js configuration
- **Code Formatting**: Prettier (implied through consistent code style)

## 📁 Project Structure

```
pricefy14/
├── app/
│   ├── components/
│   │   ├── auth-modal.tsx              # Authentication modal
│   │   ├── favorites-page.tsx          # Favorites management page
│   │   ├── product-page.tsx            # Individual product details
│   │   ├── profile-page.tsx            # User profile management
│   │   ├── search-results-page.tsx     # Search results display
│   │   ├── search-results-amazon.tsx   # Amazon-specific search results
│   │   ├── price-history-chart.tsx     # Price trend visualization
│   │   ├── product-comparison-modal.tsx # Product comparison interface
│   │   ├── profile-dropdown.tsx        # User profile dropdown menu
│   │   ├── universal-search-bar.tsx    # Global search component
│   │   ├── search-suggestions.tsx      # Search autocomplete
│   │   ├── about-section.tsx           # About page content
│   │   └── pricefy-logo.tsx           # Logo component
│   ├── globals.css                     # Global styles and Tailwind imports
│   ├── layout.tsx                      # Root layout component
│   ├── loading.tsx                     # Loading page component
│   └── page.tsx                        # Home page component
├── components/
│   └── ui/                            # shadcn/ui components
│       ├── accordion.tsx
│       ├── alert.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── slider.tsx
│       ├── switch.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       └── [other shadcn components]
├── hooks/
│   ├── use-mobile.tsx                 # Mobile detection hook
│   └── use-toast.ts                   # Toast notification hook
├── lib/
│   ├── utils.ts                       # Utility functions (cn, etc.)
│   ├── product-service.ts             # Product data service layer
│   ├── amazon-api.ts                  # Amazon API mock implementation
│   ├── turkish-stores-api.ts          # Turkish stores API integration
│   └── test-turkish-stores.ts         # API testing utilities
├── public/
│   ├── pricefy-logo.png              # Application logo
│   ├── space-tech-background.jpg      # Background image
│   └── [other static assets]
├── styles/
│   └── globals.css                    # Additional global styles
├── next.config.mjs                    # Next.js configuration
├── tailwind.config.ts                 # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript configuration
└── package.json                       # Dependencies and scripts
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Modern web browser with JavaScript enabled

### Installation Steps

1. **Clone the Repository**
```bash
git clone <repository-url>
cd pricefy14
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Setup**
```bash
# Create .env.local file (optional for mock data)
touch .env.local
```

4. **Development Server**
```bash
npm run dev
# or
yarn dev
```

5. **Build for Production**
```bash
npm run build
npm start
# or
yarn build
yarn start
```

### Configuration Files

**next.config.mjs**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

**tailwind.config.ts**
```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for dark theme
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // ... additional color definitions
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 🧩 Core Components

### 1. Authentication System (`auth-modal.tsx`)

**Purpose**: Handles user login and registration with social authentication options.

**Key Features**:
- Email/password authentication
- Google and Facebook social login
- Form validation and error handling
- Password visibility toggle
- Responsive modal design

**Props Interface**:
```typescript
interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess?: (userData: { name: string; email: string }) => void
}
```

**Usage Example**:
```typescript
<AuthModal 
  isOpen={showAuthModal} 
  onClose={() => setShowAuthModal(false)} 
  onLoginSuccess={handleLoginSuccess} 
/>
```

### 2. Product Search (`search-results-page.tsx`)

**Purpose**: Displays search results from multiple Turkish e-commerce stores with filtering and sorting capabilities.

**Key Features**:
- Multi-store product aggregation
- Real-time filtering by price, category, and store
- Grid/list view toggle
- Sorting by multiple criteria
- Infinite scroll or pagination
- Store-specific badges and pricing

**Props Interface**:
```typescript
interface SearchResultsPageProps {
  query: string
  user: { name: string; email: string } | null
  userFavorites: string[]
  onProductSelect: (product: Product) => void
  onBackToHome: () => void
  onFavoriteToggle: (productId: string, productData?: any) => void
  // ... additional props
}
```

### 3. Product Details (`product-page.tsx`)

**Purpose**: Comprehensive product information page with price history and comparison features.

**Key Features**:
- High-resolution product images
- Price history charts with time period selection
- Similar product recommendations
- Price alert management
- Direct store purchase links
- Social sharing capabilities

**State Management**:
```typescript
const [currentProduct, setCurrentProduct] = useState<Product>(product)
const [priceHistory, setPriceHistory] = useState<{ date: string; price: number }[]>([])
const [selectedPeriod, setSelectedPeriod] = useState<"1w" | "1m">("1m")
const [similarProducts, setSimilarProducts] = useState<Product[]>([])
```

### 4. Favorites Management (`favorites-page.tsx`)

**Purpose**: User's saved products with advanced management features.

**Key Features**:
- Grid and list view modes
- Advanced sorting (name, price, rating, store)
- Price alert integration
- Bulk actions for favorites
- Category filtering
- Search within favorites

**View Modes**:
```typescript
type ViewMode = "grid" | "list"
type SortBy = "name" | "price" | "rating" | "store"
type SortOrder = "asc" | "desc"
```

### 5. User Profile (`profile-page.tsx`)

**Purpose**: Comprehensive user account management with preferences and data overview.

**Key Features**:
- Profile editing (name, bio, avatar)
- Email and password management
- Email notification preferences
- Favorites and price alerts overview
- Account statistics and savings tracking

**Modal Management**:
```typescript
const [editProfileOpen, setEditProfileOpen] = useState(false)
const [changeAvatarOpen, setChangeAvatarOpen] = useState(false)
const [changeEmailOpen, setChangeEmailOpen] = useState(false)
const [changePasswordOpen, setChangePasswordOpen] = useState(false)
```

## 🖥️ Backend Implementation

The Pricefy backend is built with Express.js and MongoDB, providing a robust API for the frontend.

### Backend Technology Stack
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Simple token-based authentication
- **API Style**: RESTful API

### Backend Structure
```
server/
├── config/
│   └── db.js                 # MongoDB connection setup
├── middleware/
│   └── auth.js               # Authentication middleware
├── models/
│   ├── User.js               # User model
│   ├── Product.js            # Product model
│   ├── PriceHistory.js       # Price history model
│   ├── Favorite.js           # User favorites model
│   └── PriceAlert.js         # Price alerts model
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── products.js           # Product management routes
│   ├── users.js              # User management routes
│   ├── favorites.js          # Favorites management routes
│   ├── priceAlerts.js        # Price alerts routes
│   └── priceHistory.js       # Price history routes
├── scripts/
│   └── seed.js               # Database seeding script
├── utils/
│   └── database.js           # Database utility functions
├── API.md                    # API documentation
└── index.js                  # Server entry point
```

### Key Features
- **Authentication**: Register, login, and profile management
- **Products API**: CRUD operations, search, filtering, and pagination
- **Price History**: Track price changes over time with analytics
- **Favorites**: Save and manage favorite products
- **Price Alerts**: Set and receive price drop alerts

### API Documentation
Detailed API documentation is available in [server/API.md](./server/API.md).

### Backend Scripts
- `npm run server:dev` - Start the server with auto-reload using nodemon
- `npm run server` - Start the server in production mode
- `npm run seed` - Seed the database with sample data
- `npm run dev:all` - Run both frontend and backend concurrently

### Database Models
- **User**: Stores user authentication and profile data
- **Product**: Contains product details, pricing, and metadata
- **PriceHistory**: Tracks price changes over time
- **Favorite**: Maps users to their favorite products
- **PriceAlert**: Stores price alert settings for users

## 🔌 API Integration

### Turkish Stores API (`turkish-stores-api.ts`)

**Purpose**: Mock API service for Turkish e-commerce platforms.

**Supported Stores**:
- **Trendyol**: Orange branding, fashion and electronics focus
- **Hepsiburada**: Blue branding, technology and home goods
- **N11**: Green branding, general marketplace
- **Amazon Turkey**: Yellow branding, international products

**API Structure**:
```typescript
interface TurkishProduct {
  id: string
  name: string
  image: string
  currentPrice: number
  originalPrice?: number
  store: string
  rating: number
  reviews: number
  storeUrl: string
  category: string
  brand: string
  description: string
  availability: string
  features: string[]
}
```

**Service Methods**:
```typescript
class TurkishStoresService {
  async searchAllStores(query: string, options: any): Promise<SearchResponse>
  async searchSpecificStore(storeName: string, query: string): Promise<SearchResponse>
}
```

### Product Service (`product-service.ts`)

**Purpose**: Unified service layer for product data management and API interactions.

**Key Methods**:
```typescript
class ProductService {
  async searchProducts(query: string, filters: SearchFilters, userFavorites: string[]): Promise<SearchResponse>
  async getProductDetails(productId: string, userFavorites: string[]): Promise<Product | null>
  async getPriceHistory(productId: string): Promise<{ date: string; price: number }[]>
  async getSimilarProducts(productId: string, category?: string): Promise<Product[]>
  async getSearchSuggestions(query: string): Promise<string[]>
}
```

## 👤 User Management

### Authentication Flow

1. **Registration Process**:
   - Email validation
   - Password strength requirements (minimum 6 characters)
   - Confirm password matching
   - Terms of service acceptance
   - Account creation with default preferences

2. **Login Process**:
   - Email/password validation
   - Social authentication (Google/Facebook)
   - Session management
   - User data loading (favorites, alerts, preferences)

3. **Profile Management**:
   - Personal information updates
   - Avatar management with URL validation
   - Email change with password confirmation
   - Password updates with old password verification

### User Data Structure

```typescript
interface User {
  name: string
  email: string
  profilePic?: string
  joinDate: string
  preferences: {
    priceAlerts: boolean
    weeklyDeals: boolean
    newProducts: boolean
    marketingEmails: boolean
  }
}
```

### Session Management

```typescript
// Global user state management
const [user, setUser] = useState<User | null>(null)
const [userFavorites, setUserFavorites] = useState<string[]>([])
const [userPriceAlerts, setUserPriceAlerts] = useState<PriceAlert[]>([])

// Persistent storage
const userFavoritesDB: { [userEmail: string]: Product[] } = {}
const userPriceAlertsDB: { [userEmail: string]: PriceAlert[] } = {}
```

## 🗄 Database Schema

### Favorites System

```typescript
// Favorites storage structure
interface FavoriteProduct extends Product {
  dateAdded: string
  userEmail: string
}

// Global favorites database
const userFavoritesDB: { [userEmail: string]: FavoriteProduct[] } = {
  "user@example.com": [
    {
      id: "product_123",
      name: "Sample Product",
      currentPrice: 299.99,
      dateAdded: "2024-01-15T10:30:00Z",
      userEmail: "user@example.com",
      // ... other product properties
    }
  ]
}
```

### Price Alerts System

```typescript
interface PriceAlert {
  id: string
  productId: string
  productName: string
  productImage: string
  currentPrice: number
  targetPrice: number
  alertType: "below" | "above" | "exact"
  dateCreated: string
  isActive: boolean
  userEmail: string
}

// Global price alerts database
const userPriceAlertsDB: { [userEmail: string]: PriceAlert[] } = {
  "user@example.com": [
    {
      id: "alert_123",
      productId: "product_123",
      productName: "Sample Product",
      currentPrice: 299.99,
      targetPrice: 269.99,
      alertType: "below",
      dateCreated: "2024-01-15T10:30:00Z",
      isActive: true,
      userEmail: "user@example.com"
    }
  ]
}
```

## 🎨 UI/UX Design

### Design System

**Color Palette**:
- **Primary**: Purple gradient (#9333ea to #3b82f6)
- **Background**: Dark gradient (gray-900 to purple-900/20)
- **Text**: White with opacity variations (white, white/90, white/70, white/60)
- **Accents**: Store-specific colors (Orange for Trendyol, Blue for Hepsiburada, etc.)

**Typography**:
- **Headings**: Bold, white text with drop shadows
- **Body**: Regular weight, white/80 opacity
- **Labels**: Medium weight, white/70 opacity
- **Captions**: Small size, white/60 opacity

### Glass Morphism Effects

**Electric Card Styling**:
```css
.electric-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(147, 51, 234, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.electric-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(147, 51, 234, 0.3),
    0 0 60px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

### Responsive Design

**Breakpoints**:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

**Responsive Patterns**:
```css
/* Mobile-first approach */
.grid-responsive {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Animation System

**Floating Animations**:
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes electricGlow {
  0% {
    box-shadow: 0 0 40px rgba(147, 51, 234, 0.3);
  }
  100% {
    box-shadow: 0 0 60px rgba(147, 51, 234, 0.5);
  }
}
```

## 📱 Use Case Scenarios

### Scenario 1: New User Product Search

**User Story**: "As a new user, I want to search for a laptop and compare prices across different stores."

**Flow**:
1. User visits homepage
2. Clicks "Start Searching" or uses search bar
3. Types "laptop" in search field
4. Views search suggestions and selects "gaming laptop"
5. Browses results from multiple stores (Trendyol, Hepsiburada, N11, Amazon Turkey)
6. Applies filters: Price range ₺5000-₺15000, Category: Electronics
7. Sorts by "Price: Low to High"
8. Clicks on a product to view details
9. Views price history chart
10. Compares with similar products
11. Decides to create account to save favorites

**Technical Implementation**:
```typescript
// Search flow
const handleSearch = async (query: string) => {
  setLoading(true)
  const results = await turkishStoresService.searchAllStores(query, {
    minPrice: 5000,
    maxPrice: 15000,
    category: "Electronics",
    sortBy: "price_low_to_high"
  })
  setProducts(results.products)
  setLoading(false)
}
```

### Scenario 2: Registered User Managing Favorites

**User Story**: "As a registered user, I want to manage my favorite products and set price alerts."

**Flow**:
1. User logs in with existing account
2. Navigates to "My Favorites" page
3. Views saved products in grid layout
4. Switches to list view for detailed comparison
5. Sorts favorites by "Price: High to Low"
6. Clicks bell icon on expensive product to set price alert
7. Sets target price 10% below current price
8. Removes outdated product from favorites
9. Clicks on product to view updated details
10. Shares product link with friend

**Technical Implementation**:
```typescript
// Favorites management
const handleFavoriteToggle = (productId: string, productData?: any) => {
  const isCurrentlyFavorite = userFavorites.includes(productId)
  let newFavorites: string[]
  
  if (isCurrentlyFavorite) {
    newFavorites = userFavorites.filter(id => id !== productId)
    delete favoriteProductsDB[productId]
  } else {
    newFavorites = [...userFavorites, productId]
    if (productData) {
      favoriteProductsDB[productId] = productData
    }
  }
  
  setUserFavorites(newFavorites)
  userFavoritesDB[user.email] = newFavorites.map(id => favoriteProductsDB[id])
}

// Price alert management
const handlePriceAlertToggle = (productId: string, productData: any) => {
  const existingAlert = userPriceAlerts.find(alert => alert.productId === productId)
  
  if (existingAlert) {
    // Remove alert
    const newAlerts = userPriceAlerts.filter(alert => alert.productId !== productId)
    setUserPriceAlerts(newAlerts)
  } else {
    // Add alert
    const newAlert: PriceAlert = {
      id: `alert_${Date.now()}`,
      productId,
      productName: productData.name,
      currentPrice: productData.currentPrice,
      targetPrice: productData.currentPrice * 0.9,
      alertType: "below",
      dateCreated: new Date().toISOString(),
      isActive: true,
      userEmail: user.email
    }
    setUserPriceAlerts([...userPriceAlerts, newAlert])
  }
}
```

### Scenario 3: Power User Profile Management

**User Story**: "As a power user, I want to customize my profile and notification preferences."

**Flow**:
1. User clicks on profile avatar in header
2. Navigates to profile page
3. Views account statistics (favorites count, total savings, alerts)
4. Clicks "Edit Profile" to update name and bio
5. Clicks "Change Avatar" to upload new profile picture
6. Clicks "Change Email" and provides current password for security
7. Updates email notification preferences
8. Clicks "Change Password" with old/new password confirmation
9. Reviews recent favorites and price alerts
10. Removes inactive price alerts

**Technical Implementation**:
```typescript
// Profile management
const handleSaveProfile = () => {
  if (!editedName.trim()) {
    alert("Name cannot be empty")
    return
  }
  
  // Update user data
  const updatedUser = { ...user, name: editedName, bio: editedBio }
  setUser(updatedUser)
  
  // Persist changes (in real app, this would be API call)
  localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser))
  
  setEditProfileOpen(false)
  alert("Profile updated successfully!")
}

// Email preferences
const handleSaveEmailPreferences = () => {
  const updatedPreferences = {
    ...user.preferences,
    ...emailPreferences
  }
  
  setUser({ ...user, preferences: updatedPreferences })
  localStorage.setItem(`preferences_${user.email}`, JSON.stringify(updatedPreferences))
  
  setEmailPrefsOpen(false)
}
```

### Scenario 4: Mobile User Experience

**User Story**: "As a mobile user, I want to quickly search and save products while commuting."

**Flow**:
1. User opens app on mobile device
2. Uses voice search or types query with mobile keyboard
3. Views results in mobile-optimized grid
4. Swipes through product images
5. Taps heart icon to add to favorites (requires login)
6. Quickly registers using Google authentication
7. Sets price alert with one tap
8. Shares product via mobile share sheet
9. Continues browsing with thumb-friendly navigation

**Technical Implementation**:
```typescript
// Mobile-responsive design
const isMobile = useMediaQuery("(max-width: 768px)")

// Touch-friendly interactions
const handleTouchStart = (e: TouchEvent) => {
  // Handle swipe gestures for product images
}

// Mobile-optimized search
const MobileSearchBar = () => (
  <div className="w-full px-4">
    <Input
      type="search"
      placeholder="Search products..."
      className="w-full text-lg py-3 rounded-full"
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
    />
  </div>
)
```

### Scenario 5: Price Tracking and Alerts

**User Story**: "As a budget-conscious shopper, I want to track price changes and get notified of deals."

**Flow**:
1. User searches for "iPhone 15"
2. Views product with current price ₺45,000
3. Checks price history chart showing recent price drop
4. Sets price alert for ₺40,000 (11% below current)
5. Receives notification when price drops to target
6. Compares prices across all stores
7. Finds best deal on Hepsiburada
8. Clicks "Buy" to go to store website
9. Completes purchase on external site
10. Returns to Pricefy to update favorites

**Technical Implementation**:
```typescript
// Price history visualization
const PriceHistoryChart = ({ data, duration }: PriceHistoryProps) => {
  const filteredData = useMemo(() => {
    const days = duration === "1w" ? 7 : 30
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return data.filter(point => new Date(point.date) >= cutoffDate)
  }, [data, duration])

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={filteredData}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => formatPrice(value as number)} />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke="#10b981" 
          strokeWidth={2}
          dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Price alert system
const checkPriceAlerts = async () => {
  for (const alert of userPriceAlerts) {
    const currentProduct = await productService.getProductDetails(alert.productId)
    
    if (currentProduct && shouldTriggerAlert(alert, currentProduct.currentPrice)) {
      // Send notification (in real app, this would be push notification or email)
      showNotification({
        title: "Price Alert!",
        message: `${alert.productName} is now ${formatPrice(currentProduct.currentPrice)}`,
        type: "success"
      })
    }
  }
}
```

## 📚 Component Documentation

### Universal Search Bar (`universal-search-bar.tsx`)

**Purpose**: Reusable search component with autocomplete functionality.

**Props**:
```typescript
interface UniversalSearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  size?: "sm" | "default" | "lg"
  showSuggestions?: boolean
  className?: string
}
```

**Features**:
- Real-time search suggestions
- Keyboard navigation (arrow keys, enter, escape)
- Debounced input for performance
- Responsive sizing
- Custom styling support

**Usage**:
```typescript
<UniversalSearchBar
  onSearch={handleSearch}
  placeholder="Search products..."
  size="lg"
  showSuggestions={true}
  className="max-w-2xl mx-auto"
/>
```

### Price History Chart (`price-history-chart.tsx`)

**Purpose**: Interactive chart component for displaying price trends over time.

**Props**:
```typescript
interface PriceHistoryChartProps {
  data: { date: string; price: number }[]
  duration: "1w" | "1m" | "3m" | "6m" | "1y"
  height?: number
  showTooltip?: boolean
}
```

**Features**:
- Responsive chart rendering
- Time period filtering
- Interactive tooltips
- Price formatting
- Trend indicators

### Product Comparison Modal (`product-comparison-modal.tsx`)

**Purpose**: Side-by-side product comparison interface.

**Props**:
```typescript
interface ProductComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  currentProduct: Product
  similarProducts: Product[]
  onProductSelect: (product: Product) => void
}
```

**Features**:
- Feature-by-feature comparison
- Price difference highlighting
- Store availability comparison
- Rating and review comparison
- Quick product switching

## 🔄 State Management

### Global State Structure

```typescript
// Main application state
interface AppState {
  user: User | null
  userFavorites: string[]
  userPriceAlerts: PriceAlert[]
  searchResults: Product[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
}

// State management hooks
const useAppState = () => {
  const [user, setUser] = useState<User | null>(null)
  const [userFavorites, setUserFavorites] = useState<string[]>([])
  const [userPriceAlerts, setUserPriceAlerts] = useState<PriceAlert[]>([])
  
  // Load user data on mount
  useEffect(() => {
    if (user) {
      loadUserData(user.email)
    }
  }, [user])
  
  const loadUserData = (email: string) => {
    const favorites = userFavoritesDB[email] || []
    const alerts = userPriceAlertsDB[email] || []
    
    setUserFavorites(favorites.map(fav => fav.id))
    setUserPriceAlerts(alerts)
  }
  
  return {
    user, setUser,
    userFavorites, setUserFavorites,
    userPriceAlerts, setUserPriceAlerts,
    loadUserData
  }
}
```

### Data Persistence

```typescript
// Persistent storage utilities
const persistUserData = (email: string, data: any) => {
  localStorage.setItem(`user_${email}`, JSON.stringify(data))
}

const loadUserData = (email: string) => {
  const stored = localStorage.getItem(`user_${email}`)
  return stored ? JSON.parse(stored) : null
}

// Global databases (in real app, these would be API calls)
const userFavoritesDB: { [email: string]: Product[] } = {}
const userPriceAlertsDB: { [email: string]: PriceAlert[] } = {}

// Make globally accessible for cross-component access
;(globalThis as any).userFavoritesDB = userFavoritesDB
;(globalThis as any).userPriceAlertsDB = userPriceAlertsDB
```

## 🎨 Styling System

### Tailwind Configuration

**Custom Colors**:
```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      // Store-specific colors
      trendyol: "#f27a1a",
      hepsiburada: "#ff6000", 
      n11: "#6c5ce7",
      amazon: "#ff9900",
      
      // App-specific colors
      electric: {
        purple: "#9333ea",
        blue: "#3b82f6",
        glass: "rgba(255, 255, 255, 0.1)"
      }
    },
    backdropBlur: {
      xs: "2px",
    },
    animation: {
      "float": "float 6s ease-in-out infinite",
      "electric-glow": "electricGlow 3s ease-in-out infinite alternate",
    }
  }
}
```

### Component Styling Patterns

**Electric Glass Cards**:
```css
.electric-card {
  @apply bg-white/10 backdrop-blur-xl border border-white/20;
  @apply shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_20px_rgba(147,51,234,0.1)];
  @apply transition-all duration-300 ease-in-out;
}

.electric-card:hover {
  @apply transform -translate-y-1;
  @apply shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(147,51,234,0.3)];
}
```

**Responsive Typography**:
```css
.heading-responsive {
  @apply text-xl font-bold;
  @apply md:text-2xl lg:text-3xl;
  @apply text-white drop-shadow-lg;
}

.body-responsive {
  @apply text-sm;
  @apply md:text-base;
  @apply text-white/80;
}
```

### Dark Theme Implementation

**CSS Variables**:
```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;
}
```

## 🧪 Testing Guidelines

### Component Testing

**Test Structure**:
```typescript
// Example test for SearchResultsPage
describe('SearchResultsPage', () => {
  const mockProps = {
    query: 'laptop',
    user: { name: 'Test User', email: 'test@example.com' },
    userFavorites: [],
    onProductSelect: jest.fn(),
    onBackToHome: jest.fn(),
    onFavoriteToggle: jest.fn(),
  }

  it('renders search results correctly', () => {
    render(<SearchResultsPage {...mockProps} />)
    expect(screen.getByText('Search results for "laptop"')).toBeInTheDocument()
  })

  it('handles favorite toggle', () => {
    render(<SearchResultsPage {...mockProps} />)
    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i })
    fireEvent.click(favoriteButton)
    expect(mockProps.onFavoriteToggle).toHaveBeenCalledWith('product_id')
  })

  it('filters products by price range', () => {
    render(<SearchResultsPage {...mockProps} />)
    const priceSlider = screen.getByRole('slider')
    fireEvent.change(priceSlider, { target: { value: '500' } })
    // Assert filtered results
  })
})
```

### API Testing

**Mock API Tests**:
```typescript
// Test Turkish Stores API
describe('TurkishStoresService', () => {
  it('searches all stores successfully', async () => {
    const service = new TurkishStoresService()
    const results = await service.searchAllStores('laptop', { limit: 10 })
    
    expect(results.products).toHaveLength(10)
    expect(results.storeResults).toHaveProperty('Trendyol')
    expect(results.storeResults).toHaveProperty('Hepsiburada')
  })

  it('handles search errors gracefully', async () => {
    const service = new TurkishStoresService()
    const results = await service.searchAllStores('', {})
    
    expect(results.products).toHaveLength(0)
    expect(results.totalResults).toBe(0)
  })
})
```

### User Flow Testing

**E2E Test Scenarios**:
```typescript
// Cypress E2E test example
describe('User Authentication Flow', () => {
  it('allows user to register and login', () => {
    cy.visit('/')
    cy.get('[data-testid="login-button"]').click()
    cy.get('[data-testid="register-tab"]').click()
    
    cy.get('input[name="name"]').type('Test User')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('input[name="confirmPassword"]').type('password123')
    
    cy.get('[data-testid="register-submit"]').click()
    cy.url().should('include', '/dashboard')
    cy.get('[data-testid="user-name"]').should('contain', 'Test User')
  })
})
```

## 🚀 Deployment

### Production Build

**Build Configuration**:
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

**Environment Variables**:
```bash
# .env.production
NEXT_PUBLIC_APP_URL=https://pricefy.com
NEXT_PUBLIC_API_URL=https://api.pricefy.com
NEXT_PUBLIC_ANALYTICS_ID=GA_TRACKING_ID
```

### Deployment Platforms

**Vercel Deployment**:
```json
// vercel.json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

**Docker Deployment**:
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Performance Optimization

**Next.js Optimizations**:
```typescript
// next.config.mjs
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com', 'cdn.example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

**Bundle Analysis**:
```bash
# Analyze bundle size
npm install --save-dev @next/bundle-analyzer
npm run analyze
```

## 🤝 Contributing

### Development Workflow

1. **Fork the Repository**
2. **Create Feature Branch**: `git checkout -b feature/new-feature`
3. **Make Changes**: Follow coding standards and conventions
4. **Write Tests**: Add unit and integration tests
5. **Update Documentation**: Update README and component docs
6. **Submit Pull Request**: Include detailed description of changes

### Code Standards

**TypeScript Guidelines**:
- Use strict type checking
- Define interfaces for all props and state
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

**React Best Practices**:
- Use functional components with hooks
- Implement proper error boundaries
- Optimize re-renders with useMemo and useCallback
- Follow component composition patterns

**Styling Guidelines**:
- Use Tailwind utility classes
- Create reusable component variants
- Maintain consistent spacing and typography
- Ensure accessibility compliance

### Git Commit Convention

```bash
# Commit message format
type(scope): description

# Examples
feat(auth): add social login functionality
fix(search): resolve price filtering bug
docs(readme): update installation instructions
style(ui): improve button hover effects
refactor(api): optimize product search performance
test(components): add unit tests for favorites page
```

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Documentation**: Check this README and component documentation
- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for general questions
- **Email**: contact@pricefy.com (if applicable)

## GitHub Actions CI/CD

The project uses GitHub Actions for continuous integration and deployment, providing automated testing, building, and deployment workflows.

### CI/CD Setup

- **Automated Testing**: All code changes are automatically tested
- **Linting**: Code quality checks are performed on every push and PR
- **Database Seeding**: Test database is automatically populated with sample data
- **Build Verification**: Ensures the application builds successfully
- **Deployment Pipeline**: Automates the deployment process

### Configuration Files

- `.github/workflows/main.yml`: Main CI workflow for testing and building
- `.github/workflows/deploy.yml`: Deployment workflow

### Detailed Documentation

For detailed information about the GitHub Actions setup, including customization and manual triggers, see [GitHub Actions Documentation](docs/github-actions.md).

---

**Note**: This is a comprehensive documentation for recreating the Pricefy project. All code examples, configurations, and implementation details are included to enable full project reconstruction by AI or human developers.
