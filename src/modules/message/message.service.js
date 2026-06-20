
import {messageRepo} from './index.js';


export  const createMessage = async function (
  content,
  receiverId,
  senderId = undefined,
 file ,
) {

  const paths = file?.map((f) => f.path) ?? [];

  const createMessage = await messageRepo.create({
    content,
    resiverId: receiverId,
    senderId,
    attachments: paths,
  });

  return createMessage;
};
