import type { GroupApi } from '../api/group-api';
import {
  GroupControllerGetConnectionsStateEnum,
  GroupControllerGetConnectionsTypeEnum,
} from '../api/group-api';
import type {
  CreateGroupDto,
  EntityConnectionDto,
  EventEntityConnectionDto,
  EventSeriesEntityConnectionDto,
  GroupDto,
  UpdateGroupDto,
  UserEntityConnectionDto,
} from '../models';
import { MutateGroupEntityConnectionDtoTypeEnum } from '../models/mutate-group-entity-connection-dto';
import { unwrap } from './errors';

export class EnhancedGroupApi {
  constructor(private readonly api: GroupApi) {}

  async getGroup(
    groupId: string,
    requesterUserId?: string
  ): Promise<GroupDto> {
    return unwrap(this.api.get(groupId, requesterUserId));
  }

  async getGroups(
    groupIds: string[],
    requesterUserId?: string
  ): Promise<GroupDto[]> {
    return unwrap(this.api.getBatch({ groupIds }, requesterUserId));
  }

  async createGroup(
    creatorUserId: string,
    data: CreateGroupDto
  ): Promise<string> {
    return unwrap(this.api.create(creatorUserId, data));
  }

  async updateGroup(
    groupId: string,
    requesterUserId: string,
    data: UpdateGroupDto
  ): Promise<string> {
    return unwrap(this.api.update(groupId, requesterUserId, data));
  }

  async deleteGroup(
    groupId: string,
    requesterUserId: string
  ): Promise<void> {
    return unwrap(this.api.remove(groupId, requesterUserId));
  }

  async searchByDisplayName(
    displayName: string,
    requesterUserId?: string,
    limit?: number
  ): Promise<GroupDto[]> {
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
        undefined,
        undefined,
        requesterUserId
      )
    );
  }

  async searchByRadius(
    latitude: number,
    longitude: number,
    radiusMeters: number,
    requesterUserId?: string,
    limit?: number
  ): Promise<GroupDto[]> {
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
        undefined,
        undefined,
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
    limit?: number
  ): Promise<GroupDto[]> {
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
        undefined,
        undefined,
        requesterUserId
      )
    );
  }

  async joinGroup(
    groupId: string,
    userId: string
  ): Promise<EntityConnectionDto> {
    return unwrap(
      this.api.addConnection(
        groupId,
        userId,
        userId,
        { type: MutateGroupEntityConnectionDtoTypeEnum.member }
      )
    );
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    return unwrap(
      this.api.removeConnection(
        groupId,
        userId,
        userId,
        { type: MutateGroupEntityConnectionDtoTypeEnum.member }
      )
    );
  }

  async approveMember(
    groupId: string,
    userId: string,
    requesterUserId: string
  ): Promise<EntityConnectionDto> {
    return unwrap(
      this.api.addConnection(
        groupId,
        userId,
        requesterUserId,
        { type: MutateGroupEntityConnectionDtoTypeEnum.member }
      )
    );
  }

  async rejectMember(
    groupId: string,
    userId: string,
    requesterUserId: string
  ): Promise<void> {
    return unwrap(
      this.api.removeConnection(
        groupId,
        userId,
        requesterUserId,
        { type: MutateGroupEntityConnectionDtoTypeEnum.member }
      )
    );
  }

  async removeMember(
    groupId: string,
    userId: string,
    requesterUserId: string
  ): Promise<void> {
    return unwrap(
      this.api.removeConnection(
        groupId,
        userId,
        requesterUserId,
        { type: MutateGroupEntityConnectionDtoTypeEnum.member }
      )
    );
  }

  async getMembers(
    groupId: string,
    requesterUserId?: string
  ): Promise<UserEntityConnectionDto[]> {
    return unwrap(
      this.api.getConnections(
        groupId,
        [GroupControllerGetConnectionsStateEnum.active],
        [
          GroupControllerGetConnectionsTypeEnum.member,
          GroupControllerGetConnectionsTypeEnum.admin,
          GroupControllerGetConnectionsTypeEnum.owner,
        ],
        requesterUserId
      )
    );
  }

  async getPendingMembers(
    groupId: string,
    requesterUserId?: string
  ): Promise<UserEntityConnectionDto[]> {
    return unwrap(
      this.api.getConnections(
        groupId,
        [GroupControllerGetConnectionsStateEnum.requested],
        [GroupControllerGetConnectionsTypeEnum.member],
        requesterUserId
      )
    );
  }

  async promoteToAdmin(
    groupId: string,
    userId: string,
    requesterUserId: string
  ): Promise<EntityConnectionDto> {
    // Remove any existing connection
    await unwrap(
      this.api.removeConnection(
        groupId,
        userId,
        requesterUserId,
        { type: MutateGroupEntityConnectionDtoTypeEnum.member }
      )
    );
    // Create a new admin connection
    return unwrap(
      this.api.addConnection(
        groupId,
        userId,
        requesterUserId,
        { type: MutateGroupEntityConnectionDtoTypeEnum.admin }
      )
    );
  }

  async demoteToMember(
    groupId: string,
    userId: string,
    requesterUserId: string
  ): Promise<EntityConnectionDto> {
    // Remove any existing connection
    await unwrap(
      this.api.removeConnection(
        groupId,
        userId,
        requesterUserId,
        { type: MutateGroupEntityConnectionDtoTypeEnum.admin }
      )
    );
    // Create a new member connection
    return await unwrap(
      this.api.addConnection(
        groupId,
        userId,
        requesterUserId,
        { type: MutateGroupEntityConnectionDtoTypeEnum.member }
      )
    );
  }

  async getAdmins(
    groupId: string,
    requesterUserId?: string
  ): Promise<UserEntityConnectionDto[]> {
    return unwrap(
      this.api.getConnections(
        groupId,
        [GroupControllerGetConnectionsStateEnum.active],
        [GroupControllerGetConnectionsTypeEnum.admin],
        requesterUserId
      )
    );
  }

  async getOwner(
    groupId: string,
    requesterUserId?: string
  ): Promise<UserEntityConnectionDto | undefined> {
    const connections = await unwrap(
      this.api.getConnections(
        groupId,
        [GroupControllerGetConnectionsStateEnum.active],
        [GroupControllerGetConnectionsTypeEnum.owner],
        requesterUserId
      )
    );
    return connections[0];
  }

  async getEvents(
    groupId: string,
    from?: string,
    to?: string,
    requesterUserId?: string
  ): Promise<EventEntityConnectionDto[]> {
    return unwrap(this.api.getEvents(groupId, from, to, requesterUserId));
  }

  async getGroupEventSeries(groupId: string): Promise<EventSeriesEntityConnectionDto[]> {
    return unwrap(this.api.getEventSeries(groupId));
  }
}
