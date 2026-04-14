import crypto from "node:crypto";

export const encrypt = function (data) {
  console.log(data);
  const key = Buffer.from('43287546593028475638472133488972');
  const iv = crypto.randomBytes(16);
  const chipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let algorithm = chipher.update(data, "utf-8", "hex");
  algorithm += chipher.final("hex");
  return {algorithm,iv:iv.toString('hex')};
};

export const decrypt = function (data) {
const {algorithm,iv}=data;
const ivBuffer= Buffer.from(iv,'hex');
  const decipher = crypto.createDecipheriv("aes-256-cbc",
     Buffer.from('43287546593028475638472133488972'), ivBuffer);
  let decrypted = decipher.update(algorithm, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
