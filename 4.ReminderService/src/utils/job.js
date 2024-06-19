// Importing required modules and services
const cron = require('node-cron');
const emailService = require('../services/email-service');
const sender = require('../config/emailConfig');

/**
 * Schedule Jobs:
 * This script sets up a cron job to run every 2 minutes, checking for pending emails
 * and attempting to send them using the configured email sender.
 */
const setupJobs = () => {
    // Setting up a cron job to run every 2 minutes
    cron.schedule('*/2 * * * *', async () => {
        // Fetching pending emails from the email service
        const response = await emailService.fetchPendingEmails();
        
        // Iterating through each pending email and attempting to send it
        response.forEach((email) => {
            // Using the configured email sender to send the email
            sender.sendMail({
                to: email.recepientEmail,
                subject: email.subject,
                text: email.content,
            }, async (err, data) => {
                if (err) {
                    // Logging any errors that occur during the email sending process
                    console.log(err);
                } else {
                    // Logging the success response and updating the ticket status to "SUCCESS"
                    console.log(data);
                    await emailService.updateTicket(email.id, { status: "SUCCESS" });
                }
            });
        });

        // Logging the response (list of pending emails)
        console.log(response);
    });
}

// Exporting the setupJobs function for use in other modules
module.exports = setupJobs;
