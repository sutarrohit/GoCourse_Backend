# GoCourse Backend

Welcome to the GoCourse Backend repository! This repository contains the backend code for the GoCourse online course selling platform. The backend is built using Express.js and MongoDB, providing the necessary APIs for user authentication, course management, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication.
- Course creation, editing, and management for instructors.
- Shopping cart functionality.
- Integration with the Stripe payment gateway.
- Secure APIs for frontend interactions.
- User profile management.
- Data storage and retrieval through MongoDB.

## Tech Stack

- Express.js: A fast, minimal, and flexible Node.js web application framework.
- MongoDB: A NoSQL database for efficient data storage.
- Stripe: Integration with the Stripe payment gateway for secure transactions.

## Getting Started

To set up and run the GoCourse Backend locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/GoCourse-Backend.git

3. Install dependencies:
   
    ```bash 
    npm install

5. Configure environment variables:
   Create a .env file based on the provided .env.example.
   ```bash
   NODE_ENV = Change NODE_ENV development or production
  
   PORT = 3001
   DATABASE = Mongodb URL
   JWT_SECRET = Random JWT Secret String
   JWT_EXPIRES_IN = 7d
   JWT_COOKIES_EXPIRES_IN = 90

   GMAIL_USERNAME =  Gmail Address
   GMAIL_PASSWORD =  Gmail Application Password

   STRIP_PUBLISHABLE_KEY=  
   STRIP_SCERET_KEY= 

   CLIENT_DOMAIN = Frontend Client URL

6. Start the server:
    ```bash
   npm run dev

 ## Contributing:
- If you would like to contribute to the project, please fork the repository and submit a pull request with your changes

## License:
- This project is licensed under the MIT License.    

