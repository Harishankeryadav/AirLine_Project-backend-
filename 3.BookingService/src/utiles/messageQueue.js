// Importing the amqplib library for interacting with RabbitMQ
const amqplib = require('amqplib');

// Importing constants for message broker URL and exchange name from the server configuration
const { MESSAGE_BROKER_URL, EXCHANGE_NAME } = require('../config/serverConfig');

// Asynchronous function to create a channel for communication with RabbitMQ
const createChannel = async () => {
    try {
        // Establishing a connection to the message broker
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);

        // Creating a channel for communication
        const channel = await connection.createChannel();

        // Asserting the existence of the exchange with a direct type
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false);

        // Returning the created channel
        return channel;
    } catch (error) {
        // Handling errors and throwing them for handling in higher layers
        throw error;
    }
}

// Asynchronous function to subscribe to messages from a specific binding key
const subscribeMessage = async (channel, service, binding_key) => {
    try {
        // Asserting the existence of a queue named 'REMINDER_QUEUE'
        const applicationQueue = await channel.assertQueue('REMINDER_QUEUE');

        // Binding the queue to the exchange with a specific binding key
        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);

        // Consuming messages from the queue
        channel.consume(applicationQueue.queue, msg => {
            console.log('received data');
            console.log(msg.content.toString());

            // Parsing the message content to JSON
            const payload = JSON.parse(msg.content.toString());

            // Calling the provided service function with the payload
            service(payload);

            // Acknowledging the receipt of the message
            channel.ack(msg);
        });
    } catch (error) {
        // Handling errors and throwing them for handling in higher layers
        throw error;
    }
}

// Asynchronous function to publish a message with a specific binding key
const publishMessage = async (channel, binding_key, message) => {
    try {
        // Asserting the existence of a queue named 'REMINDER_QUEUE'
        await channel.assertQueue('REMINDER_QUEUE');

        // Publishing the message to the exchange with a specific binding key
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    } catch (error) {
        // Handling errors and throwing them for handling in higher layers
        throw error;
    }
}

// Exporting functions for use in other modules
module.exports = {
    subscribeMessage,
    createChannel,
    publishMessage
}
