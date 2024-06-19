// Importing the TicketService for handling email notifications
const TicketService = require('../services/email-service');

// Controller method for creating an email reminder
const create = async (req, res) => {
    try {
        // Calling the createNotification method from the TicketService
        const response = await TicketService.createNotification(req.body);

        // Responding with a success message and the created response data
        return res.status(201).json({
            success: true,
            data: response,
            err: {},
            message: 'Successfully registered an email reminder'
        });
    } catch (error) {
        // Handling errors and responding with an error message
        return res.status(500).json({
            success: false,
            err: error,
            message: 'Unable to register an email reminder'
        });
    }
}

// Exporting the controller method for use in other modules
module.exports = {
    create
}
