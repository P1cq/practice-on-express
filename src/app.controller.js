import {env} from '../config/config.service.js'
import express from "express";
import {authRouter,userRouter,taskRouter} from './modules/index.js';
import {connectDb} from './db/index.js';
import { decrypt, encrypt } from './common/utils/encrypt.utlis.js';

export const runningApp = function () {
  const app = express();

connectDb();

app.use(express.json());
app.use('/auth',authRouter);
app.use('/user',userRouter);
app.use('/task',taskRouter);

  app.use((err, req, res, next) => {
     if (err.name === "TokenExpiredError") {
    err.message = "token invalid, please login";
    err.cause = 401;
  }
    res.status(err.cause||500).json({
      succes: false,
      message: err.message,
       details: err.details,
      stack :err.stack,
    });
  });
  app.listen(env.port, () => {
    console.log(`app is running on port ${env.port}`);
  });
};
