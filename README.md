# 🛍️ Product API - Express.js RESTful Service

A fully functional RESTful API built using **Express.js**, supporting product management with features like **authentication**, **validation**, **error handling**, **pagination**, **search**, and **filtering**.

---

## 🚀 How to Run the Server

### 🔧 Requirements
- Node.js v18+ installed
- `npm` (comes with Node)

### 📦 Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/week-2-express-js-assignment-marycathline.git
   cd express-api-yourname
Install dependencies:

bash
npm install

Create a .env file based on .env.example:

bash
cp .env.example .env

Run the server:

bash
node server.js


🔐 Authentication
This API uses a simple API key for authentication on protected routes.

Send the API key in the headers like this:

makefile
x-api-key: your_api_key_here

📄 GET /api/products
Fetch all products

Optional Query Params:

category: Filter by category

page: Page number (e.g., 1)

limit: Items per page (e.g., 10)

Example:

bash
/api/products?category=electronics&page=1&limit=5

🔍 GET /api/products/search?name=term
Search products by name

Case-insensitive match

📦 GET /api/products/:id
Fetch a specific product by ID

➕ POST /api/products
Create a new product

Requires API Key

JSON Body:

json
{
  "name": "iPhone 15",
  "description": "Latest Apple phone",
  "price": 999,
  "category": "electronics",
  "inStock": true
}
🔄 PUT /api/products/:id
Update an existing product

Requires API Key

JSON Body: Same as POST

❌ DELETE /api/products/:id
Delete a product

Requires API Key

📊 GET /api/products/stats
Get product statistics

Returns product count by category

Example Response:
{
  "electronics": 3,
  "clothing": 5,
  "books": 2
}

🧪 Example Requests
Create Product (POST)
POST /api/products
x-api-key: secret123
Content-Type: application/json

{
  "name": "Laptop",
  "description": "High-end gaming laptop",
  "price": 1999.99,
  "category": "electronics",
  "inStock": true
}

Search Product (GET)
pgsql
GET /api/products/search?name=laptop

⚠️ Error Handling
| Error Type           | Status Code | Description                |
| -------------------- | ----------- | -------------------------- |
| ValidationError      | 400         | Invalid input data         |
| NotFoundError        | 404         | Product not found          |
| Authentication Error | 401         | Invalid or missing API key |

👨‍🏫 Author:Mary Cathline
Built for educational purposes using Express.js.