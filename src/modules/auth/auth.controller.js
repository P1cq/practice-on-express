import { Router } from "express";
import {
  checkUserExists,
  SYS_ERRORS_MESSAGES,
  SYS_ROLES,
  NotFound,
  BadRequist,
  ConfligExptions,
  compare,
  genarateTokens,
  verifyToken,
  uploadFiles,
  otpRepo,
  redisClint,
  UnAouthrize,
  env,
} from "./index.js";
import { isValidtion, resendOtpLimiter } from "../../middleware/index.js";
import { signupSchema, loginSchema, otpSchema } from "./auth.validation.js";
import {
  CheckAndCreateUser,
  verifyEmail,
  resendOtp,
  googleAuth,
  signWithGoogle,
  refreshTokenService,
  loginWithSystem,
} from "./auth.service.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { getIO, emitToUser } from "../../db/webSocket.io.js"; // <-- updated import
const router = Router();

router.post(
  "/sign-up",
  uploadFiles().none(),
  isValidtion(signupSchema),
  async (req, res, next) => {
    console.log(req.body);
    const result = await CheckAndCreateUser(req.body);

    if (!result)
      throw new ConfligExptions(SYS_ERRORS_MESSAGES.user.failToCreate);
    return res.status(201).json({
      success: true,
      message: SYS_ERRORS_MESSAGES.user.userCreated,
      data: result,
    });
  },
);

router.post(
  "/verifyEmail",
  uploadFiles().none(),
  isValidtion(otpSchema),
  async (req, res, next) => {
    const { email, otp } = req.body;

    const created = await verifyEmail(email, otp);
    if (!created) throw BadRequist(SYS_ERRORS_MESSAGES.user.failToUpdate);

    await redisClint.del(email);
    await redisClint.del(`${email}:otp`);

    res.status(201).json({
      success: true,
      message: SYS_ERRORS_MESSAGES.user.userCreated,
      user: created,
    });
  },
);

router.post(
  "/re-send-otp",
  uploadFiles().none(),
  resendOtpLimiter,
  async (req, res, next) => {
    await resendOtp(req.body);

    res.status(200).json({
      success: true,
      message: SYS_ERRORS_MESSAGES.otp.successSendOtp,
    });
  },
);

router.post(
  "/login",
  uploadFiles().none(),
  isValidtion(loginSchema),
  async (req, res, next) => {
    const { _id, refreshToken, accesToken } = await loginWithSystem(req.body);

    // حاول تبعث حدث على WebSocket بعد ال login
    try {
      const ok = emitToUser(_id, "user:login", {
        message: "user_logged_in",
        userId: _id,
      });
      if (ok) console.log("Emitted WebSocket login event for user:", JSON.stringify(_id));
      else
        console.log(
          "WebSocket not initialized yet, emit skipped for user:",
          _id,
        );
    } catch (err) {
      console.log("WebSocket emit failed:", err.message);
    }

    res.status(200).json({
      message: SYS_ERRORS_MESSAGES.user.sucssesToLogin,
      succes: true,
      data: { accesToken, refreshToken, _id },
    });
  },
);

router.get("/refresh-token", async (req, res, next) => {
  const { authorization } = req.headers;

  const { accesToken, refreshToken } = await refreshTokenService(authorization);

  const payload = await verifyToken(refreshToken, env.refreshToken);

  await redisClint.set(`userRefreshToken:${payload.sub}`, refreshToken, {
    EX: payload.exp - Math.floor(Date.now() / 1000),
  });

  res.status(201).json({
    succes: true,
    message: "refreshToken created succefully",
    data: { accesToken, refreshToken },
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  async (req, res, next) => {
    console.log(req.user);
    const { accesToken, refreshToken } = await googleAuth(req.user);

    return res.status(201).json({
      succes: true,
      message: SYS_ERRORS_MESSAGES.user.sucssesToLogin,
      accesToken,
      refreshToken,
    });
  },
);

router.post("/sign-with-google", async (req, res, next) => {
  const signWithG = await signWithGoogle(req.body);
  if (!signWithG) throw new BadRequist("fail to genrate tokens");

  const { accesToken, refreshToken, checkExist } = signWithG;

  return res.status(201).json({
    succes: true,
    message: SYS_ERRORS_MESSAGES.user.sucssesToLogin,
    data: {
      accesToken,
      refreshToken,
      checkExist,
    },
  });
});

export { router as authRouter };
