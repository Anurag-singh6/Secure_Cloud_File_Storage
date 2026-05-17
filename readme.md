# Secure Cloud File Storage

A robust, secure cloud-based file storage solution with end-to-end encryption, user authentication, and file management capabilities.

🔗 **Live Demo:** [Secure Cloud File Storage](https://secure-cloud-file-storage.onrender.com/)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## Features

✨ **Core Functionality:**
- 🔐 Secure file encryption and decryption
- 👤 User authentication and authorization
- 📤 File upload and download capabilities
- 🗂️ Organized file management system
- 🔑 Secure password hashing
- 🛡️ CSRF protection
- 📱 Responsive design

✅ **Advanced Features:**
- End-to-end encryption for file security
- JWT-based authentication
- Role-based access control
- File metadata management
- Audit logging
- Session management
- Rate limiting

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Encryption:** bcrypt, crypto-js
- **File Storage:** Multer

### Frontend
- **HTML5**
- **CSS3** (Responsive design)
- **JavaScript (ES6+)**
- **Fetch API** for client-side requests

### Deployment
- **Hosting:** Render
- **Environment:** Production-ready

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14.0.0 or higher)
- npm or yarn package manager
- MongoDB (local or MongoDB Atlas account)
- Git

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Anurag-singh6/Secure_Cloud_File_Storage.git
cd Secure_Cloud_File_Storage
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
NODE_ENV=development
ENCRYPTION_KEY=your_encryption_key
SESSION_SECRET=your_session_secret
```

### 4. Start the Application

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:5000`

## Configuration

### MongoDB Setup

1. **Local MongoDB:**
   ```bash
   mongod
   ```

2. **MongoDB Atlas (Recommended for production):**
   - Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster and database
   - Copy your connection string to `.env`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/secure_storage` |
| `JWT_SECRET` | JWT signing secret | `your_random_secret_key` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `ENCRYPTION_KEY` | File encryption key | `your_encryption_key` |
| `SESSION_SECRET` | Session management secret | `your_session_secret` |

## Usage

### User Registration

1. Navigate to the registration page
2. Enter your email and create a strong password
3. Click "Register"
4. Verify your email (if enabled)

### User Login

1. Enter your credentials
2. Click "Login"
3. You'll be redirected to the dashboard

### File Upload

1. Navigate to the upload section
2. Select a file from your device
3. Click "Upload"
4. File will be encrypted and stored securely

### File Download

1. Go to "My Files" section
2. Select the file you want to download
3. Click "Download"
4. File will be decrypted and downloaded locally

### File Management

- **View Files:** Browse all uploaded files
- **Delete Files:** Remove files permanently
- **Share Files:** Generate secure share links (optional)
- **Organize:** Create folders and organize files

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/verify
POST /api/auth/refresh-token
```

### Files

```http
GET /api/files
POST /api/files/upload
GET /api/files/:id
DELETE /api/files/:id
GET /api/files/:id/download
```

### Users

```http
GET /api/users/profile
PUT /api/users/profile
PUT /api/users/change-password
DELETE /api/users/account
```

## Security Features

🔒 **Implemented Security Measures:**

1. **Encryption**
   - AES-256 encryption for file content
   - bcrypt for password hashing
   - Secure key management

2. **Authentication & Authorization**
   - JWT-based token authentication
   - Role-based access control (RBAC)
   - Secure session management
   - Token expiration and refresh

3. **Data Protection**
   - HTTPS/TLS encryption in transit
   - Database encryption at rest
   - Secure cookie flags (HttpOnly, Secure, SameSite)
   - CORS policy enforcement

4. **Protective Measures**
   - CSRF token validation
   - SQL injection prevention
   - XSS protection
   - Rate limiting on endpoints
   - Input validation and sanitization

5. **Access Control**
   - User-level file access restrictions
   - Ownership verification
   - Audit logging for sensitive operations

## Project Structure

```
Secure_Cloud_File_Storage/
├── server/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── files.js
│   │   └── users.js
│   ├── models/
│   │   ├── User.js
│   │   └── File.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── fileController.js
│   │   └── userController.js
│   ├── utils/
│   │   ├── encryption.js
│   │   ├── logger.js
│   │   └── helpers.js
│   └── app.js
├── public/
│   ├── index.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       ├── upload.js
│       └── auth.js
├── .env
├── .gitignore
├── package.json
└── readme.md
```

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/Secure_Cloud_File_Storage.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make Your Changes**
   ```bash
   git add .
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Ensure tests pass

### Development Guidelines

- Follow the existing code style
- Add comments for complex logic
- Write meaningful commit messages
- Test changes before submitting PR
- Update documentation as needed

## Troubleshooting

### Common Issues

**Issue:** MongoDB connection failed
- **Solution:** Verify connection string in `.env` and ensure MongoDB service is running

**Issue:** File upload fails
- **Solution:** Check file size limits and ensure sufficient disk space

**Issue:** Authentication errors
- **Solution:** Clear browser cookies and try logging in again; verify JWT_SECRET is correct

**Issue:** Encryption/Decryption errors
- **Solution:** Ensure ENCRYPTION_KEY is correctly set and hasn't changed

## Performance Tips

- Implement file compression before upload
- Use CDN for static assets
- Enable database indexing
- Implement caching strategies
- Monitor server logs regularly

## Future Enhancements

- 📧 Email verification
- 🔐 Two-factor authentication (2FA)
- 👥 File sharing with permissions
- 🔍 Full-text search
- 📊 Storage analytics dashboard
- 🌍 Multi-region deployment
- 📱 Mobile app

## Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Enable HTTPS** - Always use in production
4. **Regular backups** - Implement automated backup strategy
5. **Update dependencies** - Keep packages current
6. **Monitor logs** - Review audit logs regularly
7. **Use environment variables** - Never hardcode secrets

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Contact

For support, issues, or questions:

- 📧 Email: your-email@example.com
- 🐛 GitHub Issues: [Report a bug](https://github.com/Anurag-singh6/Secure_Cloud_File_Storage/issues)
- 💬 Discussions: [Join discussions](https://github.com/Anurag-singh6/Secure_Cloud_File_Storage/discussions)

## Acknowledgments

- Thanks to all contributors
- MongoDB documentation
- Express.js community
- JWT implementation guides

---

**⭐ If you found this project helpful, please consider giving it a star!**

**Last Updated:** May 17, 2026
