const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const Favorite = require('../models/Favorite');
const PriceAlert = require('../models/PriceAlert');

// Load environment variables - try different paths for different environments
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.ci'),
  path.resolve(process.cwd(), '.env.test'),
  path.resolve(__dirname, '../../.env')
];

// Try loading each possible .env file location
let envLoaded = false;
for (const envPath of envPaths) {
  try {
    const result = dotenv.config({ path: envPath });
    if (result.parsed) {
      console.log(`Loaded environment from: ${envPath}`);
      envLoaded = true;
      break;
    }
  } catch (err) {
    // Continue to next path
  }
}

if (!envLoaded) {
  console.warn('No .env file found, using environment variables if available');
}

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pricefy';
console.log('Connecting to MongoDB at:', mongoURI);

mongoose.connect(mongoURI, {})
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data
const users = [
  {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    passwordHash: 'password123',
    profilePic: '/placeholder-user.jpg',
    preferences: {
      priceAlerts: true,
      weeklyDeals: true,
      newProducts: true,
      marketingEmails: false
    }
  },
  {
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    passwordHash: 'password123',
    profilePic: '/placeholder-user.jpg',
    preferences: {
      priceAlerts: true,
      weeklyDeals: false,
      newProducts: true,
      marketingEmails: false
    }
  }
];

const products = [
  {
    name: 'Apple iPhone 15 Pro',
    currentPrice: 999.99,
    originalPrice: 1099.99,
    store: 'Amazon',
    description: 'The latest iPhone with advanced features and improved camera system.',
    imageUrl: 'https://placehold.co/600x400?text=iPhone+15+Pro',
    rating: 4.8,
    reviews: 1245,
    storeUrl: 'https://www.amazon.com',
    category: 'Electronics',
    brand: 'Apple',
    availability: 'In Stock',
    features: [
      '6.1-inch Super Retina XDR display',
      'A16 Bionic chip',
      'Pro camera system',
      'Up to 28 hours of video playback'
    ]
  },
  {
    name: 'Samsung Galaxy S23 Ultra',
    currentPrice: 899.99,
    originalPrice: 1199.99,
    store: 'Amazon',
    description: 'The ultimate Samsung smartphone with S Pen and powerful camera.',
    imageUrl: 'https://placehold.co/600x400?text=Galaxy+S23+Ultra',
    rating: 4.7,
    reviews: 856,
    storeUrl: 'https://www.amazon.com',
    category: 'Electronics',
    brand: 'Samsung',
    availability: 'In Stock',
    features: [
      '6.8-inch Dynamic AMOLED 2X display',
      'Snapdragon 8 Gen 2 processor',
      '200MP main camera',
      '5000mAh battery'
    ]
  },
  {
    name: 'Sony WH-1000XM5',
    currentPrice: 349.99,
    originalPrice: 399.99,
    store: 'Trendyol',
    description: 'Industry-leading noise cancelling headphones with premium sound quality.',
    imageUrl: 'https://placehold.co/600x400?text=Sony+WH-1000XM5',
    rating: 4.9,
    reviews: 3211,
    storeUrl: 'https://www.trendyol.com',
    category: 'Electronics',
    brand: 'Sony',
    availability: 'In Stock',
    features: [
      'Industry-leading noise cancellation',
      'Up to 30 hours battery life',
      'Precise Voice Pickup technology',
      'Multipoint connection'
    ]
  },
  {
    name: 'LG OLED C3 65-inch TV',
    currentPrice: 1799.99,
    originalPrice: 2499.99,
    store: 'Hepsiburada',
    description: 'Stunning 4K OLED TV with perfect blacks and vibrant colors.',
    imageUrl: 'https://placehold.co/600x400?text=LG+OLED+C3',
    rating: 4.8,
    reviews: 578,
    storeUrl: 'https://www.hepsiburada.com',
    category: 'Electronics',
    brand: 'LG',
    availability: 'In Stock',
    features: [
      '65-inch 4K OLED display',
      'α9 Gen6 AI Processor',
      'Dolby Vision and Dolby Atmos',
      'webOS smart platform'
    ]
  },
  {
    name: 'PlayStation 5',
    currentPrice: 449.99,
    originalPrice: 499.99,
    store: 'N11',
    description: 'Next-gen gaming console with lightning-fast loading and stunning visuals.',
    imageUrl: 'https://placehold.co/600x400?text=PlayStation+5',
    rating: 4.9,
    reviews: 4567,
    storeUrl: 'https://www.n11.com',
    category: 'Gaming',
    brand: 'Sony',
    availability: 'Limited Stock',
    features: [
      'Ultra-high speed SSD',
      'Ray tracing support',
      '3D Audio technology',
      'DualSense controller with haptic feedback'
    ]
  }
];

// Price history entries (past 30 days with random fluctuations)
const generatePriceHistory = (product) => {
  const history = [];
  const currentPrice = product.currentPrice;
  const originalPrice = product.originalPrice;
  
  // Generate 30 days of history with some price fluctuations
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Calculate a price between original and current with some randomness
    const progress = i / 30; // 1 to 0 (original to current)
    const basePrice = originalPrice * progress + currentPrice * (1 - progress);
    const randomFactor = 0.98 + Math.random() * 0.04; // Random factor between 0.98 and 1.02
    const price = Math.round(basePrice * randomFactor * 100) / 100;
    
    history.push({
      productId: product._id,
      price,
      date
    });
  }
  
  return history;
};

// Seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await PriceHistory.deleteMany({});
    await Favorite.deleteMany({});
    await PriceAlert.deleteMany({});
    
    console.log('Previous data cleared');
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`${createdProducts.length} products created`);
    
    // Create price history for each product
    let priceHistoryEntries = [];
    createdProducts.forEach(product => {
      const history = generatePriceHistory(product);
      priceHistoryEntries = [...priceHistoryEntries, ...history];
    });
    
    await PriceHistory.insertMany(priceHistoryEntries);
    console.log(`${priceHistoryEntries.length} price history entries created`);
    
    // Create some favorites
    const favorites = [
      { userId: createdUsers[0]._id, productId: createdProducts[0]._id },
      { userId: createdUsers[0]._id, productId: createdProducts[2]._id },
      { userId: createdUsers[1]._id, productId: createdProducts[1]._id },
      { userId: createdUsers[1]._id, productId: createdProducts[4]._id }
    ];
    
    await Favorite.insertMany(favorites);
    console.log(`${favorites.length} favorites created`);
    
    // Create some price alerts
    const priceAlerts = [
      { 
        userId: createdUsers[0]._id, 
        productId: createdProducts[1]._id,
        targetPrice: createdProducts[1].currentPrice * 0.9,
        isActive: true
      },
      { 
        userId: createdUsers[0]._id, 
        productId: createdProducts[3]._id,
        targetPrice: createdProducts[3].currentPrice * 0.85,
        isActive: true
      },
      { 
        userId: createdUsers[1]._id, 
        productId: createdProducts[0]._id,
        targetPrice: createdProducts[0].currentPrice * 0.8,
        isActive: true
      }
    ];
    
    await PriceAlert.insertMany(priceAlerts);
    console.log(`${priceAlerts.length} price alerts created`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedDatabase();
