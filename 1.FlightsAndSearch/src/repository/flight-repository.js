const { Flights } = require('../models/index');
const { Op } = require('sequelize');

// Repository class for handling Flight-related database operations
class FlightRepository {

    // Private method to create a filter based on the provided data for fetching flights
    #createFilter(data) {
        let filter = {};
        if (data.arrivalAirportId) {
            filter.arrivalAirportId = data.arrivalAirportId;
        }
        if (data.departureAirportId) {
            filter.departureAirportId = data.departureAirportId;
        }

        // if(data.minPrice && data.maxPrice) {
        //     Object.assign(filter, {
        //         [Op.and]: [
        //             { price: {[Op.lte]: data.maxPrice} }, 
        //             { price: {[Op.gte]: data.minPrice} }
        //         ]
        //     })
        // }
        // Adding filters for price range if minPrice or maxPrice is present in the data
        let priceFilter = [];
        if (data.minPrice) {
            // Object.assign(filter, {price: {[Op.gte]: data.minPrice}});
            priceFilter.push({ price: { [Op.gte]: data.minPrice } });
        }
        if (data.maxPrice) {
            // Object.assign(filter, {price: {[Op.lte]: data.maxPrice}});
            priceFilter.push({ price: { [Op.lte]: data.maxPrice } });
        }
        Object.assign(filter, { [Op.and]: priceFilter });
        // Object.assign(filter, {[Op.and]: [{ price: {[Op.lte]: 7000} }, { price: {[Op.gte]: 4000} }]})
        // Logging the final filter object
        console.log(filter);
        return filter;
    }

    // Method to create a new flight record in the database
    async createFlight(data) {
        try {
            const flight = await Flights.create(data);
            return flight;
        } catch (error) {
            console.log("Something went wrong in the repository layer during createFlight");
            throw { error };
        }
    }

    // Method to fetch a single flight record based on its ID
    async getFlight(flightId) {
        try {
            const flight = await Flights.findByPk(flightId);
            return flight;
        } catch (error) {
            console.log("Something went wrong in the repository layer during getFlight");
            throw { error };
        }
    }

    // Method to fetch all flights based on the provided filter
    async getAllFlights(filter) {
        try {
            // Creating a filter object using the private #createFilter method
            const filterObject = this.#createFilter(filter);
            // Fetching flights from the database using the created filter
            const flights = await Flights.findAll({
                where: filterObject
            });
            return flights;
        } catch (error) {
            console.log("Something went wrong in the repository layer during getAllFlights");
            throw { error };
        }
    }

    // Method to update a flight record based on its ID and provided data
    async updateFlights(flightId, data) {
        try {
            // Updating the flight record in the database
            await Flights.update(data, {
                where: {
                    id: flightId
                }
            });
            return true; // Returning 'true' to indicate successful update
        } catch (error) {
            console.log("Something went wrong in the repository layer during updateFlights");
            throw { error };
        }
    }
}

// Exporting the FlightRepository class for use in other modules
module.exports = FlightRepository;
/*
{
    where: {}
}

*/