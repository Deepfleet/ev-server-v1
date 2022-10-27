import { EventTypes } from './Events';

export interface Callback {
  eventType?: EventTypes;
  url?: string;
}

export interface CallbackEvent {
  tenantId: string;
  type: EventTypes;
  data?: any;
  triggeredTime: Date;
}

export interface CallbackEventResult {
  type: EventTypes;
  data?: Record<string, any>[];
  triggeredTime: Date;
  message?: string;
  status?: string;
}
