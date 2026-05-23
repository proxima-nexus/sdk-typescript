# Changelog

All notable changes to the Proxima Nexus TypeScript SDK are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-05-23

### Added

- `UpdateEventSeriesDto` now exposes optional `instanceStartTime`, `instanceEndTime`, and `timezone` properties, enabling callers to mutate the wall-clock and zone of an event series. Server-side, changing any of these triggers regeneration of upcoming event instances.
- Tracks `@proxima-nexus/openapi@^2.4.0`.

## [2.4.3] - 2026-03-19

### Added

- Added `nearby` connection type support across connection enums and controller filters (`EventControllerGetConnectionsTypeEnum`, `GroupControllerGetConnectionsTypeEnum`, and related `*EntityConnectionDtoTypeEnum` / mutate enums).
- Added optional `latitude` and `longitude` query params to `UserApi.getEvents` and `UserApi.getGroups` for nearby event/group discovery.
- Enhanced user helpers now accept location coordinates and pass them through in `EnhancedUserApi.getEvents` and `EnhancedUserApi.getGroups`.

### Changed

- Updated `EnhancedGroupApi.getMembers` to include both `active` and `requested` connection states when listing group members.

## [2.4.1] - 2026-03-04

### Added

- New `associated_group` connection type across entity connection enums (`EntityConnectionDtoTypeEnum`, `EventEntityConnectionDtoTypeEnum`, `EventSeriesEntityConnectionDtoTypeEnum`, `GroupEntityConnectionDtoTypeEnum`, `UserEntityConnectionDtoTypeEnum`, and `MutateEventEntityConnectionDtoTypeEnum`) to represent events and series associated with a group.
- Updated `EventControllerGetConnectionsTypeEnum` to include `associated_group`, keeping controller-level connection filters aligned with the DTOs.

## [2.4.0] - 2026-03-04

### Added

- Batch lookup for **event series** via a new `getBatch` method on `EventSeriesApi` and a corresponding `getBatch(seriesIds: string[])` helper on `EnhancedEventSeriesApi`.
- Group-level event series listing through `GroupApi.getEventSeries` and the enhanced helper `getGroupEventSeries` on `EnhancedGroupApi`.
- New DTOs for series queries and connections: `GetEventSeriesDto` and `EventSeriesEntityConnectionDto` (both exported from the models index).

## [2.3.0] - 2026-03-02

### Added

- Time range filters (`from`, `to`) to event, user, group, and series APIs so you can easily query only ongoing or upcoming events.
- Enhanced client helpers for events now support passing `from`/`to` and include a new `searchByDateRange` method for date-only queries.
- Enhanced user and group helpers for `getEvents` now accept optional `from`/`to` parameters for consistent time-bounded queries across the SDK.

### Changed

- Default behavior for series instance listing now returns only ongoing and upcoming events (instead of all past and future instances), matching typical calendar UX expectations.

## [2.2.0] - 2026-03-02

### Added

- Support for **event series** (recurring events) via a new `EventSeriesApi` on `ProximaNexusClient` and `EnhancedEventSeriesApi` on `EnhancedProximaNexusClient`.
- New DTOs for event series: `CreateEventSeriesDto`, `EventSeriesDto`, and `UpdateEventSeriesDto`, plus a `seriesId` field on `EventDto` to link event instances back to their series.
- Enhanced client helpers to create, update, delete, and list instances in a series (`createSeries`, `getSeries`, `updateSeries`, `deleteSeries`, `getInstances`).

### Changed

- Relaxed `UpdateEventDto`, `UpdateGroupDto`, and `UpdateUserDto` so that most fields are optional, making partial updates easier and better aligned with the underlying API.
- Clarified `EventApi.update` behavior for series instances: only fields included in the request body are treated as overrides and will no longer be updated by series-level changes.

## [2.1.1] - 2026-02-04

### Changed

- Updated `@proxima-nexus/openapi` to `^2.0.1` and regenerated connection DTOs to match the latest API schema for connection states (including `incoming_request`, `outgoing_request`, and `invited`).
- Made `state` optional on connection DTOs and cleaned up enum values to better reflect the underlying API.
- Updated `UserApi` and `GroupApi` connection state enums to use the new state names.
- Adjusted enhanced client helpers so that:
  - `getPendingFriendRequests` returns both incoming and outgoing friend requests using the new state values.
  - `getBlockedUsers` filters on connection type `blocked` while keeping state `active`.
  - `getMembers` for groups returns active members, admins, and the owner.

## [2.1.0] - 2025-01-30

### Added

- **Enhanced Client** (`EnhancedProximaNexusClient`) – Higher-level API that wraps the base client with:
  - **Simplified method signatures** – No `RawAxiosRequestConfig`; `requesterUserId` instead of `xProximaNexusRequesterUserId`
  - **Unwrapped return values** – Methods return `Promise<T>` (e.g. `UserDto`) instead of Axios response; no `.data` needed
  - **Domain-focused methods** – e.g. `getUser`, `getFriends`, `sendFriendRequest`, `acceptFriendRequest`, `searchByDisplayName`, `searchByRadius`, `searchByBoundingBox`
  - **Friend workflow** – `sendFriendRequest`, `acceptFriendRequest`, `declineFriendRequest`, `removeFriend`, `getFriends`, `getPendingFriendRequests`
  - **Blocking** – `blockUser`, `unblockUser`, `getBlockedUsers`
  - **Event attendee/role** – `addAttendee`, `removeAttendee`, `getAttendees`, `promoteToAdmin`, `demoteToAttendee`, `getAdmins`, `getOwner`
  - **Group membership** – `joinGroup`, `leaveGroup`, `approveMember`, `rejectMember`, `removeMember`, `getMembers`, `getPendingMembers`, `promoteToAdmin`, `demoteToMember`, `getAdmins`, `getOwner`
- **Custom errors** – `NotFoundError`, `UnauthorizedError`, `ValidationError` (thrown instead of raw Axios errors when using the enhanced client)
- **Base client access** – `client.base` on `EnhancedProximaNexusClient` for direct access to `UserApi`, `EventApi`, `GroupApi` when needed

### Changed

- None; base client API is unchanged. Enhanced client is additive.

## [2.0.1] - 2025-01-29

### Changed

- Updated README.md to reflect version 2.0.0 API changes, including method renames, updated method signatures, and connection operation examples

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
