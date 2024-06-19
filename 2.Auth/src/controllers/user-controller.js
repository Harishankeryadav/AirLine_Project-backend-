// Importing necessary modules and services
const { response } = require('express');
const UserService = require('../services/user-service');

// Creating an instance of the UserService
const userService = new UserService();

// Controller function to create a new user
const create = async (req, res) => {
    try {
        // Calling the create method of UserService to create a new user
        const response = await userService.create({
            email: req.body.email,
            password: req.body.password
        });
        // Responding with a success message and the created user data
        return res.status(201).json({
            success: true,
            message: 'Successfully created a new user',
            data: response,
            err: {}
        });
    } catch (error) {
        // Handling errors and responding with an error message
        return res.status(error.statusCode).json({
            message: error.message,
            data: {},
            success: false,
            err: error.explanation
        });
    }
}

// Controller function to handle user sign-in
const signIn = async (req, res) => {
    try {
        // Calling the signIn method of UserService to authenticate the user
        const response = await userService.signIn(req.body.email, req.body.password);
        // Responding with a success message and the user's authentication token
        return res.status(200).json({
            success: true,
            data: response,
            err: {},
            message: 'Successfully signed in'
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in sign-in controller',
            data: {},
            success: false,
            err: error
        });
    }
}

// Controller function to check if a user is authenticated using a token
const isAuthenticated = async (req, res) => {
    try {
        // Extracting the token from the request headers
        const token = req.headers['x-access-token'];
        // Calling the isAuthenticated method of UserService to verify the token
        const response = await userService.isAuthenticated(token);
        // Responding with a success message if the user is authenticated
        return res.status(200).json({
            success: true,
            err: {},
            data: response,
            message: 'User is authenticated and token is valid'
        });
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in isAuthenticated controller',
            data: {},
            success: false,
            err: error
        });
    }
}

// Controller function to check if a user has admin privileges
const isAdmin = async(req, res) => {
    try {
        // Calling the isAdmin method of UserService to check if the user is an admin
        const response = await userService.isAdmin(req.body.id);
        // Responding with a success message and whether the user is an admin or not
        return res.status(200).json({
            data: response,
            err: {},
            success: true,
            message: 'Successfully fetched whether user is an admin or not'
        })
    } catch (error) {
        // Handling errors and responding with an error message
        console.log(error);
        return res.status(500).json({
            message: 'Something went wrong in isAdmin controller',
            data: {},
            success: false,
            err: error
        });
    }
}

// Exporting the controller functions for use in routes or other modules
module.exports = {
    create,
    signIn,
    isAuthenticated,
    isAdmin
}
