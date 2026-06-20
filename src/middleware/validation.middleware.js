// aplly validation
// shema and data coming
import joi from "joi";
import { BadRequist, SYS_GENDAR, SYS_ROLES, Unprocessable } from "./index.js";
export const isValidtion = (schema) => {
  return (req, res, next) => {
    const validation = schema.validate(req.body, { abortEarly: false });

    if (validation.error) {
      let messageError = validation.error.details.map((err) => {
        return { message: err.message, path: err.path[0] };
      });
      console.log(messageError);

      throw new Unprocessable(
        "The provided data failed validation checks",
        messageError,
      );
    }
    next();
  };
};

export const genralScema = {
  name: joi
    .string()
    .min(3)
    .max(20)
    .trim()
    .message({
      "string.base": "name must be type of string",
      "any.required": "name is reqiured",
    })
    .required(),
  password: joi
    .string()
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    )
    .messages({
      "tring.pattern.base":
        "invalid passord must be incloud ( at least one lowercase letter,at least one uppercase letter,at least one digit (0-9),at least one special character from a defined set,at least 8 characters from the allowed set)",
    })
    .required(),
  rePassword: joi
    .string()
    .valid(joi.ref("password"))
    .messages({ "any.only": "must be match with password" })
    .required(),
  phoneNumber: joi.string().pattern(/^01[0-5][0-9]{8}$/),
  gender: joi
    .number()
    .valid(...Object.values(SYS_GENDAR))
    .default(SYS_GENDAR.male),
  role: joi
    .number()
    .valid(...Object.values(SYS_ROLES))
    .default(SYS_ROLES.user),
};
