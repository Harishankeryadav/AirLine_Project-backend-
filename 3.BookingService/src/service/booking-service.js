// Importing the axios library for making HTTP requests
const axios = require('axios');

// Importing the BookingRepository class from the repository/index module
const { BookingRepository } = require('../repository/index');

// Importing a constant for the flight service path from the server configuration
const { FLIGHT_SERVICE_PATH } = require('../config/serverConfig');

// Importing a custom error class for service-related errors
const { ServiceError } = require('../utiles/errors');

// BookingService class definition
class BookingService {
    constructor() {
        // Creating an instance of the BookingRepository class
        this.bookingRepository = new BookingRepository();
    }

    // Asynchronous function to handle the creation of a booking
    async createBooking(data) {
        try {
            // Extracting the flightId from the provided data
            const flightId = data.flightId;

            // Constructing the URL to get flight details from the flight service
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;

            // Making an HTTP GET request to the flight service to get flight details
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;

            // Checking if there are sufficient seats available for the booking
            if (data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError('Insufficient seats in the flight');
            }

            // Calculating the total cost of the booking
            const totalCost = flightData.price * data.noOfSeats;

            // Creating a payload for booking creation with updated totalCost
            const bookingPayload = { ...data, totalCost };

            // Creating a booking using the BookingRepository
            const booking = await this.bookingRepository.create(bookingPayload);

            // Constructing the URL to update flight details after the booking
            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            console.log(updateFlightRequestURL);

            // Making an HTTP PATCH request to the flight service to update totalSeats
            await axios.patch(updateFlightRequestURL, { totalSeats: flightData.totalSeats - booking.noOfSeats });

            // Updating the status of the booking to "Booked" using BookingRepository
            const finalBooking = await this.bookingRepository.update(booking.id, { status: "Booked" });

            // Returning the final booking details
            return finalBooking;
        } catch (error) {
            // Logging the error for debugging purposes
            console.error(error);

            // Handling specific errors and rethrowing a ServiceError for generic errors
            if (error.name === 'RepositoryError' || error.name === 'ValidationError') {
                throw error;
            }
            throw new ServiceError();
        }
    }
}

// Exporting the BookingService class for use in other modules
module.exports = BookingService;
