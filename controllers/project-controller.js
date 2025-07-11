const { Project } = require("../models/project-model");
const Client = require("../models/client-model");

function createCleanUrl(title) {
  // Convert the title to lowercase
  let cleanTitle = title.toLowerCase();
  // Remove special characters, replace spaces with dashes
  cleanTitle = cleanTitle.replace(/[^\w\s-]/g, "");
  cleanTitle = cleanTitle.replace(/\s+/g, "-");

  return cleanTitle;
}

// -----------project------------------
//add project
const categoryOptions = async (req, res) => {
  try {
    const item = await Client.find({ status: 1 });
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
const getClientOptionsTable = async (req, res) => {
  try {
    const categories = await Client.find({}, "_id name"); // Fetch only ID & name

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

const addproject = async (req, res) => {
  try {
    console.log(req.body);
    const { name, description, client, start_date, end_date ,createdBy} = req.body;
    const status = "1";
    const url = createCleanUrl(req.body.name);
    const userExist = await Project.findOne({ name });
    const now = new Date(); // ✅ Define now
    const createdAt = formatDateDMY(now); // 👈 formatted date
    const updatedAt = formatDateDMY(now);
    if (userExist) {
      return res.status(400).json({ msg: "Email already exist" }); // ✅ Only one space
    }

    const cmCreated = await Project.create({
      description,
      name,
      client,
      createdAt,
      updatedAt,
      status,
      url,
      createdBy,
      start_date, // already in "YYYY-MM-DD"
      end_date,
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

    const result = await Project.updateOne(
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

const updateproject = async (req, res) => {
  try {
    console.log(req.body);
    const now = new Date(); // ✅ Define now
    const createdAt = formatDateDMY(now); // 👈 formatted date
    const updatedAt = formatDateDMY(now);
    const { name, client, start_date, end_date, description } = req.body;
    const url = createCleanUrl(req.body.name);
    const id = req.params.id;

    const userExist = await Project.findOne({ name, _id: { $ne: id } });

    if (userExist) {
      return res.status(400).json({ msg: "Name already exist" });
    }
    const result = await Project.updateOne(
      { _id: id },
      {
        $set: {
          name: name,
          start_date: start_date,
          end_date: end_date,
          description: description,
          url: url,
          client: client,
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
    const response = await Project.find();
    if (!response) {
      res.status(404).json({ msg: "No Data Found" });
      return;
    }

    res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`project ${error}`);
  }
};

//delete

const deleteproject = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await Project.findOneAndDelete({ _id: id });

    if (!response) {
      res.status(404).json({ msg: "No Data Found" });
      return;
    }
    res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`project ${error}`);
  }
};

//for edit

// backend: controller
const getprojectByid = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id });

    if (!project) {
      return res.status(404).json({ msg: "No Data Found" });
    }

    res.status(200).json({ msg: project }); // msg is an object
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  addproject,
  updateStatus,
  updateproject,
  getdata,
  getClientOptionsTable,
  deleteproject,
  getprojectByid,
  categoryOptions,
};
