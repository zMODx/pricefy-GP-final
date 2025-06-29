# Backend Setup for Pricefy

This document outlines the backend setup for the Pricefy project, including MongoDB connection, Express server, and API routes.

## Server Structure

The backend server is built using Express.js and MongoDB with Mongoose for database operations. The server code is organized in the following structure:

```
server/
├── config/
│   └── db.js                  # MongoDB connection configuration
├── models/
│   ├── Product.js             # Product schema and model
│   └── User.js                # User schema and model
├── routes/
│   └── products.js            # Product API routes
└── index.js                   # Main server entry point
```

## MongoDB Connection

The server connects to MongoDB Atlas using Mongoose. The connection is established in the `config/db.js` file:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Handle app termination - close MongoDB connection
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

## Environment Variables

The server uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/pricefy?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## Running the Server

You can run the server using the following npm scripts:

- `npm run server` - Start the server in production mode
- `npm run server:dev` - Start the server in development mode with nodemon (auto-restart on file changes)
- `npm run dev:all` - Start both the Next.js frontend and the Express backend concurrently

## API Routes

### Products API

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a product by ID
- `POST /api/products` - Create a new product
- `PUT /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product

## Models

### Product Model

The Product model includes fields for product details, pricing information, and price history tracking:

```javascript
const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  currentPrice: Number,
  originalPrice: Number,
  store: String,
  rating: Number,
  reviews: Number,
  storeUrl: String,
  category: String,
  brand: String,
  description: String,
  availability: String,
  features: [String],
  priceHistory: [{
    date: Date,
    price: Number
  }],
  createdAt: Date,
  updatedAt: Date
});
```

### User Model

The User model includes fields for authentication, profile information, and user preferences:

```javascript
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profilePic: String,
  joinDate: Date,
  preferences: {
    priceAlerts: Boolean,
    weeklyDeals: Boolean,
    newProducts: Boolean,
    marketingEmails: Boolean
  },
  createdAt: Date,
  updatedAt: Date
});
```
