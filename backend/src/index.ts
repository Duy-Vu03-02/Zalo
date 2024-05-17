import { server, app } from "./socket/socket";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import compression from "compression";
import { connectionDB } from "./config/db/db";
import router from "./router/index";
import * as dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;
connectionDB();

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
};
app.use(cors());

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", router());

server.listen(port, () => {
  console.log("Server listen on port: ", port);
});
