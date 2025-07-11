require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const port = process.env.PORT || 8000;

// Database Connection
const connectDB = require("./utils/db");

// Routes
const authRoute = require("./router/auth-router");
const roleRoute = require("./router/role-router");
const profileRoute = require("./router/profile-router");
const employeeRoute = require("./router/employee-router");
const clientRoute = require("./router/client-router");
const projectRoute = require("./router/project-router");
const taskRoute = require("./router/task-router");


// Middlewares
const errorMiddleware = require("./middlewares/validate-middleware");
const errorMiddleware1 = require("./middlewares/error-middleware");

// ✅ CORS Configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Parse JSON
app.use(express.json());

// ✅ Static Files

app.use('/attachment', express.static(path.join(__dirname, 'public/attachment')));

// ✅ API Routes
app.use("/api/auth", authRoute);
app.use("/api/role", roleRoute);
app.use("/api/profile", profileRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/client", clientRoute);
app.use("/api/project",projectRoute);
app.use("/api/task",taskRoute);


// otp
app.use(errorMiddleware);
app.use(errorMiddleware1);
connectDB().then( ()=>{
    app.listen(port, () =>{
        console.log(`server is running at port no ${port}`);
    });
});
