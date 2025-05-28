import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;
let redisSubscriber: RedisClientType;
let redisPublisher: RedisClientType;

export async function initializeRedis() {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    // Main Redis client for general operations
    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
      },
    });

    // Subscriber client for pub/sub
    redisSubscriber = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
      },
    });

    // Publisher client for pub/sub
    redisPublisher = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => Math.min(retries * 50, 1000),
      },
    });

    // Error handlers
    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisSubscriber.on('error', (err) => console.error('Redis Subscriber Error:', err));
    redisPublisher.on('error', (err) => console.error('Redis Publisher Error:', err));

    // Connect all clients
    await Promise.all([
      redisClient.connect(),
      redisSubscriber.connect(),
      redisPublisher.connect(),
    ]);

    console.log('📡 Redis clients connected successfully');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    throw error;
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis has not been initialized. Call initializeRedis() first.');
  }
  return redisClient;
}

export function getRedisSubscriber(): RedisClientType {
  if (!redisSubscriber) {
    throw new Error('Redis subscriber has not been initialized. Call initializeRedis() first.');
  }
  return redisSubscriber;
}

export function getRedisPublisher(): RedisClientType {
  if (!redisPublisher) {
    throw new Error('Redis publisher has not been initialized. Call initializeRedis() first.');
  }
  return redisPublisher;
}

// Cache helpers
export async function setCache(key: string, value: any, expiration = 3600) {
  try {
    const client = getRedisClient();
    await client.setEx(key, expiration, JSON.stringify(value));
  } catch (error) {
    console.error('❌ Error setting cache:', error);
  }
}

export async function getCache(key: string) {
  try {
    const client = getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('❌ Error getting cache:', error);
    return null;
  }
}

export async function deleteCache(key: string) {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error('❌ Error deleting cache:', error);
  }
}

export async function setCacheWithPattern(pattern: string, value: any, expiration = 3600) {
  try {
    const client = getRedisClient();
    await client.setEx(pattern, expiration, JSON.stringify(value));
  } catch (error) {
    console.error('❌ Error setting cache with pattern:', error);
  }
}

export async function deleteCacheWithPattern(pattern: string) {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('❌ Error deleting cache with pattern:', error);
  }
}

// Pub/Sub helpers
export async function publishMessage(channel: string, message: any) {
  try {
    const publisher = getRedisPublisher();
    await publisher.publish(channel, JSON.stringify(message));
  } catch (error) {
    console.error('❌ Error publishing message:', error);
  }
}

export async function subscribeToChannel(channel: string, callback: (message: any) => void) {
  try {
    const subscriber = getRedisSubscriber();
    await subscriber.subscribe(channel, (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        callback(parsedMessage);
      } catch (error) {
        console.error('❌ Error parsing subscribed message:', error);
      }
    });
  } catch (error) {
    console.error('❌ Error subscribing to channel:', error);
  }
}

// Graceful shutdown
export async function disconnectRedis() {
  try {
    await Promise.all([
      redisClient?.disconnect(),
      redisSubscriber?.disconnect(),
      redisPublisher?.disconnect(),
    ]);
    console.log('📡 Redis clients disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting Redis:', error);
  }
}

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await disconnectRedis();
}); 