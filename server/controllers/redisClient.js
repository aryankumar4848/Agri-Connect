const { createClient } = require('redis');

const client = createClient({
    username: 'default',
    password: 'oYjEJ3sZ93AsomY0rfnvxIxJK2MJ1vdM',
    socket: {
        host: 'redis-12092.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 12092
    }
});

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log('Redis client connected');

        // Test Redis connection
        await client.set('foo', 'bar');
        const result = await client.get('foo');
        console.log(result); // >>> bar
    } catch (error) {
        console.error('Error connecting to Redis:', error);
    }
})();

module.exports = client;
