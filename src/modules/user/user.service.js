
import {userRepo} from './index.js';
import { SYS_ERRORS_MESSAGES,ConfligExptions ,NotFound} from './index.js';


export const checkUserExists= async function (email) {
    
  return await userRepo.getOne(email);

};


export const getAllUsers= async function (filter) {
  
try{
return await userRepo.getAll(filter);

}catch(error){

    throw new ConfligExptions(SYS_ERRORS_MESSAGES.user.alreadyExists);

};


};

export const getProfile= async function (filter) {
  
try{
  return await userRepo.getOne(filter);
}catch(error){

    throw new Error(error.message);

};


};

