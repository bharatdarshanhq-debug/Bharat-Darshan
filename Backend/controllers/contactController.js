const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Create reusable transporter with timeout settings
let transporter = null;

const getTransporter = () => {
  if (!transporter && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      // Add timeout settings to prevent hanging
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000
    });
  }
  return transporter;
};

// Async function to send email (non-blocking)
const sendEmailNotification = async (contactData) => {
  const emailTransporter = getTransporter();
  
  if (!emailTransporter) {
    console.log('[Contact] Email credentials not configured, skipping email notification');
    return;
  }

  const { name, email, phone, message, package: packageType, destination } = contactData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
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

  try {
    await emailTransporter.sendMail(mailOptions);
    console.log('[Contact] Email sent successfully to', process.env.EMAIL_USER);
  } catch (emailErr) {
    console.error('[Contact] Email sending failed:', emailErr.message);
    console.error('[Contact] Email error code:', emailErr.code);
    console.error('[Contact] Email error response:', emailErr.response);
    // Don't throw - email failure should not affect the response
  }
};

exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message, package: packageType, destination } = req.body;

    console.log('[Contact] Received form submission:', { name, email, phone, packageType, destination });

    // Save to database first
    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
      package: packageType,
      destination
    });

    console.log('[Contact] Saved to database successfully:', contact._id);

    // IMPORTANT: Send response IMMEDIATELY after DB save
    // Don't wait for email - this is the key fix for the 3-minute delay!
    res.status(201).json({
      success: true,
      data: contact,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

    // Fire-and-forget: Send email in background AFTER response is sent
    sendEmailNotification({ name, email, phone, message, package: packageType, destination })
      .catch(err => console.error('[Contact] Background email error:', err.message));

  } catch (err) {
    console.error('[Contact] Error:', err.message);
    console.error('[Contact] Stack:', err.stack);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to submit form'
    });
  }
};
