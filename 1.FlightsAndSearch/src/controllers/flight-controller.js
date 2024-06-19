// Importing the FlightService from the services module
const { FlightService } = require('../services/index');
// Importing success codes for HTTP responses
const { SuccessCodes } = require('../utils/error_codes');

// Creating an instance of FlightService
const flightService = new FlightService();

// Controller function to create a new flight
const create = async (req, res) => {
    try {
        // Extracting necessary data from the request body
        const flightRequestData = {
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            departureAirportId: req.body.departureAirportId,
            arrivalAirportId: req.body.arrivalAirportId,
            arrivalTime: req.body.arrivalTime,
            departureTime: req.body.departureTime,
            price: req.body.price
        };
        // Calling the createFlight method of FlightService to create a new flight
        const flight = await flightService.createFlight(flightRequestData);
        // Responding with a success message and the created flight data
        return res.status(SuccessCodes.CREATED).json({
            data: flight,
            success: true,
            err: {},
            message: 'Successfully created a flight'
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to create a flight',
            err: error
        });
    }
}

// Controller function to fetch all flights
const getAll = async (req, res) => {
    try {
        // Logging the query parameters from the request
        console.log(req.query);
        // Calling the getAllFlightData method of FlightService to fetch all flights
        const response = await flightService.getAllFlightData(req.query);
        // Responding with a success message and the fetched flights data
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            err: {},
            message: 'Successfully fetched the flights'
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to fetch the flights',
            err: error
        });
    }
}

// Controller function to fetch a specific flight by ID
const get = async (req, res) => {
    try {
        // Calling the getFlight method of FlightService to fetch a specific flight by ID
        const response = await flightService.getFlight(req.params.id);
        // Responding with a success message and the fetched flight data
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            err: {},
            message: 'Successfully fetched the flight'
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to fetch the flight',
            err: error
        });
    }
}

// Controller function to update a specific flight by ID
const update = async (req, res) => {
    try {
        // Calling the updateFlight method of FlightService to update a specific flight by ID
        const response = await flightService.updateFlight(req.params.id, req.body);
        // Responding with a success message and the updated flight data
        return res.status(SuccessCodes.OK).json({
            data: response,
            success: true,
            err: {},
            message: 'Successfully updated the flight'
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to update the flight',
            err: error
        });
    }
}

// Exporting the controller functions for use in routes or other modules
module.exports = {
    create,
    getAll,
    get,
    update
}
