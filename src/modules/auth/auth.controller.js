import { Router } from "express";
import {
  checkUserExists,
  createUser,
  SYS_ERRORS_MESSAGES,
  SYS_ROLES,
  NotFound,
  BadRequist,
  hash,
  compare,
  encrypt,
  genarateTokens,
  verifyToken,
  uploadFiles,
} from "./index.js";
import { isValidtion } from "../../middleware/index.js";
import { signupSchema, loginSchema } from "./auth.validation.js";

const router = Router();
router.post(
  "/sign-up",
  uploadFiles().none(),
  isValidtion(signupSchema),
  async (req, res, next) => {

   console.log(req.body);
    try {
      await checkUserExists({
        email: { $eq: req.body.email, $ne: null, $exists: true },
      });
      // prepare data
      req.body.role = SYS_ROLES.user;
      req.body.password = await hash(req.body.password, 11);

      req.body.phoneNumber = encrypt(req.body.phoneNumber);
      console.log(req.body.phoneNumber);

      const result = await createUser(req.body);

      return res.status(201).json({
        success: true,
        message: SYS_ERRORS_MESSAGES.user.userCreated,
      });
    } catch (error) {
      throw new Error(error.message, error.cause);
    }
  },
);

router.post("/login",uploadFiles().none(), isValidtion(loginSchema), async (req, res, next) => {
  const { email, password } = req.body;
console.log(email,password);
  const userExists = await checkUserExists({
    email: { $eq: email, $ne: null, $exists: true },
  });
console.log(userExists);
  const match = await compare(
    password,
    userExists?.password ||
      "$2b$11$kBExWF1W9QjukTnLVvqdDuzoRujkFk/LiCfxxeTRE0K3vGr8f9sHW",
  );
console.log(match);
  if (!userExists) throw new BadRequist(SYS_ERRORS_MESSAGES.user.failToLogin);
  if (!match) throw new BadRequist(SYS_ERRORS_MESSAGES.user.failToLogin);

  //   userExists.password= undefined;

  // genrate token
  const { refreshToken, accesToken } = genarateTokens({
    sub: userExists._id,
    role: userExists.role,
  });

  res.status(200).json({
    message: "login succefully",
    succes: true,
    data: { accesToken, refreshToken },
  });
});

router.get("/refresh-token", (req, res, next) => {
  const { authorization } = req.headers;

  //  const payload= jwt.verify(authorization,
  //     "223rryrt56wew28irjdkg019238uriplxasdf01923j312hf")
  const payload = verifyToken(
    authorization,
    "223rryrt56wew28irjdkg019238uriplxasdf01923j312hf",
  );

  console.log(payload);
  delete payload.exp;
  delete payload.iat;
  const { accesToken, refreshToken } = genarateTokens(payload);

  res.status(201).json({
    succes: true,
    message: "refresh token created succefully",
    data: { accesToken, refreshToken },
  });
});

export { router as authRouter };
