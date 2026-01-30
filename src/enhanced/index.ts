import { Configuration } from '../configuration';
import { UserApi } from '../api/user-api';
import { EventApi } from '../api/event-api';
import { GroupApi } from '../api/group-api';
import { EnhancedUserApi } from './enhanced-user-api';
import { EnhancedEventApi } from './enhanced-event-api';
import { EnhancedGroupApi } from './enhanced-group-api';

/**
 * Configuration for the enhanced client (same shape as ProximaNexusClientConfig).
 * Defined here to avoid circular dependency with main index.
 */
export interface EnhancedClientConfig {
  baseURL?: string;
  apiKey: string;
  timeout?: number;
  axiosConfig?: any;
}

export { EnhancedUserApi } from './enhanced-user-api';
export { EnhancedEventApi } from './enhanced-event-api';
export { EnhancedGroupApi } from './enhanced-group-api';
export {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  EnhancedClientError,
  transformAxiosError,
  unwrap,
} from './errors';
export type { EnhancedClientError as EnhancedClientErrorType } from './errors';
export * from './types';

/**
 * Enhanced Proxima Nexus client with a simplified, domain-driven API.
 * Wraps the base APIs and provides cleaner method signatures and convenience methods.
 * Use `client.base` to access the raw APIs when needed.
 *
 * Accepts either EnhancedClientConfig or a ProximaNexusClient instance for base.
 */
export class EnhancedProximaNexusClient {
  public readonly users: EnhancedUserApi;
  public readonly events: EnhancedEventApi;
  public readonly groups: EnhancedGroupApi;
  public readonly base: InstanceType<typeof import('../index').ProximaNexusClient>;

  constructor(
    configOrBase:
      | EnhancedClientConfig
      | InstanceType<typeof import('../index').ProximaNexusClient>
  ) {
    const isConfig = typeof (configOrBase as EnhancedClientConfig).apiKey === 'string';
    if (isConfig) {
      const config = configOrBase as EnhancedClientConfig;
      // Dynamic import to break cycle: main index will export EnhancedProximaNexusClient
      // and we need ProximaNexusClient here. We construct base client from same config.
      const { ProximaNexusClient } = require('../index') as {
        ProximaNexusClient: new (c: EnhancedClientConfig) => InstanceType<typeof import('../index').ProximaNexusClient>;
      };
      this.base = new ProximaNexusClient(config);
    } else {
      this.base = configOrBase as InstanceType<typeof import('../index').ProximaNexusClient>;
    }
    const userApi = this.base.users;
    const eventApi = this.base.events;
    const groupApi = this.base.groups;
    this.users = new EnhancedUserApi(userApi);
    this.events = new EnhancedEventApi(eventApi);
    this.groups = new EnhancedGroupApi(groupApi);
  }
}

export default EnhancedProximaNexusClient;
