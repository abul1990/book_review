
# Book Review App – Frontend

This is the **frontend** of the Book Review App, built with **Next.js**. It provides a smooth user experience for browsing, reviewing books, and offers an admin page to manage books and users.

---

## Features

- **Responsive UI**: Adaptable to different screen sizes.
- **User Reviews**: Users can browse and submit reviews for books.
- **Admin Management**: Admins can manage books from a dedicated page.
- **Custom State Management**: Uses a store for maintaining state across the application.
- **API Integration**: Interacts with the backend via a custom API client.

---

## Project Setup (Run Locally)

Follow these steps to run the project locally on your machine.

### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Node package managers

---

### Clone the Repository

```bash
git clone <repository-url>
cd book_review/frontend
```

---

### Install Dependencies

Use either **npm** or **yarn** to install the project dependencies.

```bash
npm install
```

---

### Environment Variables

Create a `.env.local` file at the root of the project with the following content:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```
Replace the url with actual backend API url

---

### Running the Application

Start the development server:

```bash
npm run dev
```

Open the app in your browser at [http://localhost:3000](http://localhost:3000).

---
