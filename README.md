# 📚 Nest-Books (Book Management API [NestJS + MySQL])

This is a modular and scalable **Book Management System** built with [NestJS](https://nestjs.com/), using **TypeORM**, **MySQL**, and **.env** configuration for environment management. The system supports book and user modules, ready for secure authentication and CRUD operations.

---

## 🚀 Features

- 🔁 Full Book CRUD (Create, Read, Update, Delete)
- 👤 User module integrated
- ⚙️ Environment variables via `.env`
- 💾 MySQL database with TypeORM
- 📦 Modular NestJS architecture
- ✅ Scalable structure (ready for auth, filters, DTOs)
- ✅ JWT Authentication

---

## 📁 Project Structure

src/
├── app.module.ts
├── main.ts
├── books/
│ ├── books.controller.ts
│ ├── books.module.ts
│ ├── books.service.ts
│ └── entities/book.entity.ts
├── user/
│ ├── user.controller.ts
│ ├── user.module.ts
│ ├── user.service.ts
│ └── user.entity.ts



---

## 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/Nest-Books.git
cd book-management-api

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env
# Then edit the .env file with your DB credentials

# 4. Run the app
npm run start:dev
⚙️ .env Configuration
Create a .env file in the root with the following structure:

env
Copy
Edit
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=yourPassword
DB_NAME=books_auth
PORT=3000
✅ @nestjs/config is used to load these variables globally.

🛠️ Technologies Used
NestJS - Main framework

TypeORM - ORM for MySQL

MySQL - Database

@nestjs/config - Environment management

DTOs, Exception Filters - Best practices applied

🧠 How It Works
.env is loaded using @nestjs/config.

TypeOrmModule.forRootAsync() reads DB config from ConfigService.

Book and User entities are mapped to DB tables.

Modular design (BooksModule, UserModule) makes the system scalable.

🗃️ Database Schema (Example)
books table:

id (PK)

title

author

description

publishedDate

users table:

id (PK)

username

email

password

You can easily extend with authentication, borrowing system, etc.


📌 Best Practices Followed
.env used to store sensitive configs

forRootAsync for dynamic TypeORM configuration

DTOs and exception filters ready to be added

No hardcoded secrets or credentials

✅ Future Features

🔐 Role-based access control

🛒 Borrowing history

🧾 Swagger documentation

🧑 Author
IMPANO Blessed Winner
GitHub: @blessedwinner66
LinkedIn: IMPANO Blessed Winner

📝 License
This project is open-source and free to use under the MIT License.
