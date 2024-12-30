import mongoose from "mongoose";
const connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/hotel");
    console.log("Connect data Success");
  } catch (error) {
    console.log("Error:", error);
  }
};

export default connect;
