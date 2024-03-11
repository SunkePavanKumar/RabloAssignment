import mongoose from "mongoose";
const connect = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDb`);
  } catch (error) {
    console.error(`Error while connecting to the database`);
  }
};

export default connect;
