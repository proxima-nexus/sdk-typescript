import { Configuration, ConfigurationParameters } from './configuration';
import { UserApi } from './api/user-api';
import { EventApi } from './api/event-api';
import { EventSeriesApi } from './api/event-series-api';
import { GroupApi } from './api/group-api';

// Export all types
export * from './models';

// Export API classes
export { UserApi, EventApi, EventSeriesApi, GroupApi };
export { Configuration, type ConfigurationParameters };

/**
 * Simplified configuration interface for the main client
 */
export interface ProximaNexusClientConfig {
  /**
   * API base URL
   * @default "https://api.proxima-nexus.com"
   */
  baseURL?: string;

  /**
   * API key for authentication
   * Required for all requests
   */
  apiKey: string;

  /**
   * Request timeout in milliseconds
   * @default 30000
   */
  timeout?: number;

  /**
   * Additional axios configuration
   */
  axiosConfig?: any;
}

export class ProximaNexusClient {
  public readonly users: UserApi;
  public readonly events: EventApi;
  public readonly eventSeries: EventSeriesApi;
  public readonly groups: GroupApi;

  constructor(config: ProximaNexusClientConfig) {
    const configuration = new Configuration({
      apiKey: config.apiKey,
      basePath: config.baseURL || 'https://api.proxima-nexus.com',
      baseOptions: {
        timeout: config.timeout || 30000,
        ...config.axiosConfig,
      },
    });

    this.users = new UserApi(configuration);
    this.events = new EventApi(configuration);
    this.eventSeries = new EventSeriesApi(configuration);
    this.groups = new GroupApi(configuration);
  }
}

export default ProximaNexusClient;

// Enhanced client (separate export path to avoid circular dependency in enhanced module)
export {
  EnhancedProximaNexusClient,
  EnhancedUserApi,
  EnhancedEventApi,
  EnhancedEventSeriesApi,
  EnhancedGroupApi,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
  EnhancedClientError,
  transformAxiosError,
  unwrap,
  type EnhancedClientConfig,
} from './enhanced';
export type { EnhancedClientError as EnhancedClientErrorType } from './enhanced';
