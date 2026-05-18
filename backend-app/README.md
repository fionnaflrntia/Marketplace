# Simple E-Commerce CRUD API

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


Created as a minimal Express.js + MongoDB REST API example.

**Need help?** Check the Postman collection or refer to the [MongoDB](https://docs.mongodb.com/) and [Express.js](https://expressjs.com/) documentation.

---

Happy coding!
