const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const updateprofile = async (req,res)=>{
    try {
        console.log(req.body);
    
         const id = req.params.id;
        
        const updateData = req.body;
        const email = updateData.email;
        const userExist = await User.findOne({ email, _id: { $ne: id }});
        
        const saltRound = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, saltRound);
        if(userExist){
            return res.status(400).json({msg:"Email id already exist"});

        }

        if (req.file) {
            updateData.pic = req.file.filename; 
        }

        const updatedProfile = await User.findByIdAndUpdate(id, updateData, { new: true });

        res.status(201).json({
            msg:'Updated Successfully',
        });

    } catch (error) {
        console.error("Error in updateprofile:", error.message); // Log the error message
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Send the error message in the response
    }
};
const getdatabyid = async(req, res) => {
    try {
        const id = req.params.id;
        const response = await await User.findOne({ _id: id });
        if(!response){
            res.status(404).json({msg:"No Data Found"});
            return;
        }
        res.status(200).json({msg:response});
    } catch (error) {
        console.log(`Customer ${error}`);
    }
};

module.exports = { updateprofile , getdatabyid};