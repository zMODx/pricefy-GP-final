/**
 * Database utility functions for common operations
 */

// Format an error response
const formatError = (error) => {
  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const errors = {};
    
    for (const field in error.errors) {
      errors[field] = error.errors[field].message;
    }
    
    return {
      message: 'Validation error',
      errors
    };
  }
  
  // Handle duplicate key errors (e.g., unique email)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return {
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      field
    };
  }
  
  // Handle cast errors (e.g., invalid ObjectId)
  if (error.name === 'CastError') {
    return {
      message: `Invalid ${error.path}: ${error.value}`
    };
  }
  
  // Default error handling
  return {
    message: error.message || 'Server error'
  };
};

// Pagination helper for list endpoints
const paginateResults = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const sortField = options.sortField || 'createdAt';
  const sortOrder = options.sortOrder || -1;
  const skip = (page - 1) * limit;
  
  const sort = {};
  sort[sortField] = sortOrder;
  
  const total = await model.countDocuments(query);
  const data = await model.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);
  
  return {
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

// Search helper
const searchDocuments = async (model, searchFields, searchTerm, options = {}) => {
  if (!searchTerm) {
    return paginateResults(model, {}, options);
  }
  
  const searchQuery = {
    $or: searchFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' }
    }))
  };
  
  return paginateResults(model, searchQuery, options);
};

// Filter helper - builds a MongoDB query from filter parameters
const buildFilterQuery = (filters = {}) => {
  const query = {};
  
  // Process each filter
  Object.keys(filters).forEach(key => {
    const value = filters[key];
    
    // Skip empty values
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    // Handle special filters
    if (key === 'minPrice') {
      query.currentPrice = query.currentPrice || {};
      query.currentPrice.$gte = parseFloat(value);
    } 
    else if (key === 'maxPrice') {
      query.currentPrice = query.currentPrice || {};
      query.currentPrice.$lte = parseFloat(value);
    }
    else if (key === 'category' || key === 'store' || key === 'brand') {
      // Handle arrays of values for these fields
      if (Array.isArray(value) && value.length > 0) {
        query[key] = { $in: value };
      } else {
        query[key] = value;
      }
    }
    else if (key === 'rating') {
      query.rating = { $gte: parseFloat(value) };
    }
    else {
      // Default handling
      query[key] = value;
    }
  });
  
  return query;
};

module.exports = {
  formatError,
  paginateResults,
  searchDocuments,
  buildFilterQuery
};
