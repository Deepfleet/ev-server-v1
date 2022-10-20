import axios from 'axios';
import { Worker, Job } from 'bullmq';
import WebhookService from '../server/rest/v1/service/WebhookService';
import TenantStorage from '../storage/mongodb/TenantStorage';
import WebhookStorage from '../storage/mongodb/WebhookStorage';
import { Callback, CallbackEvent } from '../types/Callback';
import Tenant from '../types/Tenant';
import Logging from '../utils/Logging';
import { CallbackTrigger } from './CallbackTriggerService';
export class CallbackHandler {
  public constructor() {
    this.setupWorker();
  }

  public async setupWorker() {
    const worker = new Worker(CallbackTrigger.QUEUE_NAME, this.handleCallBack, {
      connection: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  public async handleCallBack(job: Job) {
    let callBack: CallbackEvent = job.data;
    const { tenantId, type, data } = callBack;
    //Find if any webhook for this event exists for this tenant
    let tenant: Tenant = await TenantStorage.getTenant(tenantId);
    if (!tenant) {
      Logging.logConsoleDebug(`No tenant details found for id ${tenantId}`);
    }
    if (tenant) {
      Logging.logConsoleDebug(`Fetching webhook def for ${tenant.name} and Event ${type}`);
      Logging.logConsoleDebug(typeof type);
      let callBackDef: Callback = await WebhookStorage.getWebhook(tenant, type);
      Logging.logConsoleDebug(`Callback is defined ? ${callBackDef !== null}`);
      if (callBackDef) {
        let callBackUrl = callBackDef.url;
        let msgData = [];
        msgData.push({ CPO: tenant.name });
        msgData.push({ Event: type });
        msgData.push({ ...data });
        let response = await axios.post(callBackUrl, msgData);
        Logging.logConsoleDebug(
          `Executed with code ${response.statusText} and data ${response.data}`
        );
        let status = response.status === 200 ? 'Success' : 'Failure';
        let message =
          response.status === 200
            ? 'Callback executed successfully.'
            : `Callback failed with code ${response.status} and data ${response.data} .`;
        WebhookStorage.saveWebhookResult(tenant, callBack, message, status);
      } else {
        Logging.logConsoleDebug(
          `No webhooks are found for Tenant ${tenant.name} and Event ${type}`
        );
      }
    } else {
      Logging.logConsoleError(`No Tenant found for ID ${tenantId}`);
    }
    //If there is none log the message and return
    //If an webhook exists , make a call using axios , log and return.
    return { status: 200, message: 'Success' };
  }
}
