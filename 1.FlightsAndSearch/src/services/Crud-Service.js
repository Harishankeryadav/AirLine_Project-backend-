// Service class for handling CRUD operations using a given repository
class CrudService {
    // Constructor that takes a repository as a parameter
    constructor(repository) {
        this.repository = repository;
    }

    // Method to create a new entity using the repository's create method
    async create(data) {
        try {
            const response = await this.repository.create(data);
            return response;
        } catch (error) {
            console.log("something went wrong in crud service");
            // Propagate the error to the calling code
            throw error;
        }
    }

    // Method to delete an entity by its ID using the repository's destroy method
    async destroy(id) {
        try {
            const response = await this.repository.destroy(id);
            return response;
        } catch (error) {
            console.log("something went wrong in crud service");
            // Propagate the error to the calling code
            throw error;
        }
    }

    // Method to get an entity by its ID using the repository's get method
    async get(id) {
        try {
            const response = await this.repository.get(id);
            return response;
        } catch (error) {
            console.log("something went wrong in crud service");
            // Propagate the error to the calling code
            throw error;
        }
    }

    // Method to get all entities using the repository's getAll method
    async getAll() {
        try {
            const response = await this.repository.getAll();
            return response;
        } catch (error) {
            console.log("something went wrong in crud service");
            // Propagate the error to the calling code
            throw error;
        }
    }

    // Method to update an entity by its ID and provided data using the repository's update method
    async update(id, data) {
        try {
            const response = await this.repository.update(id, data);
            return response;
        } catch (error) {
            console.log("something went wrong in crud service");
            // Propagate the error to the calling code
            throw error;
        }
    }
}

// Exporting the CrudService class for use in other modules
module.exports = CrudService;
