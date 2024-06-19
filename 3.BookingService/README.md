<!-- ticket booking -->

Flight Booking System
The Flight Booking System is a Node.js application that allows users to create bookings for flights, interacting with a message broker for event notifications and a flight service for obtaining and updating flight details.

Table of Contents
Installation
Usage
Components
Booking Controller
Booking Repository
Booking Service
Message Queue Utilities
Configuration
Error Handling
Dependencies
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/flight-booking-system.git
Install dependencies:

bash
Copy code
cd flight-booking-system
npm install
Set up the configuration:

Copy the config/sample-serverConfig.js file to config/serverConfig.js and update the necessary configuration parameters.

Usage
Run the application:

bash
Copy code
npm start
The application will be accessible at http://localhost:3000.

Components
Booking Controller
The BookingController handles HTTP requests related to booking operations. It includes functionality to create bookings and send messages to a message queue for event notifications.

Booking Repository
The BookingRepository interacts with the database (Sequelize ORM) to perform CRUD operations on bookings. It includes methods for creating and updating bookings.

Booking Service
The BookingService orchestrates the booking process, interacting with the BookingRepository and external services (flight service) to create and update bookings. It also handles error scenarios.

Message Queue Utilities
The messageQueue module provides utility functions for interacting with a message broker (RabbitMQ). It includes functions to create a channel, subscribe to messages, and publish messages.

Configuration
Configuration parameters, such as the message broker URL, exchange name, and service paths, can be customized in the config/serverConfig.js file.

Error Handling
The application handles errors using custom error classes (AppError, ValidationError, ServiceError) and provides appropriate error messages for debugging and user feedback.

Dependencies
axios: For making HTTP requests
amqplib: For interacting with RabbitMQ
sequelize: For database interactions (ORM)
http-status-codes: For standardized HTTP status codes
