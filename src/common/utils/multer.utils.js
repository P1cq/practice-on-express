import multer, {diskStorage} from "multer";
import fs from "node:fs";
import { BadRequist } from "./errors.utils.js";
export const uploadFiles = function (
  alowwedType = ["image/png", "image/gif", "image/jpeg"],
) {
  return multer({
    fileFilter: (req, file, cb) => {
      console.log(file.mimetype);
      if (!alowwedType.includes(file.mimetype)) {
        return cb(new BadRequist("invalid format file uploaded"), false);
      }
      cb(null, true);
    },

    limits: { fieldSize: 500000 },

    storage: diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync(`uploads/${req.user._id}`)){ fs.mkdirSync(`uploads/${req.user._id}`,{ recursive: true });}
        cb(null, `uploads/${req.user._id}`);
      },
      filename: (req, file, cb) => {
        console.log({ file });
        cb(null, Date.now() + Math.random() + "_" + file.originalname);
      },
    }),
  });
};
