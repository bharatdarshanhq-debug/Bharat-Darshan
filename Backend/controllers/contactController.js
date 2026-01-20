const Contact = require('../models/Contact');

// Send email using Resend API (works on cloud providers where SMTP is blocked)
const sendEmailNotification = async (contactData) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
    console.log('[Email] RESEND_API_KEY not configured, skipping email notification');
    console.log('[Email] Get your free API key at: https://resend.com');
    return;
  }

  const { name, email, phone, message, package: packageType, destination } = contactData;

  const emailHtml = `
    <h3>New Contact Inquiry</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Package Interest:</strong> ${packageType || 'Not specified'}</p>
    <p><strong>Destination:</strong> ${destination || 'Not specified'}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Bharat Darshan <onboarding@resend.dev>', // Use Resend's default domain (free)
        to: process.env.EMAIL_USER || 'bharatdarshan.hq@gmail.com',
        subject: `New Contact Inquiry from ${name}`,
        html: emailHtml,
        reply_to: email // So you can reply directly to the customer
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('[Email] Sent successfully via Resend! ID:', data.id);
    } else {
      console.error('[Email] Resend API error:', data.message || JSON.stringify(data));
    }
  } catch (err) {
    console.error('[Email] Failed to send via Resend:', err.message);
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

    // Send response IMMEDIATELY after DB save
    res.status(201).json({
      success: true,
      data: contact,
      message: 'Thank you for contacting us! We will get back to you soon.'
    });

    // Fire-and-forget: Send email in background
    sendEmailNotification({ name, email, phone, message, package: packageType, destination })
      .catch(err => console.error('[Email] Background error:', err.message));

  } catch (err) {
    console.error('[Contact] Error:', err.message);
    console.error('[Contact] Stack:', err.stack);
    res.status(500).json({
      success: false,
      error: 'Server Error: Unable to submit form'
    });
  }
};

