import { MongoClient } from "mongodb"
import dotenv from "dotenv"
dotenv.config()

export const fetchRooms = async () => {
  const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@salt1.r85z6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  await client.connect()
  const collection = client.db("SocketLivechat").collection("Rooms");
  const document = await collection.find().toArray();
  client.close();
  return document[0].rooms
}
