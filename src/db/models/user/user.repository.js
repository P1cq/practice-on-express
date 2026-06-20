import { DBRepository } from "../../repository/index.js";
import { User } from "./User.model.js";

// export const userRepo = new DBRepository(User);

class UserRepository extends DBRepository {
  constructor() {
    super(User);
  }
}

export const userRepo = new UserRepository();
