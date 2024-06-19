// Importing the User and Role models from the models/index module
const { User, Role } = require('../models/index');

// Importing the custom ValidationError class
const ValidationError = require('../utils/validation-error');

// UserRepository class definition
class UserRepository {

    // Asynchronous function to create a new user
    async create(data) {
        try {
            // Creating a new user record using the User model
            const user = await User.create(data);
            return user;
        } catch (error) {
            // Handling Sequelize validation error and throwing a custom ValidationError
            if (error.name == 'SequelizeValidationError') {
                throw new ValidationError(error);
            }
            console.log("Something went wrong on the repository layer");
            throw error;
        }
    }

    // Asynchronous function to delete a user by their ID
    async destroy(userId) {
        try {
            // Deleting a user record based on the provided userId
            await User.destroy({
                where: {
                    id: userId
                }
            });
            return true;
        } catch (error) {
            console.log("Something went wrong on the repository layer");
            throw error;
        }
    }

    // Asynchronous function to retrieve a user by their ID
    async getById(userId) {
        try {
            // Finding a user by their primary key (userId) and specifying attributes to retrieve
            const user = await User.findByPk(userId, {
                attributes: ['email', 'id']
            });
            return user;
        } catch (error) {
            console.log("Something went wrong on the repository layer");
            throw error;
        }
    }

    // Asynchronous function to retrieve a user by their email
    async getByEmail(userEmail) {
        try {
            // Finding a user by their email
            const user = await User.findOne({
                where: {
                    email: userEmail
                }
            });
            return user;
        } catch (error) {
            console.log("Something went wrong on the repository layer");
            throw error;
        }
    }

    // Asynchronous function to check if a user has admin privileges
    async isAdmin(userId) {
        try {
            // Finding a user by their primary key (userId)
            const user = await User.findByPk(userId);

            // Finding the Role with the name 'ADMIN'
            const adminRole = await Role.findOne({
                where: {
                    name: 'ADMIN'
                }
            });

            // Checking if the user has the 'ADMIN' role
            return user.hasRole(adminRole);
        } catch (error) {
            console.log("Something went wrong on the repository layer");
            throw error;
        }
    }
}

// Exporting the UserRepository class for use in other modules
module.exports = UserRepository;
