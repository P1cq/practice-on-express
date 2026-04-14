import { Router } from "express";
import { getAllUsers, getProfile } from "./user.service.js";
import { BadRequist, SYS_ERRORS_MESSAGES } from "../auth/index.js";
import { decrypt,uploadFiles} from "./index.js";
import { isAuthentication } from "../../middleware/index.js";
const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const usersData = await getAllUsers({ email: { $exists: true } });

    res.status(200).json({
      success: true,
      message: "User created successfully",
      usersData,
    });
  } catch (error) {
    res.status(error.cause || 500).json({
      success: false,
      message: error.message,
    });
  }
});


router.patch('/upload-pic-profile',isAuthentication,uploadFiles().single('image'),(req,res,next)=>{

console.log(req.user);
 res.status(201).json({
    success: true,
    message: SYS_ERRORS_MESSAGES.user.userGet,
  
  });


});


router.get("/profile", isAuthentication, async (req, res, next) => {
  //     console.log(req.headers);
  //     const {authorization}= req.headers;
  //     const payload=verifyToken(authorization,'12i47281y647d18d823hr1232144kksklslske990921d1')

  //     const userProfile = await getProfile({_id:{$exists:true,$eq:payload.sub}});
  // if(!userProfile) {

  //    return res.status(404).json({
  // success: false,
  // message: SYS_ERRORS_MESSAGES.user.notFound

  // });
  // throw new BadRequist(SYS_ERRORS_MESSAGES.user.notFound)
  // };
  const { userProfile } = req.user;
  if (userProfile.phoneNumber) {
    const phone = decrypt(userProfile.phoneNumber);
    userProfile.phoneNumber.number = phone;
  }
  res.status(200).json({
    success: true,
    message: SYS_ERRORS_MESSAGES.user.userGet,
    user: userProfile,
  });
  // } catch (error) {
  //   res.status(error.cause||500).json({
  //     success: false,
  //     message: error.message,
  //   });
  // }
});

export { router as userRouter };
