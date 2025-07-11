const { Schema, model } = require("mongoose");

//Fixed item master
const projectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  client: { type: String, required: true },
  start_date: { type: String },
end_date: { type: String },
  url: { type: String },
  status: { type: String },
   createdAt: { type: String },  // 👈 optional if you're adding manually
    createdBy :{ type: String},

}); // 👈 Adds createdAt and updatedAt automatically
;


const Project = new model('project', projectSchema);




module.exports = { Project };



