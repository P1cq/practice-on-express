
import { Router } from "express";
import { checkUserExists, createTask, getAllTasks } from "./index.js";
import { ObjectId } from "mongodb";

const router = Router();
router.post("/", async (req, res, next) => {
  try {
    const checkEsists = await checkUserExists(req.body);

    if (!checkEsists) throw new Error("User not found", { cause: 404 });
    req.body.createdBy = new ObjectId(req.body.createdBy);
    const taskResult = await createTask(req.body);

    return res.status(201).json({
      success: true,
      message: "task created successfully",
      data: taskResult,
    });
  } catch (error) {
    res.status(error.cause || 500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const result = await getAllTasks({});
    res.status(200).json({
      success: true,
      message: "tasks get successfully",
      data: result,
    });
  } catch (error) {
    res.status(error.cause || 500).json({
      success: false,
      message: error.message,
    });
  }
});

export { router as taskRouter };
