const {Schema, model} = require("mongoose");

const roleSchema = new Schema({
    role: {type: String, required: true},
    createdby:{type: String},
    user_id:{type:String},
});
const Role = new model('Role',roleSchema);
module.exports = Role;