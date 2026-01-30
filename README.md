# @proxima-nexus/sdk-typescript

TypeScript SDK for the Proxima Nexus Data Plane API.

> **Note:** Version 2.0.0 introduced breaking changes. See [CHANGELOG.md](./CHANGELOG.md) for migration details. Version 2.1.0 adds an **Enhanced Client** with a simplified, domain-driven API.

## Installation

```bash
npm install @proxima-nexus/sdk-typescript
```

## Client Options

The SDK provides two client options:

- **ProximaNexusClient** (base) – Direct mapping to the Data Plane API. Returns Axios promises; you use `.data` on responses.
- **EnhancedProximaNexusClient** – Higher-level API with simpler method names, unwrapped return values (no `.data`), and domain helpers (e.g. `getFriends`, `searchByDisplayName`). Use `client.base` when you need the raw APIs.

## Usage

### Basic Setup (Base Client)

```typescript
import { ProximaNexusClient } from '@proxima-nexus/sdk-typescript';

const client = new ProximaNexusClient({
  apiKey: process.env.PROXIMA_NEXUS_API_KEY!,
  baseURL: 'https://api.proxima-nexus.com',
});
```

### Enhanced Client (Recommended for New Code)

```typescript
import { EnhancedProximaNexusClient } from '@proxima-nexus/sdk-typescript';

const client = new EnhancedProximaNexusClient({
  apiKey: process.env.PROXIMA_NEXUS_API_KEY!,
  baseURL: 'https://api.proxima-nexus.com',
});

// Methods return unwrapped data (no .data)
const user = await client.users.getUser('user-123', 'requester-123'); // UserDto
const friends = await client.users.getFriends('user-123');           // UserEntityConnectionDto[]
const users = await client.users.searchByDisplayName('John', undefined, 10);

// Friend workflow
await client.users.sendFriendRequest('alice-id', 'bob-id');
await client.users.acceptFriendRequest('bob-id', 'alice-id');
await client.users.removeFriend('alice-id', 'bob-id');

// Access raw APIs when needed
const rawResponse = await client.base.users.get('user-123');
```

### User Operations (Base Client)

```typescript
async function main() {
  try {
    // Create a user
    const createResponse = await client.users.create({
      userId: 'user-123',
      displayName: 'John Doe',
      visibility: 'public',
      gender: 'male',
      birthDate: '1990-01-01',
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        name: 'New York, NY'
      }
    });
    console.log('Created user:', createResponse.data);

    // Search users
    const searchResponse = await client.users.search(
      'John', // displayName
      40.7128, // latitude
      -74.006, // longitude
      5000, // radius
      undefined, // minLatitude
      undefined, // maxLatitude
      undefined, // minLongitude
      undefined, // maxLongitude
      10, // limit
      'requester-123' // xProximaNexusRequesterUserId (optional)
    );
    console.log('Found users:', searchResponse.data);

    // Get user by ID
    const user = await client.users.get('user-123', 'requester-123');
    console.log('User details:', user.data);

    // Update a user
    const updated = await client.users.update(
      'user-123',
      'requester-123',
      {
        displayName: 'John Smith',
        gender: 'male',
        birthDate: '1990-01-01',
      }
    );
    console.log('Updated user:', updated.data);

    // Delete a user
    await client.users.remove('user-123', 'requester-123');

    // Get a batch of users
    const batchUsers = await client.users.getBatch(
      { userIds: ['user-1', 'user-2', 'user-3'] },
      'requester-123'
    );
    console.log('Batch users:', batchUsers.data);

    // Connection operations
    const connections = await client.users.getConnections(
      'user-123',
      undefined, // state filter (optional)
      undefined, // type filter (optional)
      'requester-123' // xProximaNexusRequesterUserId (optional)
    );
    console.log('Connections:', connections.data);

    await client.users.putConnection(
      'user-123',
      'friend-456',
      'requester-123',
      { type: 'friend' } // MutateUserConnectionDto
    );

    await client.users.deleteConnection(
      'user-123',
      'friend-456',
      'friend', // type: 'friend' | 'blocked'
      'requester-123'
    );

    // Get user's groups and events
    const groups = await client.users.getGroups('user-123', 'requester-123');
    console.log('User groups:', groups.data);

    const events = await client.users.getEvents('user-123', 'requester-123');
    console.log('User events:', events.data);
  } catch (error: any) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}
```

### Event Operations (Base Client)

```typescript
async function main() {
  try {
    // Create an event
    const event = await client.events.create({
      eventId: 'event-123',
      displayName: 'Tech Meetup',
      visibility: 'public',
      startTime: '2024-12-01T18:00:00Z',
      endTime: '2024-12-01T22:00:00Z',
      type: 'meetup',
      location: {
        latitude: 40.7128,
        longitude: -74.006,
        name: 'New York, NY'
      },
      description: 'Monthly tech meetup',
    });
    console.log('Created event:', event.data);

    // Search events
    const events = await client.events.search(
      'Tech', // displayName
      40.7128, // latitude
      -74.006, // longitude
      10000, // radius
      undefined, // minLatitude
      undefined, // maxLatitude
      undefined, // minLongitude
      undefined, // maxLongitude
      50, // limit
      'user-123' // xProximaNexusRequesterUserId (optional)
    );
    console.log('Found events:', events.data);

    // Get an event by ID
    const eventDetails = await client.events.get('event-123', 'user-123');
    console.log('Event details:', eventDetails.data);

    // Update an event
    const updatedEvent = await client.events.update(
      'event-123',
      'user-123',
      {
        displayName: 'Tech Meetup 2024',
        startTime: '2024-12-01T18:00:00Z',
        endTime: '2024-12-01T23:00:00Z',
        type: 'meetup',
      }
    );
    console.log('Updated event:', updatedEvent.data);

    // Delete an event
    await client.events.remove('event-123', 'user-123');

    // Get a batch of events
    const batchEvents = await client.events.getBatch(
      { eventIds: ['event-1', 'event-2', 'event-3'] },
      'user-123'
    );
    console.log('Batch events:', batchEvents.data);

    // Connection operations
    const connections = await client.events.getConnections(
      'event-123',
      undefined, // type filter (optional)
      'user-123' // xProximaNexusRequesterUserId (optional)
    );
    console.log('Connections:', connections.data);

    await client.events.addConnection(
      'event-123',
      'user-456',
      'user-123',
      { type: 'attendee' } // MutateEventEntityConnectionDto
    );

    await client.events.removeConnection(
      'event-123',
      'user-456',
      'user-123',
      { type: 'attendee' } // MutateEventEntityConnectionDto
    );
  } catch (error: any) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}
```

### Group Operations (Base Client)

```typescript
async function main() {
  try {
    // Create a group
    const group = await client.groups.create({
      groupId: 'group-123',
      displayName: 'Music Lovers',
      visibility: 'public',
      type: 'open', // enum: 'open' | 'request' | 'invite'
      description: 'A group for music enthusiasts',
    });
    console.log('Created group:', group.data);

    // Search groups
    const groups = await client.groups.search(
      'Music', // displayName
      40.7128, // latitude
      -74.006, // longitude
      5000, // radius
      undefined, // minLatitude
      undefined, // maxLatitude
      undefined, // minLongitude
      undefined, // maxLongitude
      100, // limit
      'user-123' // xProximaNexusRequesterUserId (optional)
    );
    console.log('Found groups:', groups.data);

    // Get a group by ID
    const groupDetails = await client.groups.get('group-123', 'user-123');
    console.log('Group details:', groupDetails.data);

    // Update a group
    const updatedGroup = await client.groups.update(
      'group-123',
      'user-123',
      {
        displayName: 'Music Enthusiasts',
        type: 'open',
      }
    );
    console.log('Updated group:', updatedGroup.data);

    // Delete a group
    await client.groups.remove('group-123', 'user-123');

    // Get a batch of groups
    const batchGroups = await client.groups.getBatch(
      { groupIds: ['group-1', 'group-2', 'group-3'] },
      'user-123'
    );
    console.log('Batch groups:', batchGroups.data);

    // Connection operations
    const connections = await client.groups.getConnections(
      'group-123',
      undefined, // state filter (optional)
      undefined, // type filter (optional)
      'user-123' // xProximaNexusRequesterUserId (optional)
    );
    console.log('Connections:', connections.data);

    await client.groups.addConnection(
      'group-123',
      'user-456',
      'user-123',
      { type: 'member' } // MutateGroupEntityConnectionDto
    );

    await client.groups.removeConnection(
      'group-123',
      'user-456',
      'user-123',
      { type: 'member' } // MutateGroupEntityConnectionDto
    );

    // Get group's events
    const groupEvents = await client.groups.getEvents('group-123', 'user-123');
    console.log('Group events:', groupEvents.data);
  } catch (error: any) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}
```

## Enhanced Client API Overview

The enhanced client exposes domain-focused methods:

**Users:** `getUser`, `getUsers`, `createUser`, `updateUser`, `deleteUser`, `searchByDisplayName`, `searchByRadius`, `searchByBoundingBox`, `sendFriendRequest`, `acceptFriendRequest`, `declineFriendRequest`, `removeFriend`, `getFriends`, `getPendingFriendRequests`, `blockUser`, `unblockUser`, `getBlockedUsers`, `getEvents`, `getGroups`

**Events:** `getEvent`, `getEvents`, `createEvent`, `updateEvent`, `deleteEvent`, `searchByDisplayName`, `searchByRadius`, `searchByBoundingBox`, `addAttendee`, `removeAttendee`, `getAttendees`, `promoteToAdmin`, `demoteToAttendee`, `getAdmins`, `getOwner`

**Groups:** `getGroup`, `getGroups`, `createGroup`, `updateGroup`, `deleteGroup`, `searchByDisplayName`, `searchByRadius`, `searchByBoundingBox`, `joinGroup`, `leaveGroup`, `approveMember`, `rejectMember`, `removeMember`, `getMembers`, `getPendingMembers`, `promoteToAdmin`, `demoteToMember`, `getAdmins`, `getOwner`, `getEvents`

Errors from the enhanced client are thrown as `NotFoundError`, `UnauthorizedError`, or `ValidationError` (see `src/enhanced/errors.ts`).

## Requester User ID

In version 2.0.0, the requester user ID is passed as a method parameter (`xProximaNexusRequesterUserId` / `requesterUserId`) rather than in request bodies. This parameter is optional for most operations but required for operations that modify entities (create, update, delete) or when accessing non-public entities.

## Configuration

The `ProximaNexusClientConfig` interface supports the following options:

```typescript
interface ProximaNexusClientConfig {
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
  axiosConfig?: AxiosRequestConfig;
}
```

## TypeScript Support

This SDK is written in TypeScript and provides full type definitions. All request and response types are automatically generated from the OpenAPI specification.

## Requirements

- Node.js >= 18.x
- axios >= 1.0.0 (peer dependency)

## License

ISC

## Support

For issues and questions, please visit: https://github.com/proxima-nexus/sdk-typescript/issues
