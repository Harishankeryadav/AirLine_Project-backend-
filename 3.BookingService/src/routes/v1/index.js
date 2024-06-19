const express = require('express');

const { BookingController } = require('../../controller/index');
// const { createChannel } = require('../../utils/messageQueue');

// const channel = await createChannel();
const bookingController = new BookingController();
const router = express.Router();

router.get('/info', (req, res) => {
    return res.json({message: 'routes response'})
});

router.post('/bookings', bookingController.create);
router.post('/publish', bookingController.sendMessageToQueue);

module.exports = router;