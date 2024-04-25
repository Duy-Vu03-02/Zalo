import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import { connectionDB } from "./config/db/db";
import router from "./router/index";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;
connectionDB();

app.use(
  cors({
    credentials: true,
  })
);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", router());

app.listen(port, () => {
  console.log("Server listen on port: ", port);
});
