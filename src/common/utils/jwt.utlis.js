import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from './index.js';
export const signToken = function (payload, key, options) {
  payload.jti = crypto.randomBytes(12).toString("hex");

  return jwt.sign(payload, key, options);
};
export const verifyToken = function (
  token,
  key = "12344123141241512414141231312",
) {
  const payload = jwt.verify(token, key);
  return payload;
};

export const genarateTokens = function (payload) {
  const accesToken = signToken(
    payload,
    env.accessToken,
    { expiresIn: "24h" },
  );

  const refreshToken = signToken(
    payload,
   env.refreshToken,
    {
      expiresIn: "1y",
    },
  );

  return { refreshToken, accesToken };
};
