import joi from "joi";

import { SYS_GENDAR, SYS_ROLES } from "../../common/index.js";
import { genralScema } from "./index.js";
// aplly validation
// shema and data coming

export const signupSchema = joi
  .object({
    name: genralScema.name,
    email: joi
      .string()
      .pattern(/^\w{3,80}@(gmail|yahoo)(.com|.net|.eu){1,3}/)
      .messages({ "string.pattern.base": "invalid email" }),
    password: genralScema.password,
    rePassword: genralScema.rePassword,
    phoneNumber: genralScema.phoneNumber,
    gender: genralScema.gender,
    role: genralScema.role,
  })
  .or("email", "phoneNumber")
  .required();

export const loginSchema = joi
  .object({
    email: joi
      .string()
      .pattern(/^\w{3,80}@(gmail|yahoo)(.com|.net|.eu){1,3}/)
      .messages({
        "string.pattern.base":
          "invalid email:(Major letter, lowercase letter, number, symbol, and at least 8 characters long):",
      })
      .required(),
    password: joi
      .string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .messages({
        "string.pattern.base":
          "invalid passord must be incloud ( at least one lowercase letter,at least one uppercase letter,at least one digit (0-9),at least one special character from a defined set,at least 8 characters from the allowed set)",
      })
      .required(),
  })
  .required();

export const otpSchema = joi
  .object({
    email: joi
      .string()
      .pattern(/^\w{3,80}@(gmail|yahoo)(.com|.net|.eu){1,3}/)
      .messages({ "string.pattern.base": "invalid email" })
      .required(),
    otp: joi
      .string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .messages({ "string.base": "otp must be number and (6 digite)" })
      .required(),
  })
  .required();
