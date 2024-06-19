// Middleware function to validate user authentication request
const validateUserAuth = (req, res, next) => {
    // Checking if email or password is missing in the request body
    if (!req.body.email || !req.body.password) {
        // Responding with a 400 Bad Request status and an error message
        return res.status(400).json({
            success: false,
            data: {},
            message: 'Something went wrong',
            err: 'Email or password missing in the request'
        });
    }
    // If validation passes, proceed to the next middleware or route handler
    next();
}

// Middleware function to validate if the request is from an admin
const validateIsAdminRequest = (req, res, next) => {
    // Checking if the user id is missing in the request body
    if (!req.body.id) {
        // Responding with a 400 Bad Request status and an error message
        return res.status(400).json({
            success: false,
            data: {},
            err: 'User id not given',
            message: 'Something went wrong'
        })
    }
    // If validation passes, proceed to the next middleware or route handler
    next();
}

// Exporting the middleware functions for use in other modules
module.exports = {
    validateUserAuth,
    validateIsAdminRequest
}
