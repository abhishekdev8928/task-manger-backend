const { Schema, model } = require("mongoose");

//Fixed item master
const employeeSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  url: { type: String },
  status: { type: String },
   createdAt: { type: String }, 
    createdBy :{ type: String}, // 👈 optional if you're adding manually

}); // 👈 Adds createdAt and updatedAt automatically
;


const Employee = new model('Employee', employeeSchema);




module.exports = { Employee };



