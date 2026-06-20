import { Router } from "express";
import {
  uploadFiles,
  messageRepo,
  isAuthentication,
  NotFound,
  getIO
} from "./index.js";

import { BadRequist } from "../auth/index.js";

import { fileUpload } from "../user/index.js";
import { createMessage } from "./message.service.js";
import { populate } from "dotenv";
const router = Router();

router.post(
  "/anonymous/:resiverId",
  uploadFiles().array("attachments"),
  async (req, res, next) => {
    console.log(123);
    const { resiverId } = req.params;
    const { content } = req.body;
    const file = req.files;

    const createM = await createMessage(content, resiverId, undefined, file);

    if (!createM) throw new BadRequist("fails to send message ");

    const io = getIO();
    io.to(resiverId.toString()).emit('new_notification', {
      type: 'NEW_MESSAGE',
      title: 'وصلتك رسالة من مجهول',
      message: { content, file },
    });

    res.status(201).json({
      message: "message created succefuly",
      succes: true,
    });
  },
);

router.get(
  "/",
  isAuthentication,
  uploadFiles().array("attachments"),
  async (req, res, next) => {
    const messages = await messageRepo.getAll(
      { $or: [{ resiverId: req.user._id }, { senderId: req.user._id }] },
      {},
      {
        populate: [
          { path: "resiverId", select: " name email" },
          { path: "senderId", select: " name email" },
        ],
      },
    );
    if (messages.length === 0) throw new NotFound('no found messages')

    const sortedMessages = Array.isArray(messages)
      ? messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];
    console.log(sortedMessages);

    return res.status(200).json({
      success: true,
      message: "get all messages succefully",
      data: sortedMessages,
    });
  },
);

router.get("/:id", isAuthentication, async (req, res, next) => {
  const message = await messageRepo.getOne(
    {
      _id: req.params.id,
      $or: [{ resiverId: req.user._id }, { senderId: req.user._id }],
    },
    {},
    {
      populate: [
        { path: "resiverId", select: " name email" },
        { path: "senderId", select: " name email" },
      ],
    },
  );

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Message not found",
    });
  };

  return res.status(200).json({
    success: true,
    message: "Message get successfully",
    data: message,
  });
});

router.delete("/:id", isAuthentication, async (req, res, next) => {
  const deleteMessage = await messageRepo.deleteOne({
    _id: req.params.id,
   $or:[{ resiverId: req.user._id }, { senderId: req.user._id }] ,
  });
console.log(deleteMessage);
  if (!deleteMessage||deleteMessage.deletedCount==0) throw new NotFound("Message not found or you are not authorized to delete it");
  return res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});

router.post(
  "/public/:resiverId",
  isAuthentication,
  uploadFiles().array("attachments"),
  async (req, res, next) => {
    console.log(req.user);

    const { content } = req.body;
    const receiverId = req.params.resiverId;
    const senderId = req.user._id;
    const file = req.files;

    const createM = await createMessage(content, receiverId, senderId, file);

     const io = getIO();
        
        // نرسل الحدث إلى غرفة المستلم فقط (بناءً على الـ ID بتاعه اللي عمل بيه socket.join)
        io.to(receiverId.toString()).emit('new_notification', {
            type: 'NEW_MESSAGE',
            title: `وصلتك رسالة من مجهول`,
            message: {content,file}, // البيانات التي يحتاجها الفرونت اند لعرضها فوراً
        });

    if (!createM) {
      return res.status(404).json({
        success: true,
        message: "fail to send message",
      });
    }

    return res.status(201).json({
      success: true,
      message: "send message succefuly",
      data: { content },
    });
  },
);

export { router as messageRouter };
