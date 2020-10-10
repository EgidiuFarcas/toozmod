import StrikeModel from '../models/strike';
import Discord from 'discord.js';
import moment from 'moment';
import mongoose from 'mongoose';

export default class Strike {

    username: string;
    userID: string;
    reason: string;
    timestamp: moment.Moment;
    db_id: mongoose.Types.ObjectId;
    prettyID: string;

    /**
     * constructor
     * @param {Discord.User} user
     * @param {string} reason
     */
    constructor(user: Discord.User, reason: string) {
        this.username = user.tag;
        this.userID = user.id;
        this.reason = reason;
        this.timestamp = moment.utc();
    }

    /**
     * Save strike to database
     */
    async save(){
        //Get number of strikes already saved
        let prettyIndex = await StrikeModel.countDocuments();
        //If its not the first strike
        if(prettyIndex !== 0){
            //Get the latest strike
            let latest = await StrikeModel.find().sort({ _id: -1}).limit(10)[0];
            //Set current strike id to latest id + 1
            prettyIndex = parseInt(latest.prettyID) + 1;
        //If this is the first strike, set its id to 1
        }else prettyIndex = 1;
        
        //Create Model
        let s = new StrikeModel({
            _id: mongoose.Types.ObjectId(),
            prettyID: prettyIndex,
            username: this.username,
            userID: this.userID,
            reason: this.reason,
            timestamp: this.timestamp.toISOString(),
        });

        //Save in database
        await s.save()
            .then((result) => {
                //After saving keep the ObjectID and prettyID
                this.db_id = result._id;
                this.prettyID = result.prettyID;
            })
            .catch(err => console.log(err));
    }

    /**
     * Get all strikes that a user has
     * @param {string} userID 
     */
    static async getStrikes(userID: string){
        return await StrikeModel.find({userID: userID});
    }

    /**
     * Get number of strikes that a user has
     * @param {string} userID 
     */
    static async getStrikeCount(userID: string){
        return await StrikeModel.countDocuments({userID: userID});
    }

    /**
     * Get info for a specific strike
     * @param {string} strikeID 
     */
    static async getStrike(strikeID: string){
        return StrikeModel.find({prettyID: strikeID});
    }

    /**
     * Delete a specific strike
     * @param {string} strikeID 
     */
    static async deleteStrike(strikeID: string){
        return StrikeModel.findOneAndDelete({prettyID: strikeID});
    }
}