import { GroupCreationContext } from "./contexts/GroupCreationContext";
import { Handler } from "./handler";

export abstract class BaseHandler implements Handler {
  private nextHandler: Handler | null = null;

  public setNext(handler: Handler): Handler {
    this.nextHandler = handler;
    return handler;
  }

  public async handle(context: GroupCreationContext): Promise<boolean> {
    if (this.nextHandler) {
      return await this.nextHandler.handle(context);
    }
    return true;
  }
}
