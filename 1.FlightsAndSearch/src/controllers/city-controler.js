// Importing the CityService from the services module
const { CityService } = require('../services/index');

// Creating an instance of CityService
const cityService = new CityService();

// Controller function to create a new city
const create = async (req, res) => {
    try {
        // Calling the createCity method of CityService to create a new city
        const city = await cityService.createCity(req.body);
        // Responding with a success message and the created city data
        return res.status(201).json({
            data: city,
            success: true,
            message: 'Successfully created a city',
            err: {}
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to create a city- City-controller',
            err: error
        });
    }
}

// Controller function to delete a city by ID
const destroy = async (req, res) => {
    try {
        // Calling the deleteCity method of CityService to delete a city by ID
        const response = await cityService.deleteCity(req.params.id);
        // Responding with a success message and the response data
        return res.status(200).json({
            data: response,
            success: true,
            message: 'Successfully deleted the city',
            err: {}
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to delete the city- City-controller',
            err: error
        });
    }
}

// Controller function to get a city by ID
const get = async (req, res) => {
    try {
        // Calling the getCity method of CityService to fetch a city by ID
        const response = await cityService.getCity(req.params.id);
        // Responding with a success message and the fetched city data
        return res.status(200).json({
            data: response,
            success: true,
            message: 'Successfully fetched the city',
            err: {}
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to get the city- City-controller',
            err: error
        });
    }
}

// Controller function to update a city by ID
const update = async (req, res) => {
    try {
        // Calling the updateCity method of CityService to update a city by ID
        const response = await cityService.updateCity(req.params.id, req.body);
        // Responding with a success message and the updated city data
        return res.status(200).json({
            data: response,
            success: true,
            message: 'Successfully updated the city',
            err: {}
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to update the city- City-controller',
            err: error
        });
    }
}

// Controller function to get all cities
const getAll = async (req, res) => {
    try {
        // Calling the getAllCities method of CityService to fetch all cities
        const cities = await cityService.getAllCities(req.query);
        // Responding with a success message and the fetched cities data
        return res.status(200).json({
            data: cities,
            success: true,
            message: 'Successfully fetched all cities',
            err: {}
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: 'Not able to fetch the cities',
            err: error
        });
    }
}

// Exporting the controller functions for use in routes or other modules
module.exports = {
    create,
    destroy,
    get,
    update,
    getAll
}
