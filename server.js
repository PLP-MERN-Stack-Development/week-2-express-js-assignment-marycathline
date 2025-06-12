// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');


// Import custom error classes
const { NotFoundError, ValidationError } = require('./errors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;


// Logger middleware
const logger = (req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.originalUrl}`);
  next(); // move to next middleware or route
};


// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey === 'secret123') {
    next(); // move forward
  } else {
    res.status(401).json({ error: 'Unauthorized. API key missing or incorrect.' });
  }
};

// Validation middleware
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (
    !name ||
    !description ||
    typeof price !== 'number' ||
    !category ||
    typeof inStock !== 'boolean'
  ) {
    throw new ValidationError('Invalid product data');
  }

  next();
};




// global Middleware application
app.use(logger); // Request logging middleware
app.use(bodyParser.json());


// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// Example route implementation for GET /api/products

// GET /api/products?category=electronics&page=1&limit=5
app.get('/api/products', (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;

  let filteredProducts = products;

  // Filter by category if provided
  if (category) {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Pagination logic
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  res.json({
    total: filteredProducts.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: paginatedProducts,
  });
});


app.get('/api/products/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const product = products.find(p => p.id === id);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    res.json(product);
  } catch (err) {
    next(err); // Pass error to global handler
  }
});


// POST /api/products - Create a new product
app.post('/api/products', authenticate, validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', authenticate, validateProduct, (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, inStock } = req.body;

  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  product.name = name;
  product.description = description;
  product.price = price;
  product.category = category;
  product.inStock = inStock;

  res.json(product);
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const index = products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted', product: deleted[0] });
});

// GET /api/products/search?name=keyword
app.get('/api/products/search', (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'Please provide a name to search' });
  }

  const keyword = name.toLowerCase();
  const results = products.filter(product =>
    product.name.toLowerCase().includes(keyword)
  );

  res.json({
    total: results.length,
    data: results
  });
});

// GET /api/products/stats - Get product count by category
app.get('/api/products/stats', (req, res) => {
  const stats = {};

  products.forEach(product => {
    const category = product.category.toLowerCase();
    stats[category] = (stats[category] || 0) + 1;
  });

  res.json(stats);
});


// Global Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;

  res.status(status).json({
    error: err.name || 'Error',
    message: err.message || 'Something went wrong',
  });
});

  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 