import { EventTypes } from './Events';

export interface Callback {
  eventType?: EventTypes;
  url?: string;
}
