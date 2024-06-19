// Importing the HTTP status codes module for handling response statuses
const { StatusCodes } = require('http-status-codes');

// Importing BookingService class from the service/index module
const { BookingService } = require('../service/index');

// Importing utility functions for message queue operations
const { createChannel, publishMessage } = require('../utiles/messageQueue');

// Importing a binding key from the server configuration
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');

// Creating an instance of the BookingService class
const bookingService = new BookingService();

// BookingController class definition
class BookingController {

    // Constructor for the BookingController class
    constructor() {
    }

    // Asynchronous function to send a message to the message queue
    async sendMessageToQueue(req, res) {
        // Creating a channel for message queue communication
        const channel = await createChannel();
        
        // Sample data to be sent to the message queue
        const data = { message: 'Success' };

        // Publishing the message to the message queue with a binding key
        publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(data));

        // Returning a successful response to the client
        return res.status(200).json({
            message: 'Successfully published the event'
        });
    }

    // Asynchronous function to handle the creation of a booking
    async create(req, res) {
        try {
            // Attempting to create a booking using the BookingService
            const response = await bookingService.createBooking(req.body);

            // Logging the response from the booking service
            console.log("FROM BOOKING CONTROLLER", response);

            // Returning a successful response to the client with booking details
            return res.status(StatusCodes.OK).json({
                message: 'Successfully completed booking',
                success: true,
                err: {},
                data: response
            })
        } catch (error) {
            // Handling errors and returning an error response to the client
            return res.status(error.statusCode).json({
                message: error.message,
                success: false,
                err: error.explanation,
                data: {}
            });
        }
    }
}

// Exporting the BookingController class for use in other modules
module.exports = BookingController;
