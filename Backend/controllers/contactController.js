const Contact = require('../models/Contact');

// Send email using Resend API (works on cloud providers where SMTP is blocked)
const sendEmailNotification = async (contactData) => {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  
  if (!RESEND_API_KEY) {
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
      // Email sent successfully
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

    // Save to database first
    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
      package: packageType,
      destination
    });



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

// ─── Admin Endpoints ───────────────────────────────────────────

/**
 * GET /api/contact/admin/all
 * Fetch all inquiries (admin). Supports ?status=New filter.
 */
exports.getAllInquiries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    const inquiries = await Contact.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: inquiries.length,
      inquiries,
    });
  } catch (err) {
    console.error('[Contact] getAllInquiries error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch inquiries' });
  }
};

/**
 * GET /api/contact/admin/:id
 * Fetch a single inquiry by ID (admin).
 */
exports.getInquiryById = async (req, res) => {
  try {
    const inquiry = await Contact.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    res.json({ success: true, inquiry });
  } catch (err) {
    console.error('[Contact] getInquiryById error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch inquiry' });
  }
};

/**
 * PUT /api/contact/admin/:id/status
 * Update inquiry status (admin). Body: { status: 'New' | 'Contacted' | 'Resolved' }
 */
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['New', 'Contacted', 'Resolved'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${allowed.join(', ')}`,
      });
    }

    const inquiry = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    res.json({ success: true, inquiry });
  } catch (err) {
    console.error('[Contact] updateInquiryStatus error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to update inquiry status' });
  }
};

/**
 * DELETE /api/contact/admin/:id
 * Delete an inquiry (admin).
 */
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Contact.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (err) {
    console.error('[Contact] deleteInquiry error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to delete inquiry' });
  }
};


