// models/client-model.js
const { Schema, model } = require("mongoose");

const clientSchema = new Schema({
  companyname: { type: String, required: true },
  name: { type: String, required: true },
  notes: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  url: { type: String },
  status: { type: String },
  createdAt: { type: String },
  createdBy :{ type: String}, // 👈 optional if you're adding manually

});

module.exports = model('client', clientSchema); // ✅ default export
