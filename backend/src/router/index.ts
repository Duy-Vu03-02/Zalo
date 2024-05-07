import express from "express";

import user from "./userRouter";
import message from "./messageRouter";
import group from "./groupRouter";

const router = express.Router();

export default (): express.Router => {
  user(router);
  message(router);
  // group(router);
  return router;
};
