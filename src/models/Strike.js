const moment = require("moment");
const mongoose = require("mongoose");
const StrikeModel = require("../database/strike");

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
        let prettyIndex = await StrikeModel.countDocuments();
        if(prettyIndex !== 0){
            let latest = await StrikeModel.find().sort({ _id: -1}).limit(10);
            latest = latest[0];
            prettyIndex = parseInt(latest.prettyID) + 1;
        }else prettyIndex = 1;
        let s = new StrikeModel({
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
        return await StrikeModel.find({userID: userID});
    }

    static async getStrike(strikeID){
        return StrikeModel.find({prettyID: strikeID});
    }

    static async getStrikeCount(userID){
        return await StrikeModel.countDocuments({userID: userID});
    }

    static async deleteStrike(strikeID){
        return StrikeModel.findOneAndDelete({prettyID: strikeID});
    }
}

module.exports = Strike;