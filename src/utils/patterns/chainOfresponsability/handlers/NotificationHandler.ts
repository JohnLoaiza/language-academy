import { BaseHandler } from "../basehandler";
import { GroupCreationContext } from "../contexts/GroupCreationContext";


export class NotificationHandler extends BaseHandler {
  constructor(private onSuccess: () => void) {
    super();
  }

  async handle(context: GroupCreationContext): Promise<boolean> {
    alert("Grupo creado correctamente");
    this.onSuccess();
    return await super.handle(context);
  }
}
