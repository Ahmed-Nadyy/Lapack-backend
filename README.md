# Lapak Backend

The backend of Lapak is built with Node.js and Express.js, providing a robust API for our laptop e-commerce platform. It handles user authentication, product management, order processing, and image uploads.

## Features

### Core Functionality
- User authentication and authorization with JWT
- Product (laptop) management with CRUD operations
- Order processing and tracking
- Image upload and management with Cloudinary
- Role-based access control (Admin/User)

### Technical Features
- RESTful API architecture
- MongoDB database with Mongoose ODM
- JWT-based authentication
- File upload handling
- Error handling middleware
- Input validation

## Project Structure
```
serverr/
├── config/            # Configuration files
│   └── cloudinaryConfig.js
├── controllers/       # Route controllers
│   ├── authController.js
│   ├── laptopController.js
│   └── orderController.js
├── middleware/        # Custom middleware
│   ├── auth.js
│   ├── cloudinaryUpload.js
│   └── upload.js
├── models/           # Database models
│   ├── Laptop.js
│   ├── Order.js
│   └── User.js
├── routes/           # API routes
│   ├── authRoutes.js
│   ├── laptopRoutes.js
│   └── orderRoutes.js
└── utils/            # Utility functions
```

## Tech Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Multer** - File upload handling

## API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login    - User login
GET  /api/auth/profile  - Get user profile
```

### Products (Laptops)
```
GET    /api/laptops     - Get all laptops
GET    /api/laptops/:id - Get laptop by ID
POST   /api/laptops     - Add new laptop (Admin)
PUT    /api/laptops/:id - Update laptop (Admin)
DELETE /api/laptops/:id - Delete laptop (Admin)
```

### Orders
```
GET    /api/orders     - Get all orders (Admin)
GET    /api/orders/:id - Get order by ID
POST   /api/orders     - Create new order
PUT    /api/orders/:id - Update order status (Admin)
```

## Database Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String,
  createdAt: Date
}
```

### Laptop Model
```javascript
{
  name: String,
  brand: String,
  price: Number,
  specs: Object,
  stock: Number,
  images: [String],
  createdAt: Date
}
```

### Order Model
```javascript
{
  user: ObjectId,
  items: [{
    laptop: ObjectId,
    quantity: Number,
    price: Number
  }],
  total: Number,
  status: String,
  createdAt: Date
}
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account

### Installation
1. Navigate to the server directory:
   ```bash
   cd serverr
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Available Scripts
- `npm start` - Starts the server
- `npm run dev` - Starts the server with nodemon

## Error Handling
The API uses a consistent error response format:
```javascript
{
  success: false,
  message: "Error message",
  error: error_details // (in development)
}
```

## Security Measures
- Password hashing with bcrypt
- JWT token validation
- Rate limiting on auth routes
- Input sanitization
- CORS configuration

## Development Guidelines
1. Follow RESTful API conventions
2. Implement proper error handling
3. Validate all inputs
4. Write clear API documentation
5. Follow security best practices

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Contact
For backend-related inquiries, please contact:
- Ahmed Nady - [LinkedIn](https://linkedin.com/in/ahmed-nadyy)