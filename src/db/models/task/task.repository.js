import { DBRepository } from "../../repository/index.js";
import {Task} from './task.model.js'
export const taskRepo = new DBRepository(Task);
