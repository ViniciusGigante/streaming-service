import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;

const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ??
  (new MongoClient(uri).connect());

if (!global._mongoClientPromise) {
  global._mongoClientPromise = clientPromise;
}

export default async function getDatabase() {
  const client = await clientPromise;
  return client.db(dbName);
}
