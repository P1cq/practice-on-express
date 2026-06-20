import { Message } from "./message.model.js";
import { DBRepository } from "./index.js";

class MessageReposetory extends DBRepository {
  constructor() {
    super(Message);
  }
}

export const messageRepo = new MessageReposetory();
