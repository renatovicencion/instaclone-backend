const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowSchema = Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    follow: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Follow", FollowSchema);
