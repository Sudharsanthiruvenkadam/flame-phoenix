
const CompanyContact = require("../models/CompanyContact");

const DEFAULT_CONTACT = {
  companyName: "Flame Phoenix",
  founderName: "Parvin Chandran K",
  designation: "Founder",
  phone: "6374884720",
  whatsapp: "6374884720",
  email: "flame_phoenix@gmail.com",
  address: "Address will be updated soon",
  enquiryEnabled: true,
};

// Public website: get contact details
exports.getPublicContact = async (_req, res) => {
  try {
    const contact = await CompanyContact.findOne({ key: "main" }).lean();

    return res.status(200).json({
      success: true,
      contact: contact || DEFAULT_CONTACT,
    });
  } catch (error) {
    console.error("Get public contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load company contact details.",
    });
  }
};

// Admin: get contact details
exports.getAdminContact = async (_req, res) => {
  try {
    let contact = await CompanyContact.findOne({ key: "main" });

    if (!contact) {
      contact = await CompanyContact.create({
        ...DEFAULT_CONTACT,
        key: "main",
      });
    }

    return res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Get admin contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load admin contact settings.",
    });
  }
};

// Admin: update contact details
exports.updateAdminContact = async (req, res) => {
  try {
    const allowedFields = [
      "companyName",
      "founderName",
      "designation",
      "phone",
      "whatsapp",
      "email",
      "address",
      "enquiryEnabled",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update.",
      });
    }

    const stringFields = [
      "companyName",
      "founderName",
      "designation",
      "phone",
      "whatsapp",
      "email",
      "address",
    ];

    for (const field of stringFields) {
      if (field in updates) {
        if (
          typeof updates[field] !== "string" ||
          !updates[field].trim()
        ) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a non-empty string.`,
          });
        }

        updates[field] = updates[field].trim();
      }
    }

    if (
      updates.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (
      "enquiryEnabled" in updates &&
      typeof updates.enquiryEnabled !== "boolean"
    ) {
      return res.status(400).json({
        success: false,
        message: "enquiryEnabled must be true or false.",
      });
    }

    let contact = await CompanyContact.findOne({ key: "main" });

    if (!contact) {
      contact = new CompanyContact({
        ...DEFAULT_CONTACT,
        ...updates,
        key: "main",
      });
    } else {
      Object.assign(contact, updates);
    }

    await contact.save();

    return res.status(200).json({
      success: true,
      message: "Company contact details updated successfully.",
      contact,
    });
  } catch (error) {
    console.error("Update admin contact error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update company contact details.",
    });
  }
};
