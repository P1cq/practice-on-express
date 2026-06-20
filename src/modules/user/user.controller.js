import { Router } from "express";
import {
  getAllUsers,
  fileUpload,
  updateCreadintials,
  logout,
  checkUserAndGetProfile,
} from "./user.service.js";
import { BadRequist, SYS_ERRORS_MESSAGES } from "../auth/index.js";
import { decrypt, uploadFiles } from "./index.js";
import { isAuthentication, fileValidation, NotFound } from "../../middleware/index.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const usersData = await getAllUsers({ email: { $exists: true } });

    res.status(200).json({
      success: true,
      message: SYS_ERRORS_MESSAGES.user.userCreated,
      usersData,
    });
  } catch (error) {
    res.status(error.cause || 500).json({
      success: false,
      message: error.message,
    });
  }
});

router.patch(
  "/upload-pic-profile",
  isAuthentication,
  uploadFiles().single("image"),
  fileValidation,
  async (req, res, next) => {
    const uploaded = await fileUpload(req.user, req.file);
    console.log(req.user);

    res.status(201).json({
      success: true,
      message: SYS_ERRORS_MESSAGES.user.userGet,
      user: { data: uploaded },
    });
  },
);

router.get("/profile", isAuthentication, async (req, res, next) => {
  console.log(123);
const user =await checkUserAndGetProfile(req.user);

  res.status(200).json({
    success: true,
    message: SYS_ERRORS_MESSAGES.user.userGet,
    user: user,
  });
});

router.patch(
  "/log-out-from-all-devecis",
  isAuthentication,
  uploadFiles().none(),
  async (req, res, next) => {
    const logOutFromAll = await updateCreadintials(req.user);

    if (!logOutFromAll) throw BadRequist("Creaditials not updated");

    res.status(200).json({
      success: true,
      message: SYS_ERRORS_MESSAGES.user.userUpdated,
    });
  },
);

router.post(
  "/black-list",
  isAuthentication,
  uploadFiles().none(),
  async (req, res, next) => {
    console.log(req.payload);
    await logout(req.payload, req.user);

    res.status(200).json({
      success: true,
      message: SYS_ERRORS_MESSAGES.user.blackList,
    });
  },
);

export { router as userRouter };
