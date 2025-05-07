const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const port = 3000;

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    console.log('Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp client is ready!');
});

// Allow GET request from PHP to send message
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

client.initialize();
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
