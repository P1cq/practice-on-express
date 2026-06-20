import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import { BadRequist, Unsupported } from "../common/utils/errors.utils.js";

// Middleware to validate file type by magic number (file signatures)
export const fileValidation = async (req, res, next) => {
  // get the file path
  const filePath = req.file.path;
  console.log(filePath);
  // read the file and return buffer
  const buffer = fs.readFileSync(filePath);
  // get the file type
  const type = await fileTypeFromBuffer(buffer);
  // validate
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!type || !allowedTypes.includes(type.mime)) {
    fs.unlinkSync(filePath);
    throw new Unsupported(
      "The uploaded file format is not supported. Please upload an allowed file type.",
    );
  }

  return next();
};
