const mongoose = require("mongoose");

const timerSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    username: String,
    userID: String,
    action: String,
    started_at: String,
    end_at: String,
});

module.exports = mongoose.model("Timer", timerSchema);