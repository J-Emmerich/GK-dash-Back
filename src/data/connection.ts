// Why is this here?
process.stdin.resume();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require("mongoose");

// This should be a central log system that is not implemented as yet
// const { logError } = require("../middlewares/error-handler");

const {DB_USER, DB_PASSWORD, DB } = process.env
const uri = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.3dgxs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const options = {
  // strictPopulate: false
};

// start the connection when the file is loaded

try {
  mongoose.connect(uri, options);
} catch (error) {
  console.log(error);
}

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongoose");
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from Mongoose");
});
mongoose.connection.on("disconnecting", () => {
  console.log("Disconnecting from Mongoose");
});
mongoose.connection.on("error", (err: string) => {
  console.log(err);
});

// Disconnect from mongoose when server is killed

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  process.exit();
});

module.exports = mongoose;
