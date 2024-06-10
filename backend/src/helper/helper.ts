import bcrypt from "bcrypt";
import crypto, { sign } from "crypto";
import sharp from "sharp";
import { head, slice, String } from "lodash";
import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const authentication = async (password: string) => {
  const saltRounds = 10;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.error(err);
  }
};

export const comparePass = async (passCheck: string, passDB: string) => {
  try {
    const result = await bcrypt.compare(passCheck, passDB);
    return result;
  } catch (err) {
    console.error(err);
  }
};

export const genderToken = (payload: any) => {
  try {
    if (payload) {
      const accessSecret = process.env.ACCESS_JWT_SECRET;
      const token = jwt.sign(payload, accessSecret, {
        expiresIn: "1h",
      });
      return token;
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const verifyToken = async (token: string) => {
  try {
    const accessSecret = process.env.ACCESS_JWT_SECRET;
    if (token !== null) {
      const result = await jwt.verify(token, accessSecret);
      if (result) {
        return true;
      }
    }
    return false;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new Error(err.name);
    }
    console.error(err);
    return false;
  }
};

export const genderRefetchToken = (payload: any) => {
  try {
    if (payload) {
      const reftechSecret = process.env.REFETCH_JWT_SECRET;
      const refetchToken = jwt.sign(payload, reftechSecret, {
        expiresIn: "30d",
      });

      return refetchToken;
    }
    return false;
  } catch (err) {
    // console.error(err);
    return false;
  }
};

export const verifyRefetchToken = async (token: string) => {
  try {
    if (token) {
      const reftechSecret = process.env.REFETCH_JWT_SECRET;
      const result = await jwt.verify(token, reftechSecret);
      if (result) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const imageCompression = async (
  stringBase64: string[]
): Promise<string[]> => {
  const result = await Promise.all(
    stringBase64.map(async (item) => {
      if (item.includes("base64")) {
        return item;
      }
      try {
        const buffer = await sharp(
          Buffer.from(item.replace(/^data:image\/\w+;base64,/, ""), "base64")
        )
          .jpeg({ quality: 80 })
          .toBuffer();
        const base64Image = buffer.toString("base64");
        return `data:image/png;base64,${base64Image}`;
      } catch (err) {
        // console.error(err);
        return item;
      }
    })
  );

  return result;
};
