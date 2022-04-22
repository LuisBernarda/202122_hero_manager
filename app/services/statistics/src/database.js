const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');
const dbHost = process.env.DB_HOST || '127.0.0.1';
const dbPort = process.env.BD_PORT || 27017;
const dbName = process.env.DB_NAME || 'heroManager';

// Connection URL
const url = `mongodb://${dbHost}:${dbPort}/${dbName}`;
const mongoDBOptions = {
    reconnectInterval: 1000,
    reconnectTries: 60,
    autoReconnect: true,
    useNewUrlParser: true
}

const APP_USER_PASS = process.env.APP_USER_PASS || 'password';

const connect = () => {
    let db;
    let client;
    console.log(`[MongoDB] connecting to: ${url}`);

    return new Promise((resolve, reject) => {
        client = new MongoClient(url, mongoDBOptions);
        const tryToConnect = () => {

            console.log("Connecting to " + url)
            client.connect().then(async (data) => {
                console.log("Connected successfully to server");
                db = client.db(dbName);

                return resolve({
                    client: client,
                    db: db
                });
            }).catch((err) => {
                console.log(err);
                console.log("Retrying the connection...");
                setTimeout(tryToConnect, 1000);
            })
        };
        tryToConnect();
        
    })
}

const insertStatistics = (db, statistics) => {
    return new Promise((resolve, reject) => {
        const statisticsCollection = db.collection('statistics');
        statistics.date = new Date()
        statisticsCollection.insertOne(statistics, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

const getStatistics = (db) => {
    return new Promise((resolve, reject) => {
        const statistics = db.collection('statistics');
        statistics.find({}).sort({ date: -1 }).toArray((err, documents) => {
            if (err) return reject(err);
            return resolve(documents);
        });
    });
}

const getStatisticsLatest = (db) => {
    return new Promise((resolve, reject) => {
        const statistics = db.collection('statistics');
        let lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        lastWeek.setHours(0, 0, 0, 0);
        statistics.find({ date: { $gte: lastWeek } }).sort({ date: -1 }).toArray((err, documents) => {
            if (err) return reject(err);
            return resolve(documents);
        });
    });
}

module.exports = {
    connect: connect,
    insertStatistics: insertStatistics,
    getStatistics: getStatistics,
    getStatisticsLatest: getStatisticsLatest
}