import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();

const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD


const URL = `mongodb://${username}:${password}@ac-57tgaxj-shard-00-00.wiaqaiw.mongodb.net:27017,ac-57tgaxj-shard-00-01.wiaqaiw.mongodb.net:27017,ac-57tgaxj-shard-00-02.wiaqaiw.mongodb.net:27017/?ssl=true&replicaSet=atlas-r0i4tg-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0`
const connectToDatabase = async () => {
    try {
      await mongoose.connect(URL, {
        useNewUrlParser: true,
        // useUnifiedTopology: true
      });
      console.log(`Connection is successful`);
    } catch (err) {
      console.error('Connection failed:', err);
    }
  };
export default connectToDatabase;  