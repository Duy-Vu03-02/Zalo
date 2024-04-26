import express from "express";
const app = express();
const server = require("http").createServer(app);
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import { connectionDB } from "./config/db/db";
import router from "./router/index";
import * as dotenv from "dotenv";
dotenv.config();
export const io = require("socket.io")(server);

const port = process.env.PORT;
connectionDB();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
};
app.use(cors(corsOptions));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", router());

import { Socket } from "socket.io";
io.on("connection", (socket: Socket) => {
  console.log("User connection");

  socket.on("disconnect", () => {
    console.log("User disconnect");
  });

  socket.on("chat message", (data) => {
    console.log("Mess: ", data);
    io.emit("chat message", data);
  });
});

server.listen(port, () => {
  console.log("Server listen on port: ", port);
});
