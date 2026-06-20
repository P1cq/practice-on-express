import crypto from "node:crypto";
import { env } from "./index.js";
export const encrypt = function (data) {
  console.log(data);
  const key = Buffer.from(env.key);
  const iv = crypto.randomBytes(16);
  const chipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let algorithm = chipher.update(data, "utf-8", "hex");
  algorithm += chipher.final("hex");
  return { algorithm, iv: iv.toString("hex") };
};

export const decrypt = function (data) {
  const { algorithm, iv } = data;
  const ivBuffer = Buffer.from(iv, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(env.key),
    ivBuffer,
  );
  let decrypted = decipher.update(algorithm, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
