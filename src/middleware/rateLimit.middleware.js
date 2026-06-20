import rateLimit from "express-rate-limit";

//  export const sendOtpLimiter = rateLimit({
//   windowMs: 30 * 60 * 1000,
//   max: 2,
//   message: { message: "try it after 30 mints" },

// });

export const resendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: "try it another time later " },
  handler: (req, res, next) => {
    throw new Error("too many tries", { cause: 429 });
  },
  legacyHeaders: false,
});
