
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
- **Swagger**: API documentation generator.
- **Jest**: For unit and integration testing.
- **Docker**: Containerization for deployment.

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
DATABASE_URL=postgres://<user>:<password>@localhost:5432/book_review
JWT_SECRET=your_jwt_secret
PORT=8080
```

---

### Database Setup

Make sure PostgreSQL is running and execute the following commands to set up the database:

```bash
npx typeorm migration:run
```

---

### Running the Application

Start the server:

```bash
npm run start:dev
```

The API will be available at [http://localhost:8080](http://localhost:8080).
