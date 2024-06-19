// A generic CRUD repository class for handling common database operations
class CrudRepository {
    // Constructor function takes a 'model' parameter representing the Sequelize model for the repository
    constructor(model) {
        this.model = model;
    }

    // Method to create a new record in the associated model
    async create(data) {
        try {
            // Using the 'create' method of the model to add a new record to the database
            const result = await this.model.create(data);
            return result;
        } catch (error) {
            // Logging and rethrowing the error if something goes wrong during the 'create' operation
            console.log("Something went wrong in CrudRepository during create operation");
            throw error;
        }
    }

    // Method to delete a record from the associated model based on its ID
    async destroy(modelId) {
        try {
            // Using the 'destroy' method of the model to remove a record from the database
            const result = await this.model.destroy({
                where: {
                    id: modelId
                }
            });
            return true; // Returning 'true' to indicate successful deletion
        } catch (error) {
            // Logging and rethrowing the error if something goes wrong during the 'destroy' operation
            console.log("Something went wrong in CrudRepository during destroy operation");
            throw error;
        }
    }

    // Method to fetch a single record from the associated model based on its ID
    async get(modelId) {
        try {
            // Using the 'findByPk' method of the model to retrieve a record by its primary key
            const result = await this.model.findByPk(modelId);
            return result;
        } catch (error) {
            // Logging and rethrowing the error if something goes wrong during the 'get' operation
            console.log("Something went wrong in CrudRepository during get operation");
            throw error;
        }
    }

    // Method to fetch all records from the associated model
    async getAll() {
        try {
            // Using the 'findAll' method of the model to retrieve all records
            const result = await this.model.findAll();
            return result;
        } catch (error) {
            // Logging and rethrowing the error if something goes wrong during the 'getAll' operation
            console.log("Something went wrong in CrudRepository during getAll operation");
            throw error;
        }
    }

    // Method to update a record in the associated model based on its ID and provided data
    async update(modelId, data) {
        try {
            // Using the 'update' method of the model to modify a record in the database
            const result = await this.model.update(data, {
                where: {
                    id: modelId
                }
            });
            return result;
        } catch (error) {
            // Logging and rethrowing the error if something goes wrong during the 'update' operation
            console.log("Something went wrong in CrudRepository during update operation");
            throw error;
        }
    }
}

// Exporting the CrudRepository class for use in other modules
module.exports = CrudRepository;
