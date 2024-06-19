// Importing the AirportService from the services module
const { AirportService } = require('../services/index');

// Creating an instance of AirportService
const airportService = new AirportService();

// Controller function to create a new airport
const create = async (req, res) => {
    try {
        // Calling the create method of AirportService to create a new airport
        const response = await airportService.create(req.body);
        // Responding with a success message and the created airport data
        return res.status(201).json({
            message: 'Successfully created the airport',
            err: {},
            data: response,
            success: true
        })
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            err: error,
            message: 'Cannot create a new airport'
        })
    }
}

// Exporting the controller function for use in routes or other modules
module.exports = {
    create
}
