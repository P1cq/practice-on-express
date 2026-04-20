
import { verifyToken ,userRepo,BadRequist} from "./index.js";




export const isAuthentication=async  (req,res,next)=> {

     const {authorization}= req.headers;
     console.log(authorization);
 if (!authorization ) {
            return next(new BadRequist("No token provided or invalid format"));
        }
     
        const payload=verifyToken(authorization,"12i47281y647d18d823hr1232144kksklslske990921d1");
      console.log(payload);
        const userProfile = await userRepo.getOne({_id:{$exists:true,$eq:payload.sub}});
        console.log(userProfile);
    if(!userProfile) {
    throw new BadRequist(SYS_ERRORS_MESSAGES.user.notFound)
    };
    req.user=userProfile;
    next()
};