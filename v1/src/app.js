const express = require("express");
const helmet = require("helmet");
const config = require("./configs");
const { projectRoutes, userRoutes } = require("./routes");
const loaders = require("./loaders");
const events = require("./events");
const cookieParser = require("cookie-parser");
// const cors = require("cors");

config();
loaders();
events();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
// app.use(cors());

app.use("/projects", projectRoutes.router);
app.use("/users", userRoutes.router);

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is running on ${process.env.APP_PORT}`);
});
