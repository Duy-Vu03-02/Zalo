import mongoose, { ConnectOptions } from "mongoose";

interface CustomConnectOptios extends mongoose.ConnectOptions {
  useNewUrlParser?: boolean;
  useUnifiedTopology?: boolean;
  useCreateIndex?: boolean;
  useFindAndModify?: boolean;
}

export const connectionDB = async () => {
  try {
    const baseUrl = process.env.DATABASE_URL;
    const options: CustomConnectOptios = {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      //   useCreateIndex: true,
      //   useFindAndModify: true,
    };
    await mongoose.connect(baseUrl, options);
    console.log("Connect to DB SUCESSFULLY");
  } catch (err) {
    console.error("Connect to DB UNCESSFULLY");
    throw err;
  }
};
