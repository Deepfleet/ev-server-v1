import { NextFunction, Request, Response } from 'express';
import WebhookStorage from '../../../../storage/mongodb/WebhookStorage';
import { Callback } from '../../../../types/Callback';
import { EventTypes } from '../../../../types/Events';
import { ServerAction } from '../../../../types/Server';
import Constants from '../../../../utils/Constants';

export default class WebhookService {
  public static async handleCreateWebhook(
    action: ServerAction,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { eventType, url } = req.body;
    const event = eventType as EventTypes;
    let callBack: Callback = {
      eventType: event,
      url: url,
    };
    await WebhookStorage.saveWebhook(req.tenant, callBack);
    res.json(Constants.REST_RESPONSE_SUCCESS);
    next();
  }

  public static async handleGetWebhook(
    action: ServerAction,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let callbacks: Callback[] = [];
    const event = req.params.event as EventTypes;
    let callback = await WebhookStorage.getWebhook(req.tenant, event);
    if (callback) {
      callbacks.push(callback);
      res.json({ callbacks: callbacks, ...Constants.REST_RESPONSE_SUCCESS });
    } else {
      res.status(404).json({ message: 'Not found event' });
    }
    next();
  }
  public static async handleGetWebhooks(
    action: ServerAction,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let callbacks = await WebhookStorage.getWebhooks(req.tenant);
    if (callbacks) {
      res.json({ callbacks: callbacks, ...Constants.REST_RESPONSE_SUCCESS });
    } else {
      res.status(404).json({ message: 'Not found event' });
    }
    next();
  }
}
