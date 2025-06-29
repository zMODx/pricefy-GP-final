# Pricefy API Documentation

## Authentication Endpoints

### Register a new user
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with token

### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object with token

### Get current user
- **URL**: `/api/auth/user`
- **Method**: `GET`
- **Headers**: `x-auth-token: <token>`
- **Response**: User object

## Product Endpoints

### Get all products
- **URL**: `/api/products`
- **Method**: `GET`
- **Query Parameters**:
  - `search`: Search term for product name, description, brand, etc.
  - `page`: Page number for pagination (default: 1)
  - `limit`: Number of results per page (default: 10)
  - `sortBy`: Field to sort by (default: 'createdAt')
  - `order`: Sort order 'asc' or 'desc' (default: 'desc')
  - `minPrice`: Minimum price filter
  - `maxPrice`: Maximum price filter
  - `category`: Filter by category
  - `store`: Filter by store
  - `brand`: Filter by brand
  - `rating`: Filter by minimum rating
- **Response**: 
  ```json
  {
    "data": [{ product objects }],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
  ```

### Get product by ID
- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Response**: Product object

### Get price history for a product
- **URL**: `/api/products/:id/price-history`
- **Method**: `GET`
- **Response**: Array of price history entries

### Create a product
- **URL**: `/api/products`
- **Method**: `POST`
- **Headers**: `x-auth-token: <token>`
- **Body**: Product object
- **Response**: Created product

### Update a product
- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Headers**: `x-auth-token: <token>`
- **Body**: Updated product fields
- **Response**: Updated product

### Delete a product
- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Headers**: `x-auth-token: <token>`
- **Response**: Success message

## Favorites Endpoints

### Get user favorites
- **URL**: `/api/favorites?userId=<userId>`
- **Method**: `GET`
- **Headers**: `x-auth-token: <token>`
- **Response**: Array of favorites with product details

### Add to favorites
- **URL**: `/api/favorites`
- **Method**: `POST`
- **Headers**: `x-auth-token: <token>`
- **Body**: 
  ```json
  {
    "productId": "product_id_here"
  }
  ```
- **Response**: Created favorite

### Remove from favorites
- **URL**: `/api/favorites/:id`
- **Method**: `DELETE`
- **Headers**: `x-auth-token: <token>`
- **Response**: Success message

## Price Alerts Endpoints

### Get user price alerts
- **URL**: `/api/alerts?userId=<userId>&active=<true|false>`
- **Method**: `GET`
- **Headers**: `x-auth-token: <token>`
- **Response**: Array of price alerts with product details

### Create price alert
- **URL**: `/api/alerts`
- **Method**: `POST`
- **Headers**: `x-auth-token: <token>`
- **Body**: 
  ```json
  {
    "productId": "product_id_here",
    "targetPrice": 99.99
  }
  ```
- **Response**: Created price alert

### Delete price alert
- **URL**: `/api/alerts/:id`
- **Method**: `DELETE`
- **Headers**: `x-auth-token: <token>`
- **Response**: Success message

## Price History Endpoints

### Get price history for a product
- **URL**: `/api/price-history/:productId`
- **Method**: `GET`
- **Response**: Array of price history entries

### Add price point to history
- **URL**: `/api/price-history`
- **Method**: `POST`
- **Headers**: `x-auth-token: <token>`
- **Body**: 
  ```json
  {
    "productId": "product_id_here",
    "price": 99.99
  }
  ```
- **Response**: Created price history entry

### Get price analytics for a product
- **URL**: `/api/price-history/product/:productId/analytics`
- **Method**: `GET`
- **Response**: Object with min, max, avg prices and count

## Authentication

Most endpoints require authentication using the `x-auth-token` header. To authenticate:

1. Register or login to get a token
2. Include the token in subsequent requests:
   ```
   x-auth-token: <your_token>
   ```

## Error Responses

Error responses have the following structure:
```json
{
  "message": "Error message here",
  "errors": {
    "field1": "Error message for field1",
    "field2": "Error message for field2"
  }
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Server Error

## Development Tools

### Seeding the Database

To seed the database with sample data for testing:

```bash
npm run seed
```

This will create:
- Sample users with credentials
- Sample products with realistic data
- Price history for each product
- Sample favorites and price alerts

### Running the API

Development mode with auto-reload:
```bash
npm run server:dev
```

Production mode:
```bash
npm run server
```

Run both frontend and backend concurrently:
```bash
npm run dev:all
```
