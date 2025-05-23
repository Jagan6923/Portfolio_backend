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
app.use(cors());
app.use(express.json());

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jaganjeyaraman@gmail.com', // replace with your Gmail
    pass: 'wpyy ltqr tdxj gstd',    // use App Password, not regular password
  },
});

// POST endpoint to receive form data
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Save to DB
    const contact = new Contact({ name, email, message });
    await contact.save();

    // ✅ Send email
    await transporter.sendMail({
      from: `"Portfolio Contact" <your_gmail@gmail.com>`,
      to: 'jaganjeyaraman@gmail.com',
      subject: 'New Contact Form Submission',
      html: `
        <h3>New message received:</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    });

    res.status(201).json({ message: 'Message received and email sent!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the Portfolio API');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
