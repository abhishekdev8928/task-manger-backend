const { Task } = require("../models/task-model");
const Client = require("../models/client-model");
const { Project } = require("../models/project-model");
const { Employee } = require("../models/employee-model");

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

//add project
const projectOptions = async (req, res) => {
  try {
    const item = await Project.find({ status: 1 });
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

const employeeOptions = async (req, res) => {
  try {
    const item = await Employee.find({ status: 1 });
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

const addtask = async (req, res) => {
  try {
    const {
      title,
      frequency,
      start_date,
      end_date,
      priority,
      task_status,
      assignto,
      client,
      project,
      createdBy,
      description,
    } = req.body;

    const filePath = req.file ? req.file.path : null;
    const url = createCleanUrl(title);
    const now = new Date();
    const createdAt = formatDateDMY(now);
    const updatedAt = formatDateDMY(now);

    // Optional: check duplicate title
    const existingTask = await Task.findOne({ title });
    if (existingTask) {
      return res
        .status(400)
        .json({ msg: "Task with this title already exists" });
    }

    const newTask = await Task.create({
      title,
      frequency,
      start_date,
      end_date,
      priority,
      task_status,
      assignto,
      client,
      project,
      description,
      createdAt,
      updatedAt,
      status: "1",
      url,
      createdBy,
      filePath,
    });

    res.status(201).json({
      msg: newTask,
      userId: newTask._id.toString(),
    });
  } catch (error) {
    console.error("Add Task Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

//update status

const updateStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    const result = await Task.updateOne(
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

const updatetask = async (req, res) => {
  try {
    const now = new Date();
    const updatedAt = formatDateDMY(now);

    const {
      title,
      frequency,
      start_date,
      end_date,
      priority,
      task_status,
      client,
      project,
      description,
        assignto, // ✅ now string

    } = req.body;

    
    const id = req.params.id;
    const filePath = req.file ? req.file.path : null;

    const updateData = {
      title,
      frequency,
      start_date,
      end_date,
      priority,
      task_status,
      assignto, // ✅ now it's an array
      client,
      project,
      description,
      updatedAt,
    };

    if (filePath) {
      updateData.filePath = filePath;
    }

    const result = await Task.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    res.status(200).json({
      msg: "Updated Successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
};



//get table data

const getdata = async (req, res) => {
  try {
    const response = await Task.find();
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

const deletetask = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await Task.findOneAndDelete({ _id: id });

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
const gettaskByid = async (req, res) => {
  try {
    const project = await Task.findOne({ _id: req.params.id });

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


//today task



const todayTask = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // today at 00:00:00

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // tomorrow at 00:00:00

    const response = await Task.find({
      start_date: { $lt: tomorrow },
      end_date: { $gte: today },
    });

    if (!response || response.length === 0) {
      return res.status(404).json({ msg: "No Data Found" });
    }

    res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`todayTask error: ${error}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


//overdue


const overdueTask = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight of today

    const response = await Task.find({
      end_date: { $lt: today }, // Match tasks that ended before today
    });

    if (!response || response.length === 0) {
      return res.status(404).json({ msg: "No Data Found" });
    }

    res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`overdueTask error: ${error}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


//upcoming task
const upcomingTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to today's midnight

    const response = await Task.find({
      start_date: { $gt: today }, // start date after today
    });

    if (!response || response.length === 0) {
      return res.status(404).json({ msg: "No Data Found" });
    }

    res.status(200).json({ msg: response });
  } catch (error) {
    console.log(`upcomingTasks error: ${error}`);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};



//assign to 

const assigntoOptions = async (req, res) => {
  try {
    const item = await Employee.find({ status: 1 });
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

module.exports = {
  addtask,
  projectOptions,
  employeeOptions,
  updateStatus,
  updatetask,
  getdata,
  deletetask,
  gettaskByid,
  categoryOptions,
  todayTask,
  assigntoOptions,
  overdueTask,
  upcomingTasks
};
