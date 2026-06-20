import {
  verifyToken,
  userRepo,
  BadRequist,
  tokenRepo,
  redisClint,
  UnAouthrize,
  NotFound,
  env,
  SYS_ERRORS_MESSAGES,
} from "./index.js";

export const isAuthentication = async (req, res, next) => {
  console.log(123);

  const { authorization } = req.headers;
  if (!authorization) {
    return next(new BadRequist("No token provided or invalid format"));
  }

  // const token = authorization.split(' ')[1].trim();
  const token = authorization;
  const payload = verifyToken(token, env.accessToken);
  console.log(payload);
  const userProfile = await userRepo.getOne({
    _id: { $exists: true, $eq: payload.sub },
  });
  console.log(userProfile);
  if (!userProfile) {
    throw new NotFound(SYS_ERRORS_MESSAGES.user.notFound);
  }

  if (userProfile.creadintialsAt.getTime() > payload.iat * 1000)
    throw new UnAouthrize("invalid token login again ");

  // const checkBlackLest= await tokenRepo.getOne({token:payload.jti});
  const checkBlackLest = await redisClint.get(`block-token:${payload.jti}`);
  if (checkBlackLest) throw new UnAouthrize("invalid to login pls login again");

  req.payload = payload;
  req.user = userProfile;
  next();
};
