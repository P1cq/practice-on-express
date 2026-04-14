// import {db} from '../index.js'
// export const task = db.collection('m_tasks');

import { model, SchemaTypes, Schema } from "mongoose";

const schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["todo", "completed"], default: "todo" },
  createdBy: { type: SchemaTypes.ObjectId, ref: "User" },
});

export const Task = model("Task", schema);
