// server/config/dbConnection.js
const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected to:" + connect.connection.name);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDb;
