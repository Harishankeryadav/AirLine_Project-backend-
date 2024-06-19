// Import necessary libraries and modules
const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

// Create an instance of the Express application
const app = express();

// Define the port number for the server to listen on
const PORT = 3005;

// Set up rate limiting middleware to limit the number of requests within a specific time window
const limiter = rateLimit({
    windowMs: 2 * 60 * 1000,  // 2 minutes
    max: 5,  // Maximum of 5 requests per window
});

// Apply rate limiting middleware to the entire application
app.use(limiter);

// Use Morgan for logging HTTP requests
app.use(morgan('combined'));

// Middleware to check authentication before forwarding requests to '/bookingservice'
app.use('/bookingservice', async (req, res, next) => {
    // Log the 'x-access-token' header from the incoming request
    console.log(req.headers['x-access-token']);
    
    try {
        // Send a request to the authentication service to check if the user is authenticated
        const response = await axios.get('http://localhost:3001/api/v1/isAuthenticated', {
            headers: {
                'x-access-token': req.headers['x-access-token'],
            },
        });

        // Log the response data from the authentication service
        console.log(response.data);

        // If the authentication is successful, proceed to the next middleware
        if (response.data.success) {
            next();
        } else {
            // If authentication fails, return a 401 Unauthorized status
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }
    } catch (error) {
        // If an error occurs during the authentication process, return a 500 Internal Server Error status
        return res.status(500).json({
            message: 'Unauthorized',
        });
    }
});

// Proxy middleware to forward requests to the booking service
app.use('/bookingservice', createProxyMiddleware({ target: 'http://localhost:3002/', changeOrigin: true }));

// Route for the '/home' endpoint, returns a JSON response with a message
app.get('/home', (req, res) => {
    return res.json({ message: 'OK' });
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
