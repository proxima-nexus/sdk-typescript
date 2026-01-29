# Changelog

All notable changes to the Proxima Nexus TypeScript SDK are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-29

### Breaking Changes

This release aligns with `@proxima-nexus/openapi` version 2.0.0, which includes significant breaking changes to the API specification. Please refer to the [OpenAPI changelog](https://github.com/proxima-nexus/openapi/blob/HEAD/CHANGELOG.md#200---2025-01-29) for complete details.

#### API Method Renames

The following methods have been renamed to align with the updated OpenAPI specification:

**User API:**
- `findOne` → `get`
- `addFriend` → `putConnection`
- `removeFriend` → `deleteConnection`
- `getFriends` → `getConnections`

**Event API:**
- `findOne` → `get`
- `addAttendee` → `addConnection`
- `getAttendees` → `getConnections`
- New: `removeConnection` (for removing attendees)

**Group API:**
- `findOne` → `get`
- `addMember` → `addConnection`
- `removeMember` → `removeConnection`
- `getMembers` → `getConnections`

#### Path and Parameter Changes

- User connections: `friends` → `connections`, `friendUserId` → `targetUserId`
- Event connections: `attendees` → `connections`
- Group connections: `members` → `connections`

#### Request Identity Header

**Requester identity** is now sent via the **`X-Proxima-Nexus-Requester-User-Id`** header instead of in request bodies. The `requesterUserId` field has been removed from:
- `CreateUserDto`
- `UpdateUserDto`
- `CreateEventDto`
- `UpdateEventDto`
- `CreateGroupDto`
- `UpdateGroupDto`

#### Schema Changes

- **Removed** `tenantId` from `UserDto`, `EventDto`, and `GroupDto`
- **Added** `requesterConnection` (`EntityConnectionDto`) to `UserDto`, `EventDto`, and `GroupDto`
- **EntityConnectionDto**: Now includes both `state` and `type`
- **New mutation DTOs**: `MutateUserConnectionDto`, `MutateEventEntityConnectionDto`, `MutateGroupEntityConnectionDto`
- **User connections**: PUT now requires `MutateUserConnectionDto` with `type` (`friend` | `blocked`); DELETE requires query param `type`
- **Event/Group connections**: PUT and DELETE now require request body with connection DTOs
- **Group type**: Now enum `open` | `request` | `invite` (replaces free-form string)
- **Events**: Added `maxNumAttendees` and `numAttendees` fields
- **Groups**: Added `numMembers` and `requesterConnection` fields

#### Security

- Security scheme changed from `bearer` to `api_key` for all operations

### Migration Guide

To migrate from version 1.x to 2.0.0:

1. **Update method names**: Replace all renamed methods (e.g., `findOne` → `get`, `addFriend` → `putConnection`)
2. **Update connection endpoints**: Replace `friends`/`attendees`/`members` references with `connections`
3. **Move requester identity to header**: Remove `requesterUserId` from request bodies and set the `X-Proxima-Nexus-Requester-User-Id` header instead
4. **Update connection DTOs**: Use the new mutation DTOs (`MutateUserConnectionDto`, etc.) with required `type` field
5. **Update connection operations**: Ensure PUT/DELETE operations for connections include the required request bodies

### Dependencies

- Updated `@proxima-nexus/openapi` to `^2.0.0`

## [1.0.0] - 2024-12-XX

### Added

- Initial release of the Proxima Nexus TypeScript SDK
- Support for User, Event, and Group operations
- Axios-based HTTP client
- Full TypeScript type definitions
- Simplified API method names (removed "Controller" prefixes)
