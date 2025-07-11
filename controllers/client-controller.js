const Client = require("../models/client-model");

// Utility: Create clean URL from title
function createCleanUrl(title) {
  let cleanTitle = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  return cleanTitle;
}

// Utility: Format date as dd-mm-yyyy hh:mm:ss
const formatDateDMY = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Create new client
const addclient = async (req, res) => {
  try {
    const { name, email, companyname, phone, notes,createdBy } = req.body;
    const status = '1';
    const url = createCleanUrl(name);
    const now = new Date();
    const createdAt = formatDateDMY(now);
    const updatedAt = formatDateDMY(now);

    const userExist = await Client.findOne({ email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const cmCreated = await Client.create({
      email,
      name,
      companyname,
      phone,
      notes,
      createdAt,
      updatedAt,
      createdBy,
      status,
      url,
    });

    res.status(201).json({
      msg: cmCreated,
      userId: cmCreated._id.toString(),
    });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Update status
const updateStatus = async (req, res) => {
  try {
    const { status, id } = req.body;

    await Client.updateOne({ _id: id }, { $set: { status } }, { new: true });

    res.status(200).json({ msg: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Update client
const updateclient = async (req, res) => {
  try {
    const now = new Date();
    const updatedAt = formatDateDMY(now);
    
    // ✅ Include all fields from req.body
    const { name, email, role, companyname, phone, notes } = req.body;
    const url = createCleanUrl(name);
    const id = req.params.id;

    const userExist = await Client.findOne({ email, _id: { $ne: id } });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    await Client.updateOne(
      { _id: id },
      {
        $set: {
          name,
          email,
          role,
          companyname,
          phone,
          notes,
          url,
          updatedAt,
        },
      },
      { new: true }
    );

    res.status(200).json({ msg: 'Client updated successfully' });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};


// Get all clients
const getdata = async (req, res) => {
  try {
    const response = await Client.find();
    if (!response || response.length === 0) {
      return res.status(404).json({ msg: "No data found" });
    }

    res.status(200).json({ msg: response });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Delete client
const deleteclient = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await Client.findOneAndDelete({ _id: id });

    if (!response) {
      return res.status(404).json({ msg: "No data found" });
    }

    res.status(200).json({ msg: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Get client by ID
const getclientByid = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id });

    if (!client) {
      return res.status(404).json({ msg: "No data found" });
    }

    res.status(200).json({ msg: client });
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

// Export all
module.exports = {
  addclient,
  updateStatus,
  updateclient,
  getdata,
  deleteclient,
  getclientByid,
};
