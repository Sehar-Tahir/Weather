// backend/controllers/contactController.js

const Contact = require('../models/Contact');

// ── Submit Contact ────────────────────────────────────────────
const submitContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email and message are required' 
      });
    }

    const contact = new Contact({ 
      name, 
      email, 
      phone: phone || '', 
      message,
      status: 'new'
    });
    
    await contact.save();
    console.log('✅ New contact message received from:', email);

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully!',
      data: contact 
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ── Get All Contacts ─────────────────────────────────────────
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    console.log(`✅ Retrieved ${contacts.length} contacts`);
    res.json({ 
      success: true, 
      data: contacts 
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ── Update Contact Status ────────────────────────────────────
const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid status' 
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      id,
      { 
        status, 
        ...(status === 'replied' && { repliedAt: new Date() })
      },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        error: 'Contact not found' 
      });
    }
    
    console.log(`✅ Contact ${id} status updated to: ${status}`);
    res.json({ 
      success: true, 
      data: contact 
    });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ── Delete Contact ────────────────────────────────────────────
const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contact = await Contact.findByIdAndDelete(id);
    
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        error: 'Contact not found' 
      });
    }
    
    console.log(`✅ Contact ${id} deleted`);
    res.json({ 
      success: true, 
      message: 'Contact deleted successfully' 
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = { 
  submitContact, 
  getContacts, 
  updateContactStatus,
  deleteContact 
};