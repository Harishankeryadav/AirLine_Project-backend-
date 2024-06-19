const { StatusCodes } = require('http-status-codes');

// Importing the Booking model from the models/index module
const { Booking } = require('../models/index');

// Importing custom error classes for error handling
const { AppError, ValidationError } = require('../utiles/errors/index');

// BookingRepository class definition
class BookingRepository {
    
    // Asynchronous function to create a booking
    async create(data) {
        try {
            // Creating a new booking record using the Booking model
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            // Handling Sequelize validation errors
            if (error.name === 'SequelizeValidationError') {
                throw new ValidationError(error);
            }

            // Handling other errors and throwing a custom AppError
            throw new AppError(
                'RepositoryError',
                'Cannot create Booking',
                'There was some issue creating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    // Asynchronous function to update a booking
    async update(bookingId, data) {
        try {
            // Finding a booking by its primary key (bookingId)
            const booking = await Booking.findByPk(bookingId);

            // Updating the booking status if present in the provided data
            if (data.status) {
                booking.status = data.status;
            }

            // Saving the updated booking
            await booking.save();
            return booking;
        } catch (error) {
            // Handling errors and throwing a custom AppError
            throw new AppError(
                'RepositoryError',
                'Cannot update Booking',
                'There was some issue updating the booking, please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}

// Exporting the BookingRepository class for use in other modules
module.exports = BookingRepository;
