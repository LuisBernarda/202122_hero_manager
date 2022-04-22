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

const getSeries = (db) => {
    return new Promise((resolve, reject) => {
        const series = db.collection('series');
        series.find({}).toArray((err, docs) => {
            if (err) return reject(err);
            return resolve(docs);
        });
    });
}



const getComic = (db, id) => {
    return new Promise((resolve, reject) => {
        const comics = db.collection('comics');
        comics.findOne({ id: id }, (err, doc) => {
            if (err) return reject(err);
            return resolve(doc);
        });
    });
}

const insertComic = (db, comic) => {
    return new Promise((resolve, reject) => {
        const comics = db.collection('comics');

        comics.insertOne(comic, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

const getComics = (db) => {
    return new Promise((resolve, reject) => {
        const comics = db.collection('comics');
        comics.find({}).toArray((err, documents) => {
            if (err) return reject(err);
            return resolve(documents);
        });
    });
}


module.exports = {
    connect: connect,
    getSeries: getSeries,
    insertComic: insertComic,
    getComic: getComic,
    getComics: getComics,
}