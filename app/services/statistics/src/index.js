const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const passportHTTPBearer = require('passport-http-bearer').Strategy;
const mongo = require('./database.js');

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const start = async() => {
    console.log("Starting Node Server")
    const app = express();
    console.log("MongoDB setup")
    const db = await mongo.connect();

    passport.use(new passportLocal((username, password, done) => {
        const users = db.db.collection('users');
        users.findOne({ username: username }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            if (!bcrypt.compareSync(password, user.password)) return done(null, false);
            return done(null, user);
        });
    }));

    passport.use(new passportHTTPBearer((token, done) => {
        const users = db.db.collection('users');
        try {
            jwt.verify(token, JWT_SECRET);
        } catch (exception) {
            return done(exception);
        }
        users.findOne({ token: token }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false);
            return done(null, user, { scope: 'all' });
        });
    }));

    app.use(cors())

    app.use(passport.initialize());

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/api/statistics', async(request, response) => {
        console.log("[Statistics] GET")
        return response.send(await mongo.getStatistics(db.db));
    });

    app.get('/api/statistics/latest', async(request, response) => {
        console.log("[Statistics] GET Latest")
        return response.send(await mongo.getStatisticsLatest(db.db));
    });

    app.post('/api/statistics', async(request, response) => {
        console.log("[Statistics] POST")
        return response.send(await mongo.insertStatistics(db.db, request.body));
    });

    app.listen(PORT, () => console.log(`Marvel Hero Manager API listening on port ${PORT}`));
}
start();