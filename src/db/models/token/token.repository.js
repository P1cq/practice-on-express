import { DBRepository } from "../../repository/index.js";
import { Token } from "./token.model.js";

class tokenRepository extends DBRepository {
  constructor() {
    super(Token);
  }
}

export const tokenRepo = new tokenRepository();
