// Importing the email sender configuration and TicketRepository
const sender = require('../config/emailConfig');
const TicketRepository = require('../repository/ticket-repository');

// Creating an instance of the TicketRepository
const repo = new TicketRepository();

// Function to send a basic email using the configured email sender
const sendBasicEmail = async (mailFrom, mailTo, mailSubject, mailBody) => {
    try {
        // Sending an email with specified details
        const response = await sender.sendMail({
            from: mailFrom,
            to: mailTo,
            subject: mailSubject,
            text: mailBody
        });
        console.log(response);
    } catch (error) {
        // Logging any errors that occur during the email sending process
        console.log(error);
    }
}

// Function to fetch pending emails from the repository
const fetchPendingEmails = async (timestamp) => {
    try {
        // Fetching pending emails from the repository with the specified status
        const response = await repo.get({ status: "PENDING" });
        return response;
    } catch (error) {
        // Logging any errors that occur during the fetch operation
        console.log(error);
    }
}

// Function to update a ticket in the repository
const updateTicket = async (ticketId, data) => {
    try {
        // Updating a ticket in the repository based on the provided data
        const response = await repo.update(ticketId, data);
        return response;
    } catch (error) {
        // Logging any errors that occur during the update operation
        console.log(error);
    }
}

// Function to create a notification in the repository
const createNotification = async (data) => {
    try {
        // Creating a notification in the repository based on the provided data
        const response = await repo.create(data);
        return response;
    } catch (error) {
        // Logging any errors that occur during the creation operation
        console.log(error);
    }
}

// Function to subscribe to events and perform corresponding actions
const subscribeEvents = async (payload) => {
    let service = payload.service;
    let data = payload.data;
    switch (service) {
        case 'CREATE_TICKET':
            await createNotification(data);
            break;
        case 'SEND_BASIC_MAIL':
            await sendBasicEmail(data);
            break;
        default:
            console.log('No valid event received');
            break;
    }
}

// Exporting functions for use in other modules
module.exports = {
    sendBasicEmail,
    fetchPendingEmails,
    createNotification,
    updateTicket,
    subscribeEvents
}

/**
 * SMTP -> a@b.com
 * receiver-> d@e.com
 * 
 * from: support@noti.com
 */
