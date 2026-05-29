const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

// MongoDB connection
mongoose.connect(
    'mongodb+srv://jaganjeyaraman:port@port.gjo3oib.mongodb.net/?retryWrites=true&w=majority&appName=port',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
);

// Define schema and model
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.model('Contact', contactSchema);

// Express app setup
const app = express();

// ✅ CORS setup using cors npm package
app.use(cors({
    origin: ['https://jey-me.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200,
}));

app.use(express.json());

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'jaganjeyaraman@gmail.com', // your email
        pass: 'wpyy ltqr tdxj gstd',     // your app password
    },
});

// POST endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const contact = new Contact({ name, email, message });
        await contact.save();

        // Send email in background (don't wait for it)
        transporter.sendMail({
            from: `"Portfolio Contact" <jaganjeyaraman@gmail.com>`,
            to: 'jaganjeyaraman@gmail.com',
            subject: 'New Contact Form Submission',
            html: `
                <h3>New message received:</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br/>${message}</p>
            `,
        }).catch(err => console.error('Email error:', err));

        res.status(201).json({ message: 'Message received!' });
    } catch (err) {
        console.error('Contact API Error:', err);
        res.status(500).json({ error: 'Failed to save message.' });
    }
});
// Test route
app.get('/', (req, res) => {
    res.send('Welcome to the Portfolio API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
