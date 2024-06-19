// Importing the NotificationTicket model and Sequelize's Op for querying
const { NotificationTicket } = require('../models/index');
const { Op } = require("sequelize");

// Repository class for handling database operations related to NotificationTickets
class TicketRepository {
    
    // Method to fetch all tickets from the database
    async getAll() {
        try {
            const tickets = await NotificationTicket.findAll();
            return tickets;
        } catch (error) {
            // Throw any errors that occur during the database operation
            throw error;
        }
    }

    // Method to create a new ticket in the database
    async create(data) {
        try {
            const ticket = await NotificationTicket.create(data);
            return ticket;
        } catch (error) {
            // Throw any errors that occur during the database operation
            throw error;
        }
    }

    // Method to fetch tickets based on specified filter criteria
    async get(filter) {
        try {
            const tickets = await NotificationTicket.findAll({
                where: {
                    status: filter.status,
                    notificationTime: {
                        [Op.lte]: new Date()
                    }
                }
            });
            return tickets;
        } catch (error) {
            // Throw any errors that occur during the database operation
            throw error;
        }
    }

    // Method to update the status of a ticket in the database
    async update(ticketId, data) {
        try {
            const ticket = await NotificationTicket.findByPk(ticketId);

            // Updating the ticket status if provided in the data
            if (data.status)
                ticket.status = data.status;

            // Saving the updated ticket to the database
            await ticket.save();
            return ticket;
        } catch (error) {
            // Throw any errors that occur during the database operation
            throw error;
        }
    }
}

// Exporting the TicketRepository class for use in other modules
module.exports = TicketRepository;
