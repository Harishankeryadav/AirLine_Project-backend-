// Importing custom error codes for client errors
const { ClientErrorCodes } = require('../utils/error_codes');

// Middleware function to validate the request body for creating a flight
const validateCreateFlight = (req, res, next) => {
    // Checking if any mandatory property in the request body is missing
    if (
        !req.body.flightNumber ||
        !req.body.airplaneId ||
        !req.body.departureAirportId ||
        !req.body.arrivalAirportId ||
        !req.body.arrivalTime ||
        !req.body.departureTime ||
        !req.body.price
    ) {
        // Responding with a client error status code and a descriptive error message
        return res.status(ClientErrorCodes.BAD_REQUEST).json({
            data: {},
            success: false,
            message: 'Invalid request body for create flight',
            err: 'Missing mandatory properties to create a flight'
        });
    }

    // If all mandatory properties are present, proceed to the next middleware or route handler
    next();
}

// Exporting the middleware function for use in routes or other modules
module.exports = {
    validateCreateFlight,
}
