const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');

const TicketController = require('./controllers/ticket-controller');
const EmailService = require('./services/email-service');

const jobs = require('./utils/job');
const { subscribeMessage, createChannel } = require('./utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('./config/serverConfig');

const setupAndStartServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.post('/api/v1/tickets', TicketController.create);

    const channel = await createChannel();
    subscribeMessage(channel, EmailService.subscribeEvents, REMINDER_BINDING_KEY);

    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
        // jobs();
        
        // sendBasicEmail(
        //     'support@gmail.com',
        //     'harishankeryadav927@gmail.com',
        //     'testing',
        //     'hello world'
        // )
        
        // cron.schedule('*/2 * * * *', () => {
        //     console.log('running after every two minutes');
        // });
    });
}

setupAndStartServer();



// create and tickets service in postman with this and more example
// {
//     "subject":"this is ticket 1",
//     "content":"this is some content to send",
//     "recepientEmail":"harishankeryadav927@gmail.com",
//     "notificationTime":"2024-03-07T04:01:00.000"
//     }