// import { MongoClient } from "mongodb";
const mongodb = require('mongodb')

// Replace the uri string with your MongoDB deployment's connection string.
const uri = "mongodb://evse-user:password@localhost:27017/evse";

const client = new mongodb.MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("evse");
    const movies = database.collection("default.users");

    // query for movies that have a runtime less than 15 minutes
    const query = { runtime: { $lt: 15 } };

    const options = {
      // sort returned documents in ascending order by title (A->Z)
      sort: { title: 1 },
      // Include only the `title` and `imdb` fields in each returned document
      projection: { _id: 0, title: 1, imdb: 1 },
    };

    // const cursor = movies.find(query, options);
    const cursor = movies.find();

    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }

    // replace console.dir with your callback to access individual elements
    await cursor.forEach(console.dir);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);
