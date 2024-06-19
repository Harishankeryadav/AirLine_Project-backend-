// Importing required repositories and utility function
const { FlightRespository, AirplaneRespository } = require('../repository/index');
const { compareTime } = require('../utils/helper');

// FlightService class for handling flight-related operations
class FlightService {

    // Constructor initializes instances of the required repositories
    constructor() {
        this.airplaneRespository = new AirplaneRespository();
        this.flightrespository = new FlightRespository();
    }

    // Method to create a new flight
    async createFlight(data) {
        try {
            // Checking if arrival time is greater than departure time
            if (!compareTime(data.arrivalTime, data.departureTime)) {
                throw { error: 'Arrival time cannot be less than departure time' };
            }

            // Retrieving airplane information based on airplane ID
            const airplane = await this.airplaneRespository.getAirplane(data.airplaneId);

            // Creating a new flight with total seats based on airplane capacity
            const flight = await this.flightrespository.createFlight({
                ...data,
                totalSeats: airplane.capacity,
            });

            return flight;
        } catch (error) {
            console.log("Something went wrong at service layer");
            // Propagate the error to the calling code
            throw { error };
        }
    }

    // Method to get all flight data based on optional filter parameters
    async getAllFlightData(data) {
        try {
            // Retrieving all flights based on filter data
            const flights = await this.flightrespository.getAllFlights(data);
            return flights;
        } catch (error) {
            console.log("Something went wrong at service layer");
            // Propagate the error to the calling code
            throw { error };
        }
    }

    // Method to get flight details by flight ID
    async getFlight(flightId) {
        try {
            // Retrieving flight details based on flight ID
            const flight = await this.flightrespository.getFlight(flightId);
            return flight;
        } catch (error) {
            console.log("Something went wrong at service layer");
            // Propagate the error to the calling code
            throw { error };
        }
    }

    // Method to update flight details based on flight ID and provided data
    async updateFlight(flightId, data) {
        try {
            // Updating flight details based on flight ID and data
            const response = await this.flightrespository.updateFlights(flightId, data);
            return response;
        } catch (error) {
            console.log("Something went wrong at service layer");
            // Propagate the error to the calling code
            throw { error };
        }
    }
}

// Exporting the FlightService class for use in other modules
module.exports = FlightService;

/**
 * {
 *   flightNumber,
 *  airplaneId ,
 *   departureAirportId,
 *   arrivalAirportId,
 *   arrivalTime,
 *   departureTime,
 *   price
 *   totalSeats -> airplane
 * }
 */