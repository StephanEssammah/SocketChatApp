import { MongoClient } from "mongodb"
import dotenv from "dotenv"
dotenv.config()

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@salt1.r85z6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const collection = client.db("SocketLivechat").collection("Rooms");

export const getRooms = async () => {
  await client.connect()
  const document = await collection.find({ "id": 1}).toArray();
  await client.close();
  return document[0].rooms
}

export const getMessages = async (roomName) => {
  await client.connect()
  const document = await collection.find({ "roomName": roomName}).toArray();
  await client.close();
  if(document.length === 0) return [];
  return document[0].messages
}

export const createRoom = async (roomName) => {
  await client.connect();
  await collection.insertOne({ "roomName": roomName, "messages": []})
  await collection.updateOne({ "id": 1}, { $push: {'rooms': roomName} })
  await client.close();
}

export const newMessage = async (data) => {
  await client.connect()
  await collection.updateOne({ "roomName": data.room}, { $push: {'messages': data} })
}
