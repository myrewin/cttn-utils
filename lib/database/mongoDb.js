import mongoose from "mongoose";
import { devLog } from "../utils";
export const mongoStart = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { autoIndex: false });
        devLog("Mongo DB is connected");
    }
    catch (err) {
        devLog(err);
    }
};
