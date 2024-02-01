// server/server.js

const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 3001;

app.use(express.json());

// Use the router from contactsRoutes
// const contactsRoutes = require("./routes/contactsRoutes");
app.use("/api/contacts", require("./routes/contactsRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
