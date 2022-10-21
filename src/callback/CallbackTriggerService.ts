import { Queue } from 'bullmq';
import { Tenant } from 'firebase-admin/lib/auth/tenant';
import { CallbackEvent } from '../types/Callback';
import { EventTypes } from '../types/Events';
import Logging from '../utils/Logging';
export class CallbackTrigger {
  static readonly QUEUE_NAME = 'Callbacks';
  static readonly JOB_NAME = 'CallBackJobs';
  private callbackQueue: Queue;
  constructor() {
    this.callbackQueue = new Queue(CallbackTrigger.QUEUE_NAME, {
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
    await this.callbackQueue.add(CallbackTrigger.JOB_NAME, callBackEvent, {
      delay: 5000,
      removeOnComplete: true,
      removeOnFail: 500,
    });
  }
}
