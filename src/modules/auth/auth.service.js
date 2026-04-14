

import {userRepo} from './index.js'


export const createUser=async function (data) {
  
    
  return await userRepo.create(data);

};



