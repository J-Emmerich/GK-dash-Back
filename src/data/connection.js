process.stdin.resume();
const mongoose = require("mongoose");

const user = process.env.USER;
const password = process.env.PASSWORD;

const uri = `mongodb://${user}:${password}@localhost:27017/imagine?authSource=admin`;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
try {
  mongoose.connect(uri, options);
} catch (error) {
  console.error(error, "on connection error");
}
mongoose.connection.on("connected", () => {
  console.log("Connected to Mongoose");
});
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from Mongoose");
});

// Disconnect from mongoose when server is killed

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  process.exit();
});

module.exports = mongoose;
