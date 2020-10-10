import mongoose, { Schema, Document } from 'mongoose';

export interface ITimer extends Document {
    _id: mongoose.Types.ObjectId,
    username: string,
    userID: string,
    action: string,
    startedAt: string,
    endAt: string
};

const timerSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    username: String,
    userID: String,
    action: String,
    startedAt: String,
    endAt: String,
});

export default mongoose.model<ITimer>("Timer", timerSchema);