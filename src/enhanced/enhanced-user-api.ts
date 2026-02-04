import type { UserApi } from '../api/user-api';
import {
  UserControllerDeleteConnectionTypeEnum,
  UserControllerGetConnectionsStateEnum,
  UserControllerGetConnectionsTypeEnum,
} from '../api/user-api';
import type {
  CreateUserDto,
  EntityConnectionDto,
  EventEntityConnectionDto,
  GroupEntityConnectionDto,
  MutateUserResponseDto,
  UpdateUserDto,
  UserDto,
  UserEntityConnectionDto,
} from '../models';
import { MutateUserConnectionDtoTypeEnum } from '../models/mutate-user-connection-dto';
import { unwrap } from './errors';

export class EnhancedUserApi {
  constructor(private readonly api: UserApi) {}

  async getUser(userId: string, requesterUserId?: string): Promise<UserDto> {
    return unwrap(this.api.get(userId, requesterUserId));
  }

  async getUsers(
    userIds: string[],
    requesterUserId?: string
  ): Promise<UserDto[]> {
    return unwrap(this.api.getBatch({ userIds }, requesterUserId));
  }

  async createUser(data: CreateUserDto): Promise<MutateUserResponseDto> {
    return unwrap(this.api.create(data));
  }

  async updateUser(
    userId: string,
    data: UpdateUserDto,
    requesterUserId?: string
  ): Promise<MutateUserResponseDto> {
    const requester = requesterUserId ?? userId;
    return unwrap(this.api.update(userId, requester, data));
  }

  async deleteUser(userId: string, requesterUserId?: string): Promise<void> {
    const requester = requesterUserId ?? userId;
    return unwrap(this.api.remove(userId, requester));
  }

  async searchByDisplayName(
    displayName: string,
    requesterUserId?: string,
    limit?: number
  ): Promise<UserDto[]> {
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
  ): Promise<UserDto[]> {
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
  ): Promise<UserDto[]> {
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
        requesterUserId
      )
    );
  }

  async sendFriendRequest(
    fromUserId: string,
    toUserId: string
  ): Promise<EntityConnectionDto> {
    return unwrap(
      this.api.putConnection(
        fromUserId,
        toUserId,
        fromUserId,
        { type: MutateUserConnectionDtoTypeEnum.friend }
      )
    );
  }

  async acceptFriendRequest(
    userId: string,
    fromUserId: string
  ): Promise<EntityConnectionDto> {
    return unwrap(
      this.api.putConnection(
        userId,
        fromUserId,
        userId,
        { type: MutateUserConnectionDtoTypeEnum.friend }
      )
    );
  }

  async declineFriendRequest(userId: string, fromUserId: string): Promise<void> {
    return unwrap(
      this.api.deleteConnection(
        userId,
        fromUserId,
        UserControllerDeleteConnectionTypeEnum.friend,
        userId
      )
    );
  }

  async removeFriend(userId: string, friendUserId: string): Promise<void> {
    return unwrap(
      this.api.deleteConnection(
        userId,
        friendUserId,
        UserControllerDeleteConnectionTypeEnum.friend,
        userId
      )
    );
  }

  async getFriends(
    userId: string,
    requesterUserId?: string
  ): Promise<UserEntityConnectionDto[]> {
    return unwrap(
      this.api.getConnections(
        userId,
        [UserControllerGetConnectionsStateEnum.active],
        [UserControllerGetConnectionsTypeEnum.friend],
        requesterUserId ?? userId
      )
    );
  }

  async getPendingFriendRequests(
    userId: string
  ): Promise<UserEntityConnectionDto[]> {
    return unwrap(
      this.api.getConnections(
        userId,
        [
          UserControllerGetConnectionsStateEnum.outgoing_request,
          UserControllerGetConnectionsStateEnum.incoming_request,
        ],
        [UserControllerGetConnectionsTypeEnum.friend],
        userId
      )
    );
  }

  async blockUser(
    blockingUserId: string,
    blockedUserId: string
  ): Promise<EntityConnectionDto> {
    return unwrap(
      this.api.putConnection(
        blockingUserId,
        blockedUserId,
        blockingUserId,
        { type: MutateUserConnectionDtoTypeEnum.blocked }
      )
    );
  }

  async unblockUser(
    blockingUserId: string,
    blockedUserId: string
  ): Promise<void> {
    return unwrap(
      this.api.deleteConnection(
        blockingUserId,
        blockedUserId,
        UserControllerDeleteConnectionTypeEnum.blocked,
        blockingUserId
      )
    );
  }

  async getBlockedUsers(userId: string): Promise<UserEntityConnectionDto[]> {
    return unwrap(
      this.api.getConnections(
        userId,
        [UserControllerGetConnectionsStateEnum.active],
        [UserControllerGetConnectionsTypeEnum.blocked],
        userId
      )
    );
  }

  async getEvents(
    userId: string,
    requesterUserId?: string
  ): Promise<EventEntityConnectionDto[]> {
    return unwrap(this.api.getEvents(userId, requesterUserId));
  }

  async getGroups(
    userId: string,
    requesterUserId?: string
  ): Promise<GroupEntityConnectionDto[]> {
    return unwrap(this.api.getGroups(userId, requesterUserId));
  }
}
