const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('express-jwt');
const bodyParser = require('body-parser');
const TwitchUtilities = require('./twitchUtilities');

const ownerId = process.env.TWITCH_OWNER_ID || '';
const secret = Buffer.from(process.env.TWITCH_SECRET || '', 'base64');
const clientId = process.env.TWITCH_CLIENT_ID || '';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log('Got request', req.path, req.method);
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, DELETE');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return next();
});

app.use(jwt({ secret: secret }));
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send({ message: 'invalid token' });
    }
});

router.get('/', (req, res, next) => {
    console.log(req.headers);
    console.log(req.user);
    console.log("Got to GET");
    res.status(200).send({ you: "got it dude." })
});
router.get('/whoami', (req, res, next) => {
    console.log(req.headers);
    console.log(req.user);
    console.log("Got to GET");
    res.status(200).send({ you: req.user.role })
});
router.delete('/cta', async (req, res, next) => {
    if (req.user.role === 'broadcaster') {
        try {
            console.log(req.headers.authorization);
            console.log("Got to POST");
            console.log(clientId);
            console.log(req.body);
            console.log(req.user);
            const headers = {
                'Client-Id': clientId,
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + TwitchUtilities.makeServerToken(req.user.channel_id, ownerId, secret),
            };

            // Create the POST body for the Twitch API request.
            const body = JSON.stringify({
                content_type: 'application/json',
                message: 'rm',
                targets: ['broadcast'],
            });

            // Send the broadcast request to the Twitch API.
            const apiHost = ext.local ? 'localhost.rig.twitch.tv:3000' : 'api.twitch.tv';
            const pubSubUrl = `https://${apiHost}/extensions/message/${req.user.channel_id}`;
            const response = await axios({
                url: pubSubUrl,
                method: 'POST',
                headers,
                data: body,
            });
            console.log(response);
            res.status(200).send({ you: "got it dude." })
        } catch (e) {
            console.log(e);
            res.status(500).send(e.message);
        }
    } else {
        res.send(401);
    }
});
router.post('/cta', async (req, res, next) => {
    try {
        console.log(req.headers.authorization);
        // const payload = TwitchUtilities.verifyAndDecode(secret, req.headers.authorization);
        // const { channel_id: channelId, opaque_user_id: opaqueUserId } = payload;
        console.log("Got to POST");
        console.log(clientId);
        console.log(req.body);
        console.log(req.user);
        const headers = {
            'Client-Id': clientId,
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + TwitchUtilities.makeServerToken(req.user.channel_id, ownerId, secret),
        };

        // Create the POST body for the Twitch API request.
        const body = JSON.stringify({
            content_type: 'application/json',
            message: req.body.message,
            targets: ['broadcast'],
        });

        // Send the broadcast request to the Twitch API.
        const apiHost = 'api.twitch.tv';
        const pubSubUrl = `https://${apiHost}/extensions/message/${req.user.channel_id}`;
        const response = await axios({
            url: pubSubUrl,
            method: 'POST',
            headers,
            data: body,
        });
        console.log(response);
        res.status(200).send({ you: "got it dude." })
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});
app.use('/', router);

module.exports = app