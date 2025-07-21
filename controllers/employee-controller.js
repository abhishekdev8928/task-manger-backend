const { Employee } = require("../models/employee-model");
const { Role } = require("../models/role-model");

function createCleanUrl(title) {
  // Convert the title to lowercase
  let cleanTitle = title.toLowerCase();
  // Remove special characters, replace spaces with dashes
  cleanTitle = cleanTitle.replace(/[^\w\s-]/g, "");
  cleanTitle = cleanTitle.replace(/\s+/g, "-");

  return cleanTitle;
}

// -----------Employee------------------
//add employee
const categoryOptions = async (req, res) => {
  try {
    const item = await Role.find({ status: 1 });
    if (!item) {
      res.status(404).json({ msg: "No Data Found" });
      return;
    }

    res.status(200).json({
      msg: item,
    });
  } catch (error) {
    console.log(`Category ${error}`);
  }
};
const getRoleOptionsTable = async (req, res) => {
  try {
    const categories = await Role.find({}, "_id name"); // Fetch only ID & name

    res.status(200).json({
      success: true,
      msg: categories, // Return category data
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      msg: "Internal Server Error",
    });
  }
};

// util function to format the date
const formatDateDMY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
  const year = String(d.getFullYear()); // ✅ full year

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const addemployee = async (req, res) => {
  try {
    console.log(req.body);
    const { emp_id,name, email, role,createdBy } = req.body;
    const status = "1";
     const password = "Admin@123";
    const url = createCleanUrl(req.body.name);
    const userExist = await Employee.findOne({ email });
    const now = new Date(); // ✅ Define now
    const createdAt = formatDateDMY(now); // 👈 formatted date
    const updatedAt = formatDateDMY(now);
    if (userExist) {
      return res.status(400).json({ msg: "Email already exist" }); // ✅ Only one space
    }

    const cmCreated = await Employee.create({
      emp_id,
      email,
      name,
      role,
      createdAt,
      createdBy,
      updatedAt,
      status,
      url,
      password,
      
    });
    res.status(201).json({
      msg: cmCreated,
      userId: cmCreated._id.toString(),
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//update status

const updateStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    const result = await Employee.updateOne(
      { _id: id },
      {
        $set: {
          status: status,
        },
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      msg: "Updated Successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//update

const updateemployee = async (req, res) => {
  try {
    console.log(req.body);
    const now = new Date(); // ✅ Define now
    const createdAt = formatDateDMY(now); // 👈 formatted date
    const updatedAt = formatDateDMY(now);
    const { emp_id,name, email, role } = req.body;
    const url = createCleanUrl(req.body.name);
    const id = req.params.id;
    const userExist = await Employee.findOne({ email, _id: { $ne: id } });

    if (userExist) {
      return res.status(400).json({ msg: "Email already exist" });
    }
    const result = await Employee.updateOne(
      { _id: id },
      {
        $set: {
          emp_id:emp_id,
          name: name,
          email: email,
          url: url,
          role: role,
          createdAt: createdAt,
        },
      },
      {
        new: true,
      }
    );
    res.status(201).json({
      msg: "Updated Successfully",
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

//get table data

const getdata = async (req, res) => {
  try {
    const response = await Employee.find();
    if (!response) {
      res.status(404).json({ msg: "No Data Found" });
      return;
    }

    res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`Employee ${error}`);
  }
};

//delete

const deleteemployee = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await Employee.findOneAndDelete({ _id: id });

    if (!response) {
      res.status(404).json({ msg: "No Data Found" });
      return;
    }
    res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`Employee ${error}`);
  }
};

//for edit

// backend: controller
const getemployeeByid = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id });

    if (!employee) {
      return res.status(404).json({ msg: "No Data Found" });
    }

    res.status(200).json({ msg: employee }); // msg is an object
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};


const generateEmployeeCode = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments(); // ✅ total row count

    const nextId = totalEmployees + 1; // ✅ total + 1
    const empCode = `DHEMP${nextId}`;

    res.status(200).json({ empCode });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addemployee,
  updateStatus,
  updateemployee,
  getdata,
  getRoleOptionsTable,
  deleteemployee,
  getemployeeByid,
  categoryOptions,
  generateEmployeeCode,
};
