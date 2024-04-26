import bcrypt from "bcrypt";
import crypto from "crypto";
import { head, slice } from "lodash";
// import * as dotenv from "dotenv";
// dotenv.config();

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

export const genderJWT = (body: String) => {
  const jwtSecretkey = process.env.JWT_SECURITY;
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const payload = body;
  const headerBase64 = btoa(JSON.stringify(header));
  const payloadBase64 = btoa(JSON.stringify(payload));
  const token = `${headerBase64}.${payloadBase64}`;

  const hmac = crypto.createHmac("sha256", jwtSecretkey);
  const signature = hmac.update(token).digest("base64url");
  return signature;
};
