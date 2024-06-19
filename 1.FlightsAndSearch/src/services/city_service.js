// Importing the CityRepository from the repository/index module
const { CityRepository } = require('../repository/index');

// Service class for handling City-related operations
class CityService {
    // Constructor to initialize the CityRepository
    constructor() {
        this.cityRepository = new CityRepository();
    }

    // Method to create a new city
    async createCity(data) {
        try {
            // Calling the createCity method from the repository to create a new city
            const city = await this.cityRepository.createCity(data);
            return city;
        } catch (error) {
            console.log("Something went wrong in city service layer in createCity");
            // Propagate the error to the calling code
            throw { error };
        }
    }

    // Method to delete a city by its ID
    async deleteCity(cityId) {
        try {
            // Calling the deleteCity method from the repository to delete a city
            const response = await this.cityRepository.deleteCity(cityId);
            return response;
        } catch (error) {
            console.log("Something went wrong in city service layer in deleteCity");
            // Propagate the error to the calling code
            throw { error };
        }
    }

    // Method to update a city by its ID and provided data
    async updateCity(cityId, data) {
        try {
            // Calling the updateCity method from the repository to update a city
            const city = await this.cityRepository.updateCity(cityId, data);
            return city;
        } catch (error) {
            console.log("Something went wrong in city service layer in updateCity");
            // Propagate the error to the calling code
            throw { error };
        }
    }

    // Method to get a city by its ID
    async getCity(cityId) {
        try {
            // Calling the getCity method from the repository to get a city
            const city = await this.cityRepository.getCity(cityId);
            return city;
        } catch (error) {
            console.log("Something went wrong in city service layer in getCity");
            // Propagate the error to the calling code
            throw { error };
        }
    }

    // Method to get all cities based on the provided filter (by name)
    async getAllCities(filter) {
        try {
            // Calling the getAllCities method from the repository to get all cities
            const cities = await this.cityRepository.getAllCities({ name: filter.name });
            return cities;
        } catch (error) {
            console.log("Something went wrong at the service layer");
            // Propagate the error to the calling code
            throw { error };
        }
    }
}

// Exporting the CityService class for use in other modules
module.exports = CityService;
