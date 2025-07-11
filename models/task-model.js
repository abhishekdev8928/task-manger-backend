const { Schema, model } = require("mongoose");

//Fixed item master
const taskSchema = new Schema({
  title: { type: String, required: true },
  frequency: { type: String, required: true },
  task_status: { type: String, required: true },
  start_date: { type: Date },
  end_date: { type: Date },
  priority: { type: String, required: true },
  assignto: { type: String },
  client: { type: String, required: true },
  project: { type: String, required: true },
  description: { type: String },
  filePath: {
    type: String,
   
  },
   createdBy: { type: String }, // 👈 optional if you're adding manually
  url: { type: String },
  status: { type: String },
  createdAt: { type: String }, // 👈 optional if you're adding manually
}); // 👈 Adds createdAt and updatedAt automatically
const Task = new model("task", taskSchema);

module.exports = { Task };
