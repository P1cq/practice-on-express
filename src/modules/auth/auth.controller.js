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
  setAuthCookies,
  clearAuthCookies,
  generateCsrfToken,
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

    const csrfToken = generateCsrfToken();
    setAuthCookies(res, { refreshToken, csrfToken });

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
      data: { accesToken, _id },
    });
  },
);

router.get("/refresh-token", async (req, res, next) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  const csrfHeader = req.headers["x-csrf-token"];

  if (!incomingRefreshToken) throw new UnAouthrize(SYS_ERRORS_MESSAGES.token.tokenRequired);
  if (!csrfHeader || csrfHeader !== req.cookies?.csrfToken)
    throw new UnAouthrize(SYS_ERRORS_MESSAGES.token.UnauthorizedToken);

  const { accesToken, refreshToken } = await refreshTokenService(incomingRefreshToken);

  const payload = await verifyToken(refreshToken, env.refreshToken);

  await redisClint.set(`userRefreshToken:${payload.sub}`, refreshToken, {
    EX: payload.exp - Math.floor(Date.now() / 1000),
  });

  const csrfToken = generateCsrfToken();
  setAuthCookies(res, { refreshToken, csrfToken });

  res.status(201).json({
    succes: true,
    message: "refreshToken created succefully",
    data: { accesToken },
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
    failureRedirect: `${env.urlFront}/login?error=google_auth_failed`,
  }),
  async (req, res, next) => {
    // Any failure past this point (bad profile data, DB error, ...) must
    // redirect back into the SPA instead of leaking a raw JSON error page
    // mid-OAuth-redirect, which is unrecoverable from the user's perspective.
    try {
      const { refreshToken } = await googleAuth(req.user);

      const csrfToken = generateCsrfToken();
      setAuthCookies(res, { refreshToken, csrfToken });

      return res.redirect(`${env.urlFront}/oauth-callback`);
    } catch (err) {
      console.log("Google OAuth callback failed:", err.message);
      return res.redirect(`${env.urlFront}/login?error=google_auth_failed`);
    }
  },
);

router.post("/sign-with-google", async (req, res, next) => {
  const signWithG = await signWithGoogle(req.body);
  if (!signWithG) throw new BadRequist("fail to genrate tokens");

  const { accesToken, refreshToken, checkExist } = signWithG;

  const csrfToken = generateCsrfToken();
  setAuthCookies(res, { refreshToken, csrfToken });

  return res.status(201).json({
    succes: true,
    message: SYS_ERRORS_MESSAGES.user.sucssesToLogin,
    data: {
      accesToken,
      checkExist,
    },
  });
});

export { router as authRouter };
