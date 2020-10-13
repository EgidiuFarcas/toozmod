const mongoose = require("mongoose");

const strikeSchema = mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    prettyID: String,
    username: String,
    userID: String,
    reason: String,
    timestamp: String,
});

module.exports = mongoose.model("Strike", strikeSchema);