const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = 3000;

// Initialize WhatsApp client with LocalAuth to persist session
const client = new Client({
    authStrategy: new LocalAuth()  // Saves session to avoid re-scanning QR code
});

// Print QR code in terminal the first time to scan
client.on('qr', qr => {
    console.log('Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// When WhatsApp is ready, print message
client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Create an endpoint for sending messages
app.get('/send', async (req, res) => {
    const number = req.query.number;
    const message = req.query.message;

    if (!number || !message) {
        return res.status(400).send('Missing number or message');
    }

    const chatId = number + '@c.us'; // WhatsApp format
    try {
        await client.sendMessage(chatId, message);
        res.send('Message sent');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error sending message');
    }
});

// Start the WhatsApp client
client.initialize();

// Start Express server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
