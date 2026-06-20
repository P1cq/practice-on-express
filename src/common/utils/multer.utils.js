import multer, { diskStorage } from "multer";
import fs from "node:fs";
import { BadRequist, Unsupported } from "./errors.utils.js";
import { SYS_ERRORS_MESSAGES } from "../constant/errors.message.constant.js";
export const uploadFiles = function (
  alowwedType = ["image/png", "image/gif", "image/jpeg"],
) {
  return multer({
    fileFilter: (req, file, cb) => {
      console.log(file.mimetype);
      if (!alowwedType.includes(file.mimetype)) {
        return cb(
          new Unsupported(SYS_ERRORS_MESSAGES.file.UnsupportedFile),
          false,
        );
      }
      cb(null, true);
    },

    limits: { fieldSize: 500000 },

    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = req.user
          ? `uploads/${req.user._id}`
          : `uploads/${req.params.resiverId}/messages`;

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        console.log({ file });
        cb(null, Date.now() + Math.random() + "_" + file.originalname);
      },
    }),
  });
};
