const jwt = require('jsonwebtoken');

module.exports = {
    makeServerToken(channelId, ownerId, secret, serverTokenDurationSec = 30) {
        const payload = {
            exp: Math.floor(Date.now() / 1000) + serverTokenDurationSec,
            channel_id: channelId,
            user_id: ownerId, // extension owner ID for the call to Twitch PubSub
            role: 'external',
            pubsub_perms: {
                send: ['*'],
            },
        };
        return jwt.sign(payload, secret, { algorithm: 'HS256' });
    }
}





