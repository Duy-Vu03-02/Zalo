import bcrypt from "bcrypt";
import crypto, { sign } from "crypto";
import sharp from "sharp";
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

export const genderJWT = (body: any) => {
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
  return `${token}.${signature}`;
};

export const descryptJWT = (token: String) => {
  const jwtSecretkey = process.env.JWT_SECURITY;
  const [headerBase64, payloadBase64, signature] = token.split(".");
  const header = atob(headerBase64);
  const payload = atob(payloadBase64);

  const hmac = crypto.createHmac("sha256", jwtSecretkey);
  const newSignature = hmac
    .update(`${headerBase64}.${payloadBase64}`)
    .digest("base64url");

  if (signature === newSignature) {
    return JSON.parse(payload);
  }
  return false;
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
