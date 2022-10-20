import { Queue } from 'bullmq';
import { Tenant } from 'firebase-admin/lib/auth/tenant';
import { CallbackEvent } from '../types/Callback';
import { EventTypes } from '../types/Events';
import Logging from '../utils/Logging';
export class CallbackTrigger {
  static readonly QUEUE_NAME = 'Callbacks';
  private callbackQueue: Queue;
  constructor() {
    this.callbackQueue = new Queue('Callbacks', {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  public async submitCallBack(
    tenantId: string,
    eventType: EventTypes,
    data: Record<string, any>[]
  ) {
    let callBackEvent: CallbackEvent = {
      tenantId: tenantId,
      type: eventType,
      data: data,
      triggeredTime: new Date(),
    };
    Logging.logConsoleDebug('Created a callback event record');
    await this.callbackQueue.add('CallBackJobs', callBackEvent, {});
  }
}
