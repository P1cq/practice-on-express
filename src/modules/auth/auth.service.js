import {
  userRepo,
  otpRepo,
  sendEmail,
  createOtpAndSendEmail,
  checkUserExists,
  ConfligExptions,
  SYS_ERRORS_MESSAGES,
  SYS_ROLES,
  hash,
  encrypt,
  BadRequist,
  UnAouthrize,
  redisClint,
  env,
  verifyToken,
  logout,
  updateCreadintials,
  compare,
} from "./index.js";
import { OAuth2Client } from "google-auth-library";
import { genarateTokens } from "../../common/utils/jwt.utlis.js";


export const createUser = async function (data) {
  return await userRepo.create(data);
};


export const loginWithSystem =async function (body) {

  const { email, password } = body;

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

// save refresh token in cashing
   const payload= await verifyToken(refreshToken,env.refreshToken);

 await redisClint.set(`userRefreshToken:${userExists._id}`,
  refreshToken,
  { EX: payload.exp - Math.floor(Date.now() / 1000)});

return {refreshToken,accesToken,_id:userExists._id}
  
}

let attempts=0;
export const verifyEmail = async function (email, otp) {
  // const checkVerifyOtp = await otpRepo.getOne({ email });
  const checkVerifyOtp = await redisClint.get(`${email}:otp`);
  console.log(checkVerifyOtp);
  if (!checkVerifyOtp) throw new BadRequist(SYS_ERRORS_MESSAGES.otp.otpIsExp);

 attempts += 1;

  if (attempts > 3) {
    // await otpRepo.deleteOne({ email });
    await redisClint.del(`${email}:otp`);

    throw new BadRequist("soo many try resend otp");
  };

  // await checkVerifyOtp.save();
  if (checkVerifyOtp !== otp) throw new BadRequist(SYS_ERRORS_MESSAGES.otp.otpNotVerify);
 const user= await redisClint.get(email);
 console.log(JSON.parse(user));
  return await userRepo.create(JSON.parse(user));
};

export const resendOtp = async function (body) {
  const checkVerifyOtp =  await redisClint.get(`${body.email}:otp`);
  if (checkVerifyOtp) throw new BadRequist(SYS_ERRORS_MESSAGES.otp.otpValid);
  return await createOtpAndSendEmail(body);
};

export const CheckAndCreateUser = async function (body) {
  const userExists = await checkUserExists({
    email: { $eq: body.email, $ne: null, $exists: true },
  });

  if (userExists)
    throw new ConfligExptions(SYS_ERRORS_MESSAGES.user.alreadyExists);

  // prepare data
  body.role = SYS_ROLES.user;
  body.password = await hash(body.password, 11);
  body.rePassword= body.password;

  if (body.phoneNumber) {
    body.phoneNumber = encrypt(body.phoneNumber);
    console.log(body.phoneNumber);
  }

  await createOtpAndSendEmail(body);

  // return await createUser(body);
return await redisClint.set(body.email,JSON.stringify(body),{EX:2*24 *60*60});
};

export const googleAuth = async function (user){
  if (!user) throw new BadRequist("Authintcation field with google");

  const { id, email, name, verifyEmail, pic } = user;

  if (verifyEmail == false)
    throw new BadRequist(SYS_ERRORS_MESSAGES.user.unverifiedEmail);

  const checkExist = await checkUserExists({ email });
  if (!checkExist) {
    const userCreated = await createUser({
      name,
      email,
      profileImage: pic,
      is_verified: true,
      provider: "google",
    });
console.log(pic);
    return genarateTokens({
      sub: userCreated._id,
      role: userCreated.role,
      provider: userCreated.provider,
    });
  }

 return genarateTokens({
    sub: checkExist._id,
    role: checkExist.role,
    provider: checkExist.provider,
  });
};

export const refreshTokenService= async function (auth) {
  
  const payload = verifyToken(
    auth,
   env.refreshToken,
  );

const cashRefreshToken= await redisClint.get(`userRefreshToken:${payload.sub}`);
console.log(cashRefreshToken);

if(!cashRefreshToken)throw new UnAouthrize(SYS_ERRORS_MESSAGES.token.UnauthorizedToken);
if(cashRefreshToken!=auth){

  const logoutFromAllDevices= await updateCreadintials({_id:payload.sub});
   await redisClint.del(`userRefreshToken:${payload.sub}`);
  throw new UnAouthrize(SYS_ERRORS_MESSAGES.user.NotAuthenticated);

};

  console.log(payload);
  delete payload.exp;
  delete payload.iat;

return  genarateTokens(payload);

};

export const signWithGoogle= async function (body) {

  const clint= new OAuth2Client(env.clientID);

  const { idToken } = body;

  if (!idToken)throw new UnAouthrize(SYS_ERRORS_MESSAGES.token.tokenRequired);

  const ticket = await clint.verifyIdToken({
idToken,
audience:env.clientID,
  });

  const payload= ticket.getPayload();
const { email,verifyEmail, name, picture, sub: googleId } = payload;
  
 if (verifyEmail == false)
    throw new BadRequist(SYS_ERRORS_MESSAGES.user.unverifiedEmail);

  const checkExist = await checkUserExists({ email });
  if (!checkExist) {
    const userCreated = await createUser({
      name,
      email,
      is_verified: true,
      provider: "google",
    });
    const { accesToken, refreshToken }= genarateTokens({
      sub: userCreated._id,
      role: userCreated.role,
      provider: userCreated.provider,
    });
    const data= {accesToken,refreshToken,checkExist};
    return data;
  };

   const { accesToken, refreshToken }= genarateTokens({
      sub: checkExist._id,
      role: checkExist.role,
      provider: checkExist.provider,
    });
    const data= {accesToken,refreshToken,checkExist};
    return data;


};