
# Book Review App – Backend

This is the **backend** of the Book Review App, built with **NestJS**. It provides RESTful APIs for user authentication, book reviews, and admin functionalities to manage books and users.

---

## Features

- **User Authentication**: Supports login and session management.
- **Book Reviews API**: Endpoints to create, retrieve, update, and delete book reviews.
- **Admin Management**: Admins can manage users and books through API endpoints.
- **Database Integration**: Uses PostgreSQL for data persistence.
- **API Documentation**: Built-in Swagger documentation.
- **Custom API Client Compatibility**: Designed to work with the frontend's custom API client.

---

## Technologies Used

- **NestJS**: Backend framework for building scalable applications.
- **TypeORM**: ORM for database interactions.
- **PostgreSQL**: Relational database for persistent storage.
---

## Project Setup (Run Locally)

Follow these steps to set up the backend on your machine.

### Prerequisites

- **Node.js**: Version 18.x or higher
- **PostgreSQL**: Database instance running locally or in the cloud
- **Docker**: (Optional) If you prefer containerization
- **npm** or **yarn**: Node package managers

---

### Clone the Repository

```bash
git clone <repository-url>
cd book_review/backend
```

---

### Install Dependencies

```bash
npm install
```

---

### Environment Variables

Create a `.env` file at the root of the project with the following content:

```bash
DB_HOST='localhost',
DB_PORT=5432,
DB_USERNAME='postgres',
DB_PASSWORD='password',
DB_DATABASE='book_reviews',
JWT_SECRET='your_jwt_secret'
PORT=8080
```

---

### Database Setup

Make sure PostgreSQL is running as a docker container or any where in the cloud

Below commands are useful for running migration scripts

Create Migration for all current entities
```bash
npx typeorm migration:generate -n CreateTables
```

Execute the created migrations

```bash
npx typeorm migration:run
```

Note: Please be informed that current setup not using migration scripts. 
However can enable with slight changes in data-source.ts file as follows.

```ts
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'book_reviews',
  entities: [User, Book, Review],
  synchronize: false, 
  migrations: ["dist/migrations/*.js"],
  logging: false,
});
```

---

### Running the Application

Start the server:

```bash
npm run start:dev
```

The API will be available at [http://localhost:8080](http://localhost:8080).
