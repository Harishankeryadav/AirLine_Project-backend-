// Importing necessary libraries and modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Importing the UserRepository class
const UserRepository = require('../repository/user-repository');

// Importing the JWT_KEY from the server configuration
const { JWT_KEY } = require('../config/serverConfig');

// Importing custom error handler module
const AppErrors = require('../utils/error-handler');

// UserService class definition
class UserService {
    // Constructor initializes the UserRepository instance
    constructor() {
        this.userRepository = new UserRepository();
    }

    // Asynchronous function to create a new user
    async create(data) {
        try {
            // Calling UserRepository to create a new user
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            // Handling Sequelize validation error
            if (error.name == 'SequelizeValidationError') {
                throw error;
            }
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    // Asynchronous function to handle user sign-in
    async signIn(email, plainPassword) {
        try {
            // Step 1: Fetch the user using the provided email
            const user = await this.userRepository.getByEmail(email);

            // Step 2: Compare the incoming plain password with the stored encrypted password
            const passwordsMatch = this.checkPassword(plainPassword, user.password);

            if (!passwordsMatch) {
                console.log("Password doesn't match");
                throw { error: 'Incorrect password' };
            }

            // Step 3: If passwords match, create a token and return it
            const newJWT = this.createToken({ email: user.email, id: user.id });
            return newJWT;
        } catch (error) {
            console.log("Something went wrong in the sign-in process");
            throw error;
        }
    }

    // Asynchronous function to authenticate a user using a JWT token
    async isAuthenticated(token) {
        try {
            // Verify the token and get the decoded user information
            const response = this.verifyToken(token);

            if (!response) {
                throw { error: 'Invalid token' };
            }

            // Retrieve the user based on the decoded user information
            const user = await this.userRepository.getById(response.id);

            if (!user) {
                throw { error: 'No user with the corresponding token exists' };
            }

            // Return the user ID if authenticated
            return user.id;
        } catch (error) {
            console.log("Something went wrong in the authentication process");
            throw error;
        }
    }

    // Function to create a JWT token for a user
    createToken(user) {
        try {
            // Sign the user information with the JWT_KEY and set an expiration time
            const result = jwt.sign(user, JWT_KEY, { expiresIn: '1h' });
            return result;
        } catch (error) {
            console.log("Something went wrong in token creation");
            throw error;
        }
    }

    // Function to verify the validity of a JWT token
    verifyToken(token) {
        try {
            // Verify the token using the JWT_KEY and return the decoded information
            const response = jwt.verify(token, JWT_KEY);
            return response;
        } catch (error) {
            console.log("Something went wrong in token validation", error);
            throw error;
        }
    }

    // Function to check if a user's plain password matches the stored encrypted password
    checkPassword(userInputPlainPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
        } catch (error) {
            console.log("Something went wrong in password comparison");
            throw error;
        }
    }

    // Function to check if a user has admin privileges
    isAdmin(userId) {
        try {
            // Check if the user with the provided ID has admin privileges
            return this.userRepository.isAdmin(userId);
        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }
}

// Exporting the UserService class for use in other modules
module.exports = UserService;
