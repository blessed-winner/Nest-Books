# 📚 Nest-Books (Book Management API)

A modular, scalable **Book Management System** built with [NestJS](https://nestjs.com/), **TypeORM**, and **MySQL**. This API supports user authentication, granular role-based access, email verification, password reset, and full CRUD operations for books and users.

---

## 🚀 Features

- 🔁 Full Book CRUD (Create, Read, Update, Delete)
- 👤 User registration, login, and role management (User, Librarian, Admin)
- 🔐 JWT Authentication & **Granular Role-based Authorization** (per-endpoint)
- 📧 Email verification and password reset via secure email links
- ⚙️ Environment variables via `.env` (including SMTP and JWT)
- 💾 MySQL database with TypeORM
- 📦 Modular NestJS architecture (Books, Users, Borrow, Mailer)
- 🛡️ Exception filters and DTO validation
- 🧪 Ready for testing and extension
- 📖 Borrowing history
- 🛠️ Logging for debugging JWT and email flows

---

## 📁 Project Structure

```
src/
  ├── app.module.ts
  ├── main.ts
  ├── books/
  │   ├── books.controller.ts
  │   ├── books.module.ts
  │   ├── books.service.ts
  │   └── entities/book.entity.ts
  ├── borrow/
  │   ├── borrow.controller.ts
  │   ├── borrow.module.ts
  │   ├── borrow.service.ts
  │   └── entities/borrow.entity.ts
  ├── user/
  │   ├── user.controller.ts
  │   ├── user.module.ts
  │   ├── user.service.ts
  │   └── user.entity.ts
  ├── mailer/
  │   ├── mailer.module.ts
  │   └── mailer.service.ts
  ├── seeder/
  └── utils/
```

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
git clone https://github.com/blessedwinner66/Nest-Books.git
cd nest-books
```
2. **Install dependencies**
   ```bash
npm install
```
3. **Setup environment variables**
   - Copy `.env.example` to `.env` and fill in your database, JWT, and SMTP credentials:
   ```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourPassword
DB_NAME=books_auth
PORT=3000
JWT_SECRET=your_jwt_secret
# SMTP for email verification and password reset
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_SECURE=false
MAIL_FROM="NestBooks <noreply@nestbooks.com>"
```
4. **Run the app**
   ```bash
npm run start:dev
```

---

## 🛠️ Technologies Used
- **NestJS** - Main framework
- **TypeORM** - ORM for MySQL
- **MySQL** - Database
- **@nestjs/config** - Environment management
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **nodemailer** - Email sending
- **DTOs, Exception Filters** - Best practices

---

## 🧠 How It Works
- `.env` is loaded using `@nestjs/config` for all sensitive configs.
- `TypeOrmModule.forRootAsync()` reads DB config from `ConfigService`.
- Book, User, and Borrow entities are mapped to DB tables.
- Modular design (BooksModule, UserModule, BorrowModule, MailerModule) for scalability.
- JWT authentication and **granular, per-endpoint role-based guards** for secure endpoints.
- Email verification and password reset flows use secure, expiring tokens sent via email.
- Logging is added for JWT and email flows to aid debugging.

---

## 🗃️ Database Schema

### Book Entity
| Field  | Type    | Description         |
|--------|---------|---------------------|
| id     | number  | Primary Key         |
| title  | string  | Book title (unique) |
| author | string  | Book author         |

### User Entity
| Field    | Type   | Description                |
|----------|--------|----------------------------|
| id       | number | Primary Key                |
| name     | string | User's name                |
| email    | string | User's email (unique)      |
| password | string | Hashed password            |
| role     | enum   | user, librarian, or admin  |
| isVerified | boolean | Email verified           |
| resetToken | string | Password reset token      |
| resetTokenExpiry | Date | Token expiry           |

### Borrow Entity
| Field       | Type    | Description                       |
|-------------|---------|-----------------------------------|
| id          | number  | Primary Key                       |
| book        | Book    | The borrowed book (relation)      |
| user        | User    | The user who borrowed the book    |
| borrowedAt  | Date    | When the book was borrowed        |
| returnedAt  | Date    | When the book was returned (null if not yet returned) |

---

## 🔑 Authentication, Email Verification & Password Reset

- **Signup/Login**: Users can register and log in. Passwords are hashed with bcrypt.
- **JWT**: On login, a JWT is issued and stored in an HTTP-only cookie.
- **Email Verification**: On signup, users receive a verification email with a secure token. Clicking the link verifies their account.
- **Password Reset**: Users can request a password reset. A secure, expiring token is emailed to them. They can reset their password using the link.
- **Granular Role-based Access**: Each book endpoint is protected according to user role (User, Librarian, Admin).

---

## 📚 API Endpoints & Role Access

### Auth/User
| Method | Endpoint         | Description                       | Auth Required | Role        |
|--------|------------------|-----------------------------------|--------------|-------------|
| POST   | /auth/signup     | Register a new user (email verification sent) | No           | -           |
| GET    | /auth/verify-email?token= | Verify user email via token   | No           | -           |
| POST   | /auth/login      | Login and receive JWT cookie      | No           | -           |
| POST   | /auth/create     | Admin creates a new user          | Yes          | ADMIN       |
| PATCH  | /auth/profile    | Update user profile               | Yes          | User/Admin  |
| POST   | /auth/request-password-reset | Request password reset link | No           | -           |
| POST   | /auth/reset-password | Reset password using token      | No           | -           |
| GET    | /auth/:id/history| Get borrowing history for user    | Yes          | User/Admin  |

### Books (Granular Role-Based Access)
| Method | Endpoint         | Description                | User | Librarian | Admin |
|--------|------------------|----------------------------|------|-----------|-------|
| POST   | /books           | Create a new book          | ❌   | ✅        | ✅    |
| GET    | /books           | List all books             | ✅   | ✅        | ✅    |
| GET    | /books/:id       | Get book by ID             | ✅   | ✅        | ✅    |
| PATCH  | /books/:id       | Update book by ID          | ❌   | ✅        | ✅    |
| DELETE | /books/:id       | Delete book by ID          | ❌   | ❌        | ✅    |
| GET    | /books/:id/history| Get borrowing history for book | ✅   | ✅        | ✅    |

### Borrow
| Method | Endpoint         | Description                        | Auth Required | Role        |
|--------|------------------|------------------------------------|--------------|-------------|
| POST   | /borrow          | Borrow a book                      | Yes          | User        |
| PATCH  | /borrow/:id      | Return a borrowed book             | Yes          | User        |

---

## ⚙️ Environment Variables Reference

| Variable      | Description                       |
|---------------|-----------------------------------|
| DB_HOST       | MySQL host                        |
| DB_PORT       | MySQL port                        |
| DB_USERNAME   | MySQL username                    |
| DB_PASSWORD   | MySQL password                    |
| DB_NAME       | MySQL database name               |
| PORT          | App port (default 3000)           |
| JWT_SECRET    | Secret for signing JWTs           |
| SMTP_HOST     | SMTP server for email             |
| SMTP_PORT     | SMTP port                         |
| SMTP_USER     | SMTP username                     |
| SMTP_PASS     | SMTP password                     |
| SMTP_SECURE   | Use secure SMTP (true/false)      |
| MAIL_FROM     | Default from address for emails   |

---

## 🛡️ Security Best Practices
- All sensitive configs are stored in `.env` and never hardcoded.
- Passwords are hashed with bcrypt before storage.
- JWTs are stored in HTTP-only cookies for security.
- Email verification and password reset tokens are time-limited and securely generated.
- Role-based guards protect all sensitive endpoints.

---

## 🧪 Testing & Debugging
- Run tests with:
  ```bash
  npm run test
  npm run test:e2e
  ```
- Logging is enabled for JWT and email flows. Check server logs for token and email debug info.
- For email testing, if SMTP is not configured, a Nodemailer test account is used and preview links are logged.

---

## 🐞 Troubleshooting
- **JWT malformed**: Ensure the client sends a valid JWT in the cookie. Check server logs for the received token.
- **Missing SMTP credentials**: Set all SMTP variables in `.env` for production. For development, a test account is used.
- **User not verified**: Users must verify their email before accessing protected endpoints.
- **Password reset issues**: Ensure the reset token is valid and not expired. Check logs for details.

---

## 🤝 Contributing & Code Quality
- PRs and issues are welcome!
- Use DTOs and validation for all inputs.
- Exception filters handle errors gracefully.
- Follow NestJS and TypeScript best practices.
- Lint and format code before submitting:
  ```bash
  npm run lint
  npm run format
  ```

---

## ✅ Future Improvements
- Swagger/OpenAPI documentation
- More granular permissions (per-resource or per-action)
- Email templates and localization
- User activity logging and audit trails
- More user roles and permissions

---

## 🧑 Author
IMPANO Blessed Winner  
GitHub: [@blessedwinner66](https://github.com/blessedwinner66)  
LinkedIn: IMPANO Blessed Winner

---

## 📝 License
This project is open-source and free to use under the MIT License.
