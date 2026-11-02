
const mongoose = require("mongoose");

const companyContactSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "main",
      unique: true,
      immutable: true,
    },
    companyName: {
      type: String,
      default: "Flame Phoenix",
      trim: true,
      maxlength: 120,
    },
    founderName: {
      type: String,
      default: "Parvin Chandran K",
      trim: true,
      maxlength: 100,
    },
    designation: {
      type: String,
      default: "Founder",
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      default: "6374884720",
      trim: true,
      maxlength: 30,
    },
    whatsapp: {
      type: String,
      default: "6374884720",
      trim: true,
      maxlength: 30,
    },
    email: {
      type: String,
      default: "flame_phoenix@gmail.com",
      trim: true,
      lowercase: true,
      maxlength: 150,
    },
    address: {
      type: String,
      default: "Address will be updated soon",
      trim: true,
      maxlength: 500,
    },
    enquiryEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CompanyContact", companyContactSchema);
