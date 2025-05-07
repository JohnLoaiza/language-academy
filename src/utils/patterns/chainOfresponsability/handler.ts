// handlers/Handler.ts

import { GroupCreationContext } from "./contexts/GroupCreationContext";

export interface Handler {
  setNext(handler: Handler): Handler;
  handle(context: GroupCreationContext): Promise<boolean>;
}
