import {
  SYS_ERRORS_MESSAGES,
  ConfligExptions,
  NotFound,
  otpRepo,
  BadRequist,
  userRepo,
  tokenRepo,
  redisClint,
  decrypt,
} from "./index.js";
import fs from "node:fs";

export const checkUserExists = async function (email) {
  return await userRepo.getOne(email);
};

export const getAllUsers = async function (filter) {
  try {
    return await userRepo.getAll(filter);
  } catch (error) {
    throw new ConfligExptions(SYS_ERRORS_MESSAGES.user.alreadyExists);
  }
};

export const getProfile = async function (filter) {

    return await userRepo.getOne(filter);

};

export const fileUpload = async function (user, filePath) {
  await userRepo.updateOne({ _id: user._id }, { profileImage: filePath.path });

  if (!user) throw NotFound(SYS_ERRORS_MESSAGES.user.notFound);

  if (fs.existsSync(user.profileImage)) fs.unlinkSync(user.profileImage);

  return user;
};

export const updateCreadintials = async function (user) {
  return await userRepo.updateOne(
    { _id: user._id },
    { creadintialsAt: Date.now() },
  );
};

export const logout = async function (payload, user) {

  const blockToken = await redisClint.set(
    `block-token:${payload.jti}`,
    payload.jti,
    { EX: payload.exp - Math.floor(Date.now() / 1000) },
  );
  if (!blockToken) throw new BadRequist("invalid to block it");
};

export const checkUserAndGetProfile= async function (user) {
    console.log(user);
    if(!user)throw new NotFound(SYS_ERRORS_MESSAGES.user.notFound);
    if (user.phoneNumber) {
      const phone = decrypt(user.phoneNumber);
      user.phoneNumber.number = phone;
    };

    return user;
}