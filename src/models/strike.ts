import mongoose, { Schema, Document } from 'mongoose';

export interface IStrike extends Document{
    _id: mongoose.Types.ObjectId,
    prettyID: string,
    username: string,
    userID: string,
    reason: string,
    timestamp: string
};

const strikeSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    prettyID: String,
    username: String,
    userID: String,
    reason: String,
    timestamp: String,
});

export default mongoose.model<IStrike>("Strikes", strikeSchema);