/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/first */
require("dotenv").config("../.env");

import "module-alias/register";
import * as express from "express";
import { errorHandler, logError, authenticate } from "@middlewares";
import { createContext } from "@utilities";
import { join } from "path";
import {
  projectRouter,
  authenticationRouter,
  userRouter,
  invoiceRouter,
  customerRouter,
} from "./routes";
import { debugRouter } from "./routes/debug";

// Connects to MongoDB Atlas
// eslint-disable-next-line import/extensions, no-unused-vars, @typescript-eslint/no-unused-vars
const connection = require("./data/connection");

const app = express();
const port = 3000;

// For react
app.use(express.static(join(__dirname, "../client/build")));

app.use(express.json());
app.all("*", createContext);

app.use("/debug", debugRouter());

app.use("/user", authenticationRouter());
app.all("/api/*", authenticate);
app.use("/api/project", projectRouter());
app.use("/api/user", userRouter());
app.use("/api/invoice", invoiceRouter());
app.use("/api/customer", customerRouter());

app.get("*", (req, res) => {
  res.sendFile(join(__dirname, "../client/build/index.html"));
});

app.use(logError);
app.use(errorHandler);

app.listen(port, () => console.log(`App is listening to port ${port}`));
