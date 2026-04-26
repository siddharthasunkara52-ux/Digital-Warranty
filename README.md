# Digital Warranty Tracker

This is a full-stack web application that helps users manage and track their product warranties in an organized way. The main idea behind this project is to avoid losing warranty details and make it easy to check expiry dates and maintenance records in one place.

## Features

* User authentication (Signup/Login)
* Add, update, and delete products
* Track warranty expiry dates
* Store maintenance records
* Simple dashboard to view all products

## Tech Stack

Frontend: HTML, CSS, JavaScript (React)
Backend: Node.js, Express.js
Database: MongoDB
Tools: Git, GitHub, Postman

## How to Run Locally

1. Clone the repository
   git clone https://github.com/your-username/Digital-Warranty.git
   cd Digital-Warranty

2. Setup Backend
   cd backend
   npm install

Create a `.env` file and add:
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Run backend:
node server.js

3. Setup Frontend
   cd frontend
   npm install
   npm start

## How It Works

Users can create an account and log in. After logging in, they can add product details like purchase date and warranty period. The application stores this data and allows users to track warranty status and maintenance history through a dashboard.

## Why I Built This

I built this project to improve my full-stack development skills and understand how real-world applications handle authentication, APIs, and databases.

## Future Improvements

* Email notifications for expiring warranties
* Better UI/UX design
* File upload for bills and invoices

## Author

Siddhartha
B.Tech CSE Student
