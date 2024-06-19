// Importing Sequelize's 'Op' for advanced query operations
const { Op } = require('sequelize');

// Importing the 'City' model from the models directory
const { City } = require('../models/index');

// Repository class for handling database operations related to cities
class CityRepository {
    // Method to create a new city in the database
    async createCity({ name }) {
        try {
            // Checking if the 'name' property is provided
            if (!name) {
                throw new Error("name is required.");
            }
            
            // Creating a new city record in the 'City' table
            const city = await City.create({
                name: name
            });
            return city;
        } catch (error) {
            // Logging and throwing an error if any issue occurs during city creation
            console.error("Error creating city:", error);
            throw error;
        }
    }

    // Method to delete a city from the database based on its ID
    async deleteCity(cityId) {
        try {
            // Deleting the city record from the 'City' table
            await City.destroy({
                where: {
                    id: cityId
                }
            });
            return true;
        } catch (error) {
            // Logging and throwing an error if any issue occurs during city deletion
            console.error("Error deleting city:", error);
            throw error;
        }
    }

    // Method to update a city in the database based on its ID
    async updateCity(cityId, data) {
        try {
            // Fetching the city by its ID
            const city = await City.findByPk(cityId);

            // Updating the 'name' property of the city with the new data
            city.name = data.name;

            // Saving the changes to the database
            await city.save();
            return city;
        } catch (error) {
            // Logging and throwing an error if any issue occurs during city update
            console.error("Error updating city:", error);
            throw error;
        }
    }

    // Method to fetch a city from the database based on its ID
    async getCity(cityId) {
        try {
            // Fetching the city by its ID
            const city = await City.findByPk(cityId);
            return city;
        } catch (error) {
            // Logging and throwing an error if any issue occurs during city retrieval
            console.error("Error fetching city:", error);
            throw error;
        }
    }

    // Method to fetch all cities from the database with optional filtering
    async getAllCities(filter) {
        try {
            // Checking if a 'name' filter is provided
            if (filter && filter.name) {
                // Fetching cities that start with the provided 'name'
                const cities = await City.findAll({
                    where: {
                        name: {
                            [Op.startsWith]: filter.name
                        }
                    }
                });
                return cities;
            }

            // Fetching all cities if no filter is provided
            const cities = await City.findAll();
            return cities;
        } catch (error) {
            // Logging and throwing an error if any issue occurs during city retrieval
            console.log("Something went wrong in the repository layer");
            throw { error };
        }
    }
}

// Exporting the CityRepository class for use in other modules
module.exports = CityRepository;
