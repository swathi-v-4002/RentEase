# RentEase - MERN Rental Marketplace 🚀

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

RentEase is a full-stack web application built with the MERN stack. It provides a platform for users to list their items for rent and to rent items from other users. This project demonstrates a complete user flow from registration and authentication to creating and managing rentals.

## ✨ Features

- **User Authentication:** Secure user registration and login system using JSON Web Tokens (JWT).
- **Item Listings:** Authenticated users can create, view, and delete their own rental listings.
- **Rental System:** Users can rent available items, which updates the item's status across the application.
- **Personal Dashboard:** A dedicated "My Rentals" page for users to view and manage items they have currently rented.
- **Cancel Rentals:** Users can cancel their rentals, which makes the item available again for others.
- **Protected Routes:** Backend API and frontend routes are protected to ensure only authenticated and authorized users can perform certain actions.
- **Modern UI:** A clean, responsive, and intuitive user interface built with React and styled with modern CSS.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT & bcryptjs

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (local installation or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/your-username/rentease.git](https://github.com/your-username/rentease.git)
    cd rentease
    ```

2.  **Setup the Backend:**

    ```bash
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Create a .env file in the /server directory
    # and add the following variables:
    ```

    **.env Example:**

    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_strong_secret_key_for_jwt
    PORT=5000
    ```

    ```bash
    # Start the backend server
    npm start
    ```

    The server will be running on `http://localhost:5000`.

3.  **Setup the Frontend:**

    ```bash
    # Open a new terminal and navigate to the client directory
    cd client

    # Install dependencies
    npm install

    # Start the frontend development server
    npm run dev
    ```

    The React application will be running on `http://localhost:5173` (or another available port).

---

## 📸 Screenshots

---

## 📝 API Endpoints

A brief overview of the core API routes.

| Method   | Endpoint                 | Description                      | Access  |
| :------- | :----------------------- | :------------------------------- | :------ |
| `POST`   | `/api/users/register`    | Register a new user              | Public  |
| `POST`   | `/api/users/login`       | Authenticate a user & get token  | Public  |
| `GET`    | `/api/items`             | Get all item listings            | Public  |
| `POST`   | `/api/items`             | Create a new item listing        | Private |
| `DELETE` | `/api/items/:id`         | Delete an item owned by the user | Private |
| `POST`   | `/api/rentals`           | Rent an item                     | Private |
| `GET`    | `/api/rentals/myrentals` | Get rentals for the current user | Private |
| `DELETE` | `/api/rentals/:id`       | Cancel a rental                  | Private |
