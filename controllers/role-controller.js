const { Role } = require("../models/role-model");

function createCleanUrl(title) {
    // Convert the title to lowercase
    let cleanTitle = title.toLowerCase();
    // Remove special characters, replace spaces with dashes
    cleanTitle = cleanTitle.replace(/[^\w\s-]/g, '');
    cleanTitle = cleanTitle.replace(/\s+/g, '-');

    return cleanTitle;
}


// -----------Category Features------------------
//add fixed item
const addrole = async (req, res) => {
    try {
        console.log(req.body);
        const { name,createdBy  } = req.body;
        const status = '1';
        const url = createCleanUrl(req.body.name);
        const userExist = await Role.findOne({ name });

        if (userExist) {
            return res.status(400).json({ msg: "Role already exist" });

        }

        const cmCreated = await Role.create({ name, status,createdBy, url });
        res.status(201).json({
            msg: cmCreated,
            userId: cmCreated._id.toString(),
        });

    } catch (error) {
        res.status(500).json(error);
    }
};
const getdatarole = async (req, res) => {
    try {
        const response = await Role.find();
        if (!response) {
            res.status(404).json({ msg: "No Data Found" });
            return;
        }


        res.status(200).json({ msg: response });
    } catch (error) {
        console.log(`FixedItem ${error}`);
    }
};


const getroleByid = async (req, res) => {
    const id = req.params.id;
    try {
        const response = await Role.find({ _id: id });
        if (!response) {
            res.status(404).json({ msg: "No Data Found" });
            return;
        }
        res.status(200).json({ msg: response });
    } catch (error) {

        console.error("Error in getdata:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.msg });
    }
};
const updateRole = async (req, res) => {
    try {
        console.log(req.body);
        const { name } = req.body;
        const url = createCleanUrl(req.body.name);
        const id = req.params.id;

        const userExist = await Role.findOne({ name, _id: { $ne: id } });

        if (userExist) {
            return res.status(400).json({ msg: "Role already exist" });

        }
        const result = await Role.updateOne({ _id: id }, {
            $set: {
                name: name,
                url: url,
              
            }
        }, {
            new: true,
        });
        res.status(201).json({
            msg: 'Updated Successfully',
        });

    } catch (error) {
        res.status(500).json(error);
    }
};

const updateStatusRole = async (req, res) => {
    try {

        const { status, id } = req.body;

        const result = await Role.updateOne({ _id: id }, {
            $set: {
                status: status,
            }
        }, {
            new: true,
        });
        res.status(201).json({
            msg: 'Updated Successfully',
        });

    } catch (error) {
        res.status(500).json(error);
    }
};



const deleterole = async (req, res) => {
    try {

        const id = req.params.id;
        const response = await Role.findOneAndDelete(({ _id: id }));


        if (!response) {
            res.status(404).json({ msg: "No Data Found" });
            return;
        }
        res.status(200).json({ msg: response });
    } catch (error) {
        console.log(`Category ${error}`);
    }
};


const categoryOptions = async (req, res) => {
    try {
        const item = await Category.find({ status: 1 });
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


module.exports = { addrole,getdatarole,getroleByid,updateRole,deleterole,categoryOptions,updateStatusRole };