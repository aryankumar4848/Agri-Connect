const { createClient } = require('redis');

// Create Redis client with fallback URL
const client = createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
});

client.on('error', (err) => {
    // Log error but do not crash the application
    console.error('Redis Client Error:', err.message);
});

// Connect to Redis without blocking the rest of the app. If connection fails, the client will remain disconnected.
(async () => {
    try {
        await client.connect();
        console.log('Redis client connected');
    } catch (err) {
        console.error('Failed to connect to Redis:', err.message);
        // Continue without Redis; dependent code should handle missing cache gracefully.
    }
})();

module.exports = client;
