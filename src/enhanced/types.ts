/**
 * Shared types and interfaces for the enhanced SDK client.
 * Re-exports model types for convenience; no additional interfaces needed
 * as we use the existing DTOs from the base API.
 */

// Re-export commonly used types from models for enhanced API consumers
export type {
  CreateUserDto,
  UpdateUserDto,
  MutateUserResponseDto,
  CreateEventDto,
  UpdateEventDto,
  CreateGroupDto,
  UpdateGroupDto,
  UserDto,
  EventDto,
  GroupDto,
  EntityConnectionDto,
  UserEntityConnectionDto,
  EventEntityConnectionDto,
  GroupEntityConnectionDto,
  GetUsersDto,
  GetEventsDto,
  GetGroupsDto,
} from '../models';
