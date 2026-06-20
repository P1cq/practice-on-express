import { DBRepository } from "../../repository/index.js";

import { OTP } from "./otp.model.js";

export const otpRepo = new DBRepository(OTP);
