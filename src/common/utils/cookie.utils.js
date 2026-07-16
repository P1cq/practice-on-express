import crypto from "node:crypto";
import { env } from "./index.js";

const REFRESH_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // 1y, matches refresh token expiry

const baseCookieOptions = () => ({
  secure: env.nodeEnv === "production",
  sameSite: process.env.COOKIE_SAME_SITE || "lax",
  path: "/",
});

export const generateCsrfToken = () => crypto.randomBytes(24).toString("hex");

export const setAuthCookies = function (res, { refreshToken, csrfToken }) {
  const options = baseCookieOptions();

  res.cookie("refreshToken", refreshToken, {
    ...options,
    httpOnly: true,
    maxAge: REFRESH_MAX_AGE_MS,
  });

  res.cookie("csrfToken", csrfToken, {
    ...options,
    httpOnly: false,
    maxAge: REFRESH_MAX_AGE_MS,
  });
};

export const clearAuthCookies = function (res) {
  const options = baseCookieOptions();

  res.clearCookie("refreshToken", { ...options, httpOnly: true });
  res.clearCookie("csrfToken", { ...options, httpOnly: false });
};
