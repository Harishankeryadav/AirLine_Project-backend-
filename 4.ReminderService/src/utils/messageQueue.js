// Importing the 'amqplib' library for RabbitMQ interaction
const amqplib = require('amqplib');

// Importing message broker URL and exchange name from the server configuration
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require('../config/serverConfig');

/**
 * Function to create a RabbitMQ channel.
 * - Establishes a connection to the message broker.
 * - Creates a channel on the connection.
 * - Asserts the existence of a direct exchange named EXCHANGE_NAME.
 * @returns {Promise<Channel>} The created RabbitMQ channel.
 */
const createChannel = async () => {
    try {
        // Connecting to the RabbitMQ server
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);

        // Creating a channel on the connection
        const channel = await connection.createChannel(); 

        // Asserting the existence of the direct exchange named EXCHANGE_NAME
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);

        // Returning the created RabbitMQ channel
        return channel;
    } catch (error) {
        throw error;
    }
}

/**
 * Function to subscribe to messages from a RabbitMQ channel.
 * - Asserts the existence of a queue named 'REMINDER_QUEUE'.
 * - Binds the queue to the exchange using the provided binding key.
 * - Consumes messages from the queue, parses the payload, and calls the provided service.
 * - Acknowledges the received message.
 * @param {Channel} channel - The RabbitMQ channel to subscribe on.
 * @param {Function} service - The service to handle the received message payload.
 * @param {string} binding_key - The binding key for the message queue.
 */
const subscribeMessage = async (channel, service, binding_key) => {
    try {
        // Asserting the existence of the 'REMINDER_QUEUE' and getting the queue information
        const applicationQueue = await channel.assertQueue('REMINDER_QUEUE');

        // Binding the queue to the exchange using the provided binding key
        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        // Consuming messages from the queue
        channel.consume(applicationQueue.queue, msg => {
            console.log('Received data');
            console.log(msg.content.toString());

            // Parsing the message payload as JSON
            const payload = JSON.parse(msg.content.toString());

            // Calling the provided service with the payload
            service(payload);

            // Acknowledging the received message
            channel.ack(msg);
        });
    } catch (error) {
        throw error;
    }
}

/**
 * Function to publish a message to a RabbitMQ channel.
 * - Asserts the existence of a queue named 'REMINDER_QUEUE'.
 * - Publishes the message to the exchange using the provided binding key.
 * @param {Channel} channel - The RabbitMQ channel to publish on.
 * @param {string} binding_key - The binding key for the message queue.
 * @param {string} message - The message to be published.
 */
const publishMessage = async (channel, binding_key, message) => {
    try {
        // Asserting the existence of the 'REMINDER_QUEUE'
        await channel.assertQueue('REMINDER_QUEUE');

        // Publishing the message to the exchange using the provided binding key
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        throw error;
    }
}

// Exporting the functions for use in other modules
module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}
