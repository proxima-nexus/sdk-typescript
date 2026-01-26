# @proxima-nexus/sdk-typescript

TypeScript SDK for the Proxima Nexus Data Plane API.

## Installation

```bash
npm install @proxima-nexus/sdk-typescript
```

## Usage

### Basic Setup

```typescript
import { ProximaNexusClient } from '@proxima-nexus/sdk-typescript';

// Initialize client
const client = new ProximaNexusClient({
  apiKey: process.env.PROXIMA_NEXUS_API_KEY!,
  baseURL: 'https://api.proxima-nexus.com',
});
```

### User Operations

```typescript
async function main() {
  try {
    // Create a user
    const createResponse = await client.users.create({
      createUserDto: {
        userId: 'user-123',
        displayName: 'John Doe',
        requesterUserId: 'requester-123',
        visibility: 'public',
        gender: 'male',
        birthDate: '1990-01-01',
        location: {
          latitude: 40.7128,
          longitude: -74.006,
          name: 'New York, NY'
        }
      },
    });
    console.log('Created user:', createResponse.data);

    // Search users
    const searchResponse = await client.users.search({
      displayName: 'John',
      latitude: 40.7128,
      longitude: -74.006,
      radius: 5000,
      limit: 10,
    });
    console.log('Found users:', searchResponse.data);

    // Get user by ID
    const user = await client.users.findOne({
      userId: 'user-123',
    });
    console.log('User details:', user.data);

    // Update a user
    const updated = await client.users.update({
      userId: 'user-123',
      updateUserDto: {
        requesterUserId: 'requester-123',
        displayName: 'John Smith',
        gender: 'male',
        birthDate: '1990-01-01',
      },
    });
    console.log('Updated user:', updated.data);

    // Delete a user
    await client.users.remove({
      userId: 'user-123',
    });

    // Get a batch of users
    const batchUsers = await client.users.getBatch({
      getUsersDto: {
        userIds: ['user-1', 'user-2', 'user-3'],
      },
    });
    console.log('Batch users:', batchUsers.data);

    // Friend operations
    const friends = await client.users.getFriends({
      userId: 'user-123',
    });
    console.log('Friends:', friends.data);

    await client.users.addFriend({
      userId: 'user-123',
      friendUserId: 'friend-456',
    });

    await client.users.removeFriend({
      userId: 'user-123',
      friendUserId: 'friend-456',
    });

    // Get user's groups and events
    const groups = await client.users.getGroups({
      userId: 'user-123',
    });
    console.log('User groups:', groups.data);

    const events = await client.users.getEvents({
      userId: 'user-123',
    });
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

### Event Operations

```typescript
async function main() {
  try {
    // Create an event
    const event = await client.events.create({
      createEventDto: {
        eventId: 'event-123',
        displayName: 'Tech Meetup',
        requesterUserId: 'user-123',
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
      },
    });
    console.log('Created event:', event.data);

    // Search events
    const events = await client.events.search({
      displayName: 'Tech',
      latitude: 40.7128,
      longitude: -74.006,
      radius: 10000,
      limit: 50,
    });
    console.log('Found events:', events.data);

    // Get an event by ID
    const eventDetails = await client.events.findOne({
      eventId: 'event-123',
    });
    console.log('Event details:', eventDetails.data);

    // Update an event
    const updatedEvent = await client.events.update({
      eventId: 'event-123',
      updateEventDto: {
        requesterUserId: 'user-123',
        displayName: 'Tech Meetup 2024',
        startTime: '2024-12-01T18:00:00Z',
        endTime: '2024-12-01T23:00:00Z',
        type: 'meetup',
      },
    });
    console.log('Updated event:', updatedEvent.data);

    // Delete an event
    await client.events.remove({
      eventId: 'event-123',
      requesterUserId: 'user-123',
    });

    // Get a batch of events
    const batchEvents = await client.events.getBatch({
      getEventsDto: {
        eventIds: ['event-1', 'event-2', 'event-3'],
      },
    });
    console.log('Batch events:', batchEvents.data);

    // Attendee operations
    const attendees = await client.events.getAttendees({
      eventId: 'event-123',
    });
    console.log('Attendees:', attendees.data);

    await client.events.addAttendee({
      eventId: 'event-123',
      userId: 'user-456',
    });
  } catch (error: any) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}
```

### Group Operations

```typescript
async function main() {
  try {
    // Create a group
    const group = await client.groups.create({
      createGroupDto: {
        groupId: 'group-123',
        displayName: 'Music Lovers',
        requesterUserId: 'user-123',
        visibility: 'public',
        type: 'club',
        description: 'A group for music enthusiasts',
      },
    });
    console.log('Created group:', group.data);

    // Search groups
    const groups = await client.groups.search({
      displayName: 'Music',
      latitude: 40.7128,
      longitude: -74.006,
      radius: 5000,
      limit: 100,
    });
    console.log('Found groups:', groups.data);

    // Get a group by ID
    const groupDetails = await client.groups.findOne({
      groupId: 'group-123',
    });
    console.log('Group details:', groupDetails.data);

    // Update a group
    const updatedGroup = await client.groups.update({
      groupId: 'group-123',
      updateGroupDto: {
        requesterUserId: 'user-123',
        displayName: 'Music Enthusiasts',
        type: 'club',
      },
    });
    console.log('Updated group:', updatedGroup.data);

    // Delete a group
    await client.groups.remove({
      groupId: 'group-123',
      requesterUserId: 'user-123',
    });

    // Get a batch of groups
    const batchGroups = await client.groups.getBatch({
      getGroupsDto: {
        groupIds: ['group-1', 'group-2', 'group-3'],
      },
    });
    console.log('Batch groups:', batchGroups.data);

    // Member operations
    const members = await client.groups.getMembers({
      groupId: 'group-123',
    });
    console.log('Members:', members.data);

    await client.groups.addMember({
      groupId: 'group-123',
      userId: 'user-456',
    });

    await client.groups.removeMember({
      groupId: 'group-123',
      userId: 'user-456',
    });

    // Get group's events
    const groupEvents = await client.groups.getEvents({
      groupId: 'group-123',
    });
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
