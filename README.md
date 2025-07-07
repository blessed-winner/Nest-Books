# 📚 Nest-Books (Book Management API)

A modular, scalable **Book Management System** built with [NestJS](https://nestjs.com/), **TypeORM**, and **MySQL**. This API supports user authentication, role-based access, and full CRUD operations for books and users.

---

## 🚀 Features

- 🔁 Full Book CRUD (Create, Read, Update, Delete)
- 👤 User registration, login, and role management (User, Librarian, Admin)
- 🔐 JWT Authentication & Role-based Authorization
- ⚙️ Environment variables via `.env`
- 💾 MySQL database with TypeORM
- 📦 Modular NestJS architecture
- 🛡️ Exception filters and DTO validation
- 🧪 Ready for testing and extension

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
  ├── user/
  │   ├── user.controller.ts
  │   ├── user.module.ts
  │   ├── user.service.ts
  │   └── user.entity.ts
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
   - Copy `.env.example` to `.env` and fill in your database and JWT credentials:
   ```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourPassword
DB_NAME=books_auth
PORT=3000
JWT_SECRET=your_jwt_secret
```
4. **Run the app**
   
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
- **DTOs, Exception Filters** - Best practices

---

## 🧠 How It Works
- `.env` is loaded using `@nestjs/config`.
- `TypeOrmModule.forRootAsync()` reads DB config from `ConfigService`.
- Book and User entities are mapped to DB tables.
- Modular design (BooksModule, UserModule) for scalability.
- JWT authentication and role-based guards for secure endpoints.

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

---

## 🔑 Authentication & Authorization
- **Signup/Login**: Users can register and log in. Passwords are hashed with bcrypt.
- **JWT**: On login, a JWT is issued and stored in an HTTP-only cookie.
- **Role-based Access**: Admins can create users with specific roles. Protected endpoints require valid JWT and appropriate role.

---

## 📚 API Endpoints

### Auth/User
| Method | Endpoint         | Description                       | Auth Required | Role        |
|--------|------------------|-----------------------------------|--------------|-------------|
| POST   | /auth/signup     | Register a new user               | No           | -           |
| POST   | /auth/login      | Login and receive JWT cookie      | No           | -           |
| POST   | /auth/create     | Admin creates a new user          | Yes          | ADMIN       |
| PATCH  | /auth/profile    | Update user profile               | Yes          | User/Admin  |

### Books
| Method | Endpoint      | Description                | Auth Required |
|--------|---------------|----------------------------|---------------|
| POST   | /books        | Create a new book          | Yes           |
| GET    | /books        | List all books             | No            |
| GET    | /books/:id    | Get book by ID             | Yes           |
| PATCH  | /books/:id    | Update book by ID          | Yes           |
| DELETE | /books/:id    | Delete book by ID          | Yes           |

---

## ⚙️ Environment Variables
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`: MySQL connection
- `PORT`: App port (default 3000)
- `JWT_SECRET`: Secret for signing JWTs

---

## 🧪 Testing
- Run unit and e2e tests:

  npm run test
  npm run test:e2e
  ```

---

## 📌 Best Practices
- Sensitive configs in `.env`
- Dynamic TypeORM config
- DTOs and exception filters
- No hardcoded secrets

---

## ✅ Future Improvements
- Role-based access control (more granular)
- Borrowing history
- Swagger/OpenAPI documentation
- More user roles and permissions

---

## 🧑 Author
IMPANO Blessed Winner  
GitHub: [@blessedwinner66](https://github.com/blessedwinner66)  
LinkedIn: IMPANO Blessed Winner

---

## 📝 License
This project is open-source and free to use under the MIT License.
