import { Callback } from '../../types/Callback';
import { EventTypes } from '../../types/Events';
import global, { FilterParams } from '../../types/GlobalType';
import Tenant from '../../types/Tenant';
import Constants from '../../utils/Constants';
import Logging from '../../utils/Logging';
import DatabaseUtils from './DatabaseUtils';

const MODULE_NAME = 'WebhookStorage';

export default class WebhookStorage {
  public static async saveWebhook(tenant: Tenant, callBack: Callback) {
    const startTime = Logging.traceDatabaseRequestStart();
    const dbRecord = await global.database
      .getCollection<any>(tenant.id, 'callbacks')
      .insertOne(callBack);
    console.log(`DB -> ${JSON.stringify(dbRecord)}`);
    await Logging.traceDatabaseRequestEnd(tenant, MODULE_NAME, 'saveWebhook', startTime, {
      tenant: tenant,
    });
  }
  public static async getWebhook(tenant: Tenant, event: EventTypes) {
    const startTime = Logging.traceDatabaseRequestStart();
    DatabaseUtils.checkTenantObject(tenant);

    const filters: FilterParams = {};
    if (event) {
      filters.$or = [{ eventType: event }];
    }

    const aggregation = [];
    aggregation.push({
      $match: filters,
    });
    aggregation.push({ $limit: Constants.DB_RECORD_COUNT_CEIL });
    const callbackMDB = (await global.database
      .getCollection<any>(tenant.id, 'callbacks')
      .aggregate([...aggregation])
      .toArray()) as Callback[];
    await Logging.traceDatabaseRequestEnd(tenant, MODULE_NAME, 'getWebhook', startTime, {
      tenant: tenant,
    });
    return callbackMDB.length > 0 ? callbackMDB[0] : null;
  }
}
