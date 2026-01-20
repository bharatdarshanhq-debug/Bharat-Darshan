const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message, package: packageType, destination } = req.body;

    // Save to Database
    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
      package: packageType,
      destination
    });

    // Send Email Notification
    // Only attempt to send email if credentials are present
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // or use 'host' and 'port' for other providers
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Send to admin (self)
        subject: `New Contact Inquiry from ${name}`,
        html: `
          <h3>New Contact Inquiry</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Package Interest:</strong> ${packageType || 'Not specified'}</p>
          <p><strong>Destination:</strong> ${destination || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } else {
      console.log('Email credentials not found in env, skipping email.');
    }

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to submit form'
    });
  }
};
