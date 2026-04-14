
import {taskRepo} from './index.js';

export const createTask= async function (data) {
    
return await taskRepo.create(data);

};

export const getAllTasks= async function (filter) {
  
try{
const tasks= await taskRepo.aggregate([
{$match:filter},
{$lookup:{
    from:'m_users',
    localField:'createdBy',
    foreignField:'_id',
    as:'createdBy'
}},
{$unwind:"$createdBy"},


]);
if(tasks.length==0)throw new Error('No tasks found',{cause:404});
return tasks
}catch(error){

    throw new Error('No tasks found',{cause:404});

};


};