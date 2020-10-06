let StrikeSchema = require("../models/strikeSchema");
let moment = require("moment");
let mongoose = require("mongoose");

class Strike {

    db_id = null;
    prettyID = null;
    /**
     * constructor
     * @param user
     * @param reason
     */
    constructor(user, reason) {
        this.username = user.tag;
        this.userID = user.id;
        this.reason = reason;
        this.timestamp = moment.utc();
    }

    async save(){
        let prettyIndex = await StrikeSchema.countDocuments();
        if(prettyIndex !== 0){
            let latest = await StrikeSchema.find().sort({ _id: -1}).limit(10);
            latest = latest[0];
            prettyIndex = parseInt(latest.prettyID) + 1;
        }else prettyIndex = 1;
        let s = new StrikeSchema({
            _id: mongoose.Types.ObjectId(),
            prettyID: prettyIndex,
            username: this.username,
            userID: this.userID,
            reason: this.reason,
            timestamp: this.timestamp.toISOString(),
        });

        await s.save()
            .then(result => {
                this.db_id = result._id;
                this.prettyID = result.prettyID;
            })
            .catch(err => console.log(err));
    }

    static async getStrikes(userID){
        return await StrikeSchema.find({userID: userID});
    }

    static async getStrike(strikeID){
        return StrikeSchema.find({prettyID: strikeID});
    }

    static async getStrikeCount(userID){
        return await StrikeSchema.countDocuments({userID: userID});
    }

    static async deleteStrike(strikeID){
        return StrikeSchema.findOneAndDelete({prettyID: strikeID});
    }
}

module.exports = Strike;