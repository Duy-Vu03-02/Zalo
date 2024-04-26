import express from "express";

import user from "./userRouter";
import message from "./messageRouter";

const router = express.Router();

export default (): express.Router => {
  user(router);
  message(router);
  return router;
};
