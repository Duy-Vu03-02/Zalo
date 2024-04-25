import bcrypt from "bcrypt";
import { slice } from "lodash";

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
