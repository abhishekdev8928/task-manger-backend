const bcrypt = require("bcryptjs");

const { Employee } = require("../models/employee-model");


function createCleanUrl(title) {
  // Convert the title to lowercase
  let cleanTitle = title.toLowerCase();
  // Remove special characters, replace spaces with dashes
  cleanTitle = cleanTitle.replace(/[^\w\s-]/g, "");
  cleanTitle = cleanTitle.replace(/\s+/g, "-");

  return cleanTitle;
}
const updateprofile = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    // ✅ Generate clean URL from name
    const url = createCleanUrl(updateData.name);
    updateData.url = url; // Optional: store in DB if needed

    // ✅ Check if email already exists for another user
    const email = updateData.email;
    const userExist = await Employee.findOne({ email, _id: { $ne: id } });

    if (userExist) {
      return res.status(400).json({ msg: "Email ID already exists" });
    }

    // ✅ Handle profile pic
    if (req.file) {
      updateData.profile_pic = req.file.filename;
    }

    // ✅ Update user
    const updatedProfile = await Employee.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProfile) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Updated Successfully",
      user: updatedProfile,
    });
  } catch (error) {
    console.error("Error in updateprofile:", error.message);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
};


const updatepassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { current_password, new_password } = req.body;

    const user = await Employee.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Compare plain text password
    if (user.password !== current_password) {
      return res.status(400).json({ msg: "wrong_password" });
    }

    // Update password
    user.password = new_password;

    // Save without touching __v
    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatepassword:", error.message);
    res.status(500).json({ msg: "Internal Server Error", error: error.message });
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

module.exports = { updateprofile , getdatabyid,updatepassword};
