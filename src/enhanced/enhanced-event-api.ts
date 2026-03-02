import type { EventApi } from '../api/event-api';
import { EventControllerGetConnectionsTypeEnum } from '../api/event-api';
import type {
  CreateEventDto,
  EntityConnectionDto,
  EventDto,
  UpdateEventDto,
  UserEntityConnectionDto,
} from '../models';
import { MutateEventEntityConnectionDtoTypeEnum } from '../models/mutate-event-entity-connection-dto';
import { unwrap } from './errors';

export class EnhancedEventApi {
  constructor(private readonly api: EventApi) {}

  async getEvent(
    eventId: string,
    requesterUserId?: string
  ): Promise<EventDto> {
    return unwrap(this.api.get(eventId, requesterUserId));
  }

  async getEvents(
    eventIds: string[],
    requesterUserId?: string
  ): Promise<EventDto[]> {
    return unwrap(this.api.getBatch({ eventIds }, requesterUserId));
  }

  async createEvent(
    creatorUserId: string,
    data: CreateEventDto
  ): Promise<string> {
    return unwrap(this.api.create(creatorUserId, data));
  }

  async updateEvent(
    eventId: string,
    requesterUserId: string,
    data: UpdateEventDto
  ): Promise<string> {
    return unwrap(this.api.update(eventId, requesterUserId, data));
  }

  async deleteEvent(
    eventId: string,
    requesterUserId: string
  ): Promise<void> {
    return unwrap(this.api.remove(eventId, requesterUserId));
  }

  async searchByDisplayName(
    displayName: string,
    requesterUserId?: string,
    limit?: number,
    from?: string,
    to?: string
  ): Promise<EventDto[]> {
    return unwrap(
      this.api.search(
        displayName,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        limit,
        from,
        to,
        requesterUserId
      )
    );
  }

  async searchByRadius(
    latitude: number,
    longitude: number,
    radiusMeters: number,
    requesterUserId?: string,
    limit?: number,
    from?: string,
    to?: string
  ): Promise<EventDto[]> {
    return unwrap(
      this.api.search(
        undefined,
        latitude,
        longitude,
        radiusMeters,
        undefined,
        undefined,
        undefined,
        undefined,
        limit,
        from,
        to,
        requesterUserId
      )
    );
  }

  async searchByBoundingBox(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number,
    requesterUserId?: string,
    limit?: number,
    from?: string,
    to?: string
  ): Promise<EventDto[]> {
    return unwrap(
      this.api.search(
        undefined,
        undefined,
        undefined,
        undefined,
        minLat,
        maxLat,
        minLng,
        maxLng,
        limit,
        from,
        to,
        requesterUserId
      )
    );
  }

  async searchByDateRange(
    from: string,
    to: string,
    requesterUserId?: string,
    limit?: number
  ): Promise<EventDto[]> {
    return unwrap(
      this.api.search(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        limit,
        from,
        to,
        requesterUserId
      )
    );
  }

  async addAttendee(
    eventId: string,
    userId: string,
    requesterUserId: string
  ): Promise<EntityConnectionDto> {
    return unwrap(
      this.api.addConnection(
        eventId,
        userId,
        requesterUserId,
        { type: MutateEventEntityConnectionDtoTypeEnum.attendee }
      )
    );
  }

  async removeAttendee(
    eventId: string,
    userId: string,
    requesterUserId: string
  ): Promise<void> {
    return unwrap(
      this.api.removeConnection(
        eventId,
        userId,
        requesterUserId,
        { type: MutateEventEntityConnectionDtoTypeEnum.attendee }
      )
    );
  }

  async getAttendees(
    eventId: string,
    requesterUserId?: string
  ): Promise<UserEntityConnectionDto[]> {
    return unwrap(
      this.api.getConnections(
        eventId,
        [EventControllerGetConnectionsTypeEnum.attendee],
        requesterUserId
      )
    );
  }

  async promoteToAdmin(
    eventId: string,
    userId: string,
    requesterUserId: string
  ): Promise<EntityConnectionDto> {
    return unwrap(
      this.api.addConnection(
        eventId,
        userId,
        requesterUserId,
        { type: MutateEventEntityConnectionDtoTypeEnum.admin }
      )
    );
  }

  async demoteToAttendee(
    eventId: string,
    userId: string,
    requesterUserId: string
  ): Promise<EntityConnectionDto> {
    return unwrap(
      this.api.addConnection(
        eventId,
        userId,
        requesterUserId,
        { type: MutateEventEntityConnectionDtoTypeEnum.attendee }
      )
    );
  }

  async getAdmins(
    eventId: string,
    requesterUserId?: string
  ): Promise<UserEntityConnectionDto[]> {
    return unwrap(
      this.api.getConnections(
        eventId,
        [EventControllerGetConnectionsTypeEnum.admin],
        requesterUserId
      )
    );
  }

  async getOwner(
    eventId: string,
    requesterUserId?: string
  ): Promise<UserEntityConnectionDto | undefined> {
    const connections = await unwrap(
      this.api.getConnections(
        eventId,
        [EventControllerGetConnectionsTypeEnum.owner],
        requesterUserId
      )
    );
    return connections[0];
  }
}
