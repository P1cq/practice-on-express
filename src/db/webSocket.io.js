import {
  env,
  verifyToken,
  userRepo,
  SYS_ERRORS_MESSAGES,
  NotFound,
  UnAouthrize,
} from "./index.js";

let ioInstance = null;
export const webSocketConnect = function (io) {
  // assign immediately so server-side emits can work right after startup
  ioInstance = io;
  console.log("webSocketConnect: ioInstance initialized");

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token; // Expect token to be sent from client after login

      if (!token) {
        return next(new UnAouthrize(SYS_ERRORS_MESSAGES.user.UnauthorizedToken));
      }

      const decoded = verifyToken(token, env.accessToken);

      const currentUser = await userRepo.getOne({ _id: decoded.sub });

      if (!currentUser) {
        return next(new NotFound(SYS_ERRORS_MESSAGES.user.notFound));
      }

      socket.user = currentUser;

      next();
    } catch (err) {
      // Any failure here (bad/expired token, DB error, ...) must reject the
      // socket handshake — it must never escape as an uncaught exception,
      // which would crash the whole server for every connected user.
      next(new UnAouthrize(err.message || SYS_ERRORS_MESSAGES.user.UnauthorizedToken));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    socket.join(userId);
    console.log(`user is connected  user_name is :${socket.user.name}`);

    socket.on("disconnect", () => {
      console.log(`user was disconnected user_name is :${socket.user.name} `);
    });
  });
};

export const getIO = () => {
  // return null instead of throwing so callers can handle absence
  if (!ioInstance) {
    console.log("getIO: Socket.io not initialized yet");
    return null;
  }
  return ioInstance;
};

// helper to safely emit to a user room
export const emitToUser = (userId, event, payload) => {
  if (!ioInstance) {
    console.log("emitToUser failed: Socket.io not initialized");
    return false;
  }
  try {
    ioInstance.to(String(userId)).emit(event, payload);
    return true;
  } catch (err) {
    console.log("emitToUser error:", err.message);
    return false;
  }
};
