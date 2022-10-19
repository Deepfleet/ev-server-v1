import express, { NextFunction, Request, Response, Router } from 'express';
import { ServerAction } from '../../../../../types/Server';
import RouterUtils from '../../../../../utils/RouterUtils';
import WebhookService from '../../service/WebhookService';

export default class WebhookRouter {
  private router: Router;
  public constructor() {
    this.router = express.Router();
  }
  public buildRoutes(): express.Router {
    this.buildGetWebhookRoute();
    this.buildCreateWebhookRoute();
    return this.router;
  }
  buildCreateWebhookRoute() {
    this.router.post(`/webhooks`, (req: Request, res: Response, next: NextFunction) => {
      void RouterUtils.handleRestServerAction(
        WebhookService.handleCreateWebhook.bind(this),
        ServerAction.WEBHOOKS,
        req,
        res,
        next
      );
    });
  }
  buildGetWebhookRoute() {
    this.router.get(`/webhooks/:event`, (req: Request, res: Response, next: NextFunction) => {
      void RouterUtils.handleRestServerAction(
        WebhookService.handleGetWebhook.bind(this),
        ServerAction.WEBHOOKS,
        req,
        res,
        next
      );
    });
  }
}
