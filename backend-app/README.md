# Simple E-Commerce CRUD API

A lightweight, minimal **Express.js + MongoDB** CRUD API for item management and REST API development.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![Express](https://img.shields.io/badge/Express-5.2+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- **Simple REST API** - 5 basic CRUD endpoints for item management
- **MongoDB Integration** - Mongoose for clean schema validation
- **Zero Overengineering** - Minimal, readable code perfect for learning
- **Hot Reload** - Nodemon for instant development feedback
- **Easy Testing** - Postman collection included for quick validation
- **Clean Architecture** - Separated models, controllers, and routes

## Quick Start

### Prerequisites

- **Node.js** v14 or higher
- **MongoDB** running locally on port 27017
- **npm** (comes with Node.js)
- **Postman** (optional, for API testing)

### Installation

1. **Clone/Navigate to the project:**
   ```bash
   cd backend-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   The `.env` file should contain:
   ```env
   PORT=5000
  MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

4. **Create a MongoDB Atlas cluster:**
  - Create a free cluster in MongoDB Atlas.
  - Add a database user and password.
  - Allow your IP address in the network access list.
  - Replace the placeholder connection string in `.env` with your Atlas URI.

### Running the Server

**Development mode** (auto-reload on file changes):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will be available at: **http://localhost:5000**

## API Documentation

### Base URL
```
http://localhost:5000/api/items
```

### Data Model

All items follow this structure:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "Electronics",
  "stock": 15,
  "imageUrl": "https://example.com/laptop.jpg",
  "rating": 4.5,
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

### Endpoints

#### GET /api/items
Retrieve all items (sorted by newest first)

**Response:** `200 OK`
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "category": "Electronics",
    "stock": 15,
    "imageUrl": "https://example.com/laptop.jpg",
    "rating": 4.5,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z"
  }
]
```

---

#### POST /api/items
Create a new item

**Request Body:**
```json
{
  "name": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "category": "Electronics",
  "stock": 15,
  "imageUrl": "https://example.com/laptop.jpg",
  "rating": 4.5
}
```

**Required Fields:**
- `name` (string)
- `price` (number, minimum 0)

**Optional Fields:**
- `description` (string, default: empty)
- `category` (string, default: "General")
- `stock` (number, default: 0)
- `imageUrl` (string, default: empty)
- `rating` (number 0-5, default: 0)

**Response:** `201 Created` - Returns the newly created item with `_id`

---

#### GET /api/items/:id
Retrieve a single item by ID

**Parameters:**
- `id` (string) - MongoDB ObjectId

**Response:** `200 OK` - Returns the item object

**Error Responses:**
- `404 Not Found` - If item doesn't exist

---

#### PUT /api/items/:id
Update an existing item

**Parameters:**
- `id` (string) - MongoDB ObjectId

**Request Body:** (send only fields you want to update)
```json
{
  "price": 1299.99,
  "stock": 8,
  "rating": 4.8
}
```

**Response:** `200 OK` - Returns the updated item object

**Error Responses:**
- `404 Not Found` - If item doesn't exist
- `400 Bad Request` - If validation fails

---

#### DELETE /api/items/:id
Delete an item

**Parameters:**
- `id` (string) - MongoDB ObjectId

**Response:** `200 OK`
```json
{
  "message": "Item deleted"
}
```

**Error Responses:**
- `404 Not Found` - If item doesn't exist

## Testing with Postman

### Quick Setup

1. **Open Postman** on your computer
2. **Click Import** → Select `postman_collection.json` from the project root
3. **The collection auto-loads** with all 6 pre-configured requests

### Workflow for Testing

1. **Test Endpoint** - Verify API is running
2. **Create Item** - Send a POST request (copy the `_id` from response)
3. **Get All Items** - Verify creation
4. **Get Item by ID** - Use the `_id` from step 2
5. **Update Item** - Modify the item you created
6. **Delete Item** - Remove it from database

### Manual Testing with cURL

```bash
# Get all items
curl http://localhost:5000/api/items

# Create item
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Laptop","price":999.99,"category":"Electronics"}'

# Get item by ID (replace with real ID)
curl http://localhost:5000/api/items/507f1f77bcf86cd799439011

# Update item
curl -X PUT http://localhost:5000/api/items/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{"price":1299.99}'

# Delete item
curl -X DELETE http://localhost:5000/api/items/507f1f77bcf86cd799439011
```

## Managing MongoDB Data

### Option 1: MongoDB Extension in VS Code (Recommended)

This is the easiest visual way to manage your database **without writing code**:

1. Look for the **MongoDB icon** in VS Code's left sidebar (should already be installed)
2. Click **"Add Connection"**
3. Enter the connection string: `mongodb://127.0.0.1:27017`
4. Click **"Create MongoDB Connection"**
5. Now you can:
   - Browse all databases and collections
   - View documents in a tree view
   - Edit documents directly
   - Delete documents
   - Run queries

### Option 2: MongoDB Shell (Command Line)

For terminal-based database management:

```bash
mongosh
```

Then run these commands:

```bash
# Show all databases
show databases

# Use the ecommerce database
use ecommerce

# Show all collections
show collections

# View all items
db.items.find()

# View items with pretty formatting
db.items.find().pretty()

# Count items
db.items.countDocuments()

# Find item by ID
db.items.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })

# Delete an item
db.items.deleteOne({ _id: ObjectId("507f1f77bcf86cd799439011") })

# Drop entire collection (careful!)
db.items.drop()
```

### Option 3: MongoDB Compass (External GUI Tool)

For a standalone GUI application:

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install and launch it
3. Connect to: `mongodb://127.0.0.1:27017`
4. Browse and manage data visually

## Project Structure

```
backend-app/
├── server.js                  # Express app entry point
├── config/
│   └── db.js                  # MongoDB connection setup
├── models/
│   └── Item.js                # Item schema definition
├── controllers/
│   └── itemController.js      # CRUD business logic
├── routes/
│   └── itemRoutes.js          # API route handlers
├── .env                       # Environment variables (local)
├── .env.example               # Template for .env
├── .gitignore                 # Git ignore rules
├── package.json               # Project metadata & scripts
├── package-lock.json          # Dependency lock file
├── README.md                  # This file
└── postman_collection.json    # Postman test collection
```

## Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Start production server
npm start
```

## Contributing

Feel free to modify and extend this project for your use case.

---

## Disclaimer

This README and project structure documentation were assisted by AI tools. However, all project logic, architecture decisions, database schema design, and API flow are fully owned and understood by the developer. AI was used primarily for:
- Documentation formatting and structure
- Code scaffolding and boilerplate
- Redundant code generation (models, routes, controllers)

The developer retains full responsibility for the implementation logic, database design choices, API endpoints, and all business logic within the application.

---

## License

MIT License.

## Author

Created as a minimal Express.js + MongoDB REST API example.

**Need help?** Check the Postman collection or refer to the [MongoDB](https://docs.mongodb.com/) and [Express.js](https://expressjs.com/) documentation.

---

Happy coding!
