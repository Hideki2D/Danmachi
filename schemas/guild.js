const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
    _id: String,
    unknownRole: String,
    verifedRole: String
},{
    versionKey: false
});

module.exports = mongoose.model("Guild", guildSchema);