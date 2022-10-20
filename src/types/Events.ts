import { ServerAction } from './Server';

export enum EventTypes {
  UNKNOWN = 'Unknown',
  BOOT = 'BootNotification',
  HEARTBEAT = 'Heartbeat',
  CHARGING_STARTED = 'StartTransaction',
  CHARGING_STOPPED = 'StopTransaction',
}
