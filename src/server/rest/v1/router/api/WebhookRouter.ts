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
    this.buildGetAllWebhookRoute();
    this.buildDeleteWebhookRoute();
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
  buildGetAllWebhookRoute() {
    this.router.get(`/webhooks`, (req: Request, res: Response, next: NextFunction) => {
      void RouterUtils.handleRestServerAction(
        WebhookService.handleGetWebhooks.bind(this),
        ServerAction.WEBHOOKS,
        req,
        res,
        next
      );
    });
  }
  buildDeleteWebhookRoute() {
    this.router.delete(`/webhooks/:event`, (req: Request, res: Response, next: NextFunction) => {
      void RouterUtils.handleRestServerAction(
        WebhookService.handleDeleteWebhooks.bind(this),
        ServerAction.WEBHOOKS,
        req,
        res,
        next
      );
    });
  }
}
