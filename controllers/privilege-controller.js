const Pri = require("../models/privilege-model");
const User = require("../models/user-model");
const mongoose = require('mongoose');
const {Schema, model} = require("mongoose");
const {Page, Field} = require("../models/formmodule-model");

const bcrypt = require("bcryptjs");

const addrole = async (req,res)=>{
    try {
 
        const { role, createdby, user_id } = req.body;
        const userExist = await Pri.findOne({ role });
        

        if(userExist){
            return res.status(400).json({msg:"Role already exist"});
        }
     
        const cmCreated =  await Pri.create( { role, createdby,user_id} );

        const response = await Page.find({user_id:user_id});
        if (!response) {
            return res.status(500).json({ error: "Code Error", details: "page associated to user doesn't exist" });
        }
        
        const table_name = 'Privileges';


        let schemaFields = {};
        let formData = {
            user_id: user_id,
            role_id: cmCreated._id,
            createdDate: new Date(),
        }; 

        for (const field of response) {
            const name = field.page_url;
            const type = 'string';

            // Add dynamic field types to schema
            schemaFields[name] = { type: type };
            formData[name] = 0;
       
        }

        // Add fixed fields to schema
        schemaFields["user_id"] = { type: String };
        schemaFields["role_id"] = { type: String };
        schemaFields["createdDate"] = { type: Date };

        // Check if model already exists or create a new one
        let DB;
        if (mongoose.models[table_name]) {
            DB = mongoose.models[table_name];
        } else {
            const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
            DB = mongoose.model(table_name, dynamicSchema);
        }

        // Save form data to the database
        const savedField = await DB.create(formData);

        console.log("Saved document:", savedField);
        res.status(201).json({
            msg:cmCreated,
             userId:cmCreated._id.toString(),
        });

    } catch (error) {
        console.error("Error in addrole:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
}; 

const editrole = async (req,res)=>{
    try {
 
        const { role } = req.body;
        const id = req.params.id;
        const userExist = await Pri.findOne({ role, _id: { $ne: id } });
        
        if(userExist){
            return res.status(400).json({msg:"Role already exist"});

        }
        const cmCreated =  await Pri.create( { role} );
        res.status(201).json({
            msg:cmCreated,
             userId:cmCreated._id.toString(),
        });

    } catch (error) {
        console.error("Error in editrole:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const  getrolebyid = async(req, res) => {
    try {
        const id = req.params.id;
        const response = await await Pri.findOne({ _id: id });
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.error("Error in getrolebyid:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const  deleterole = async(req, res) => {
    try {
        const id = req.params.id;
        const gettdata =await Pri.find(({_id:id}));
        const user_id = gettdata.user_id;
     
        const table_name = 'Privileges'; // Dynamic table name based on page_name

        // Check if the model for this table already exists, or create a new one
        let DB;
        if (mongoose.models[table_name]) {
            DB = mongoose.models[table_name];
        } else {
            // Fetch the fields to dynamically build the schema if it doesn't exist
            
          
            const fields = await Page.find({user_id:user_id});
            let schemaFields = {};
            for (const field of fields) {
                const name = field.page_url;
                const type = 'string';
                schemaFields[name] = { type: type };
            }

            // Add fixed fields to schema
            schemaFields["user_id"] = { type: String };
            schemaFields["createdDate"] = { type: Date };

            // Create the schema for the collection
            const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
            DB = mongoose.model(table_name, dynamicSchema);
        }

        // Delete the record based on the id
        const deletedRecord = await DB.findOneAndDelete({role_id: id});
        const response = await Pri.findOneAndDelete(({_id:id}));
        const response2 = await User.findOneAndDelete(({role:id}));

        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.error("Error in deleterole:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const  getroles = async(req, res) => {
    try {
        const user_id = req.params.id;
        const response = await Pri.find({user_id:user_id});
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.error("Error in getroles:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};


const setprivileges = async(req, res) =>{
    try {
        const role_id = req.params.id;
        const user_id = req.body.user_id;
       
        const response = await Page.find({user_id:user_id});
        
        if (!response) {
            return res.status(500).json({ error: "Code Error", details: "page associated to user doesn't exist" });
        }
        
        const table_name = 'Privileges';
        
        let schemaFields = {};
        let updateData = {}; 

        for (const field of response) {
            const name = field.page_url;
            const type = 'string';

            // Add dynamic field types to schema
            schemaFields[name] = { type: type };

           
            updateData[name] = req.body.fields[name];
        }

        // Add fixed fields to schema
        schemaFields["user_id"] = { type: String };
        schemaFields["role_id"] = { type: String };
        schemaFields["createdDate"] = { type: Date };

          // Fetch or create the model for the dynamic table
            let DB;
            if (mongoose.models[table_name]) {
                DB = mongoose.models[table_name];
            } else {
                const dynamicSchema = new mongoose.Schema(schemaFields, { collection: table_name });
                DB = mongoose.model(table_name, dynamicSchema);
            }

            // Update the document in the database
            const updatedRecord = await DB.findOneAndUpdate(
                { role_id: role_id }, 
                updateData, 
                { new: true }  
            );

            if (!updatedRecord) {
                return res.status(404).json({
                    error: "Not Found",
                    details: "The record you're trying to update does not exist",
                });
            }

            res.status(200).json({
                msg: "Record updated successfully",
                updatedRecord,
            });

    } catch (error) {
        console.error("Error in set privileges:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
}

//add user as per roles
const adduser = async (req,res)=>{
    try {
        console.log(req.body);
        const { username, email, phone, password, role } = req.body;
        const status= '1';    
        
        const userExist = await User.findOne({ email });
        
        if(userExist){
            return res.status(400).json({msg:"Email ID already exist"});

        }
        const cmCreated =  await User.create( { username, email, phone, password, status,role} );
        res.status(201).json({
            msg:cmCreated,
            userId:cmCreated._id.toString(),
        });

    } catch (error) {
        console.error("Error in adduser:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const updateuser = async (req,res)=>{
    try {
        console.log(req.body);
        const { username, email, phone, password, role } = req.body;
 
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, saltRound);
        const id = req.params.id;
 
        const userExist = await User.findOne({ email, _id: { $ne: id }});
        
        if(userExist){
            return res.status(400).json({msg:"User already exist"});

        }
        const result = await User.updateOne({ _id:id },{
            $set:{
                username: username,
                email: email,   
                phone: phone,   
                password: hash_password, 
                role:role,  
            }
        },{
            new:true,
        });
        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
        console.error("Error in updateuser:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const  getuser = async(req, res) => {
    try {
        const response = await User.find({ isAdmin: { $ne: 'true' } });
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.error("Error in getuser:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const  getuserbyid = async(req, res) => {
    try {
        const id = req.params.id;
        const response = await await User.findOne({ _id: id });
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.error("Error in getuserbyid:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const  deleteuser = async(req, res) => {
    try {

        const id = req.params.id;
        const response = await User.findOneAndDelete(({_id:id}));
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.error("Error in deleteuser:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

const statususer = async (req,res)=>{
    try {
        
        const { status } = req.body;
        const id = req.params.id;
    
        const result = await User.updateOne({ _id:id },{
            $set:{
                status: status,
            }
        },{
            new:true,
        });
        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
        console.error("Error in statususer:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};

module.exports = { addrole , editrole , getrolebyid, deleterole , getroles, adduser, updateuser, getuser, getuserbyid, deleteuser, statususer, setprivileges};
