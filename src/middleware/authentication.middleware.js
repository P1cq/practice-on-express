
import { verifyToken ,userRepo} from "./index.js";




export const isAuthentication=async  (req,res,next)=> {
    
     const {authorization}= req.headers;
        const payload=verifyToken(authorization,'12i47281y647d18d823hr1232144kksklslske990921d1')
      
        const userProfile = await userRepo.getOne({_id:{$exists:true,$eq:payload.sub}});
    if(!userProfile) {
    
    //    return res.status(404).json({
    // success: false,
    // message: SYS_ERRORS_MESSAGES.user.notFound
    
    // });
    throw new BadRequist(SYS_ERRORS_MESSAGES.user.notFound)
    };
    req.user=userProfile;
    next()
};