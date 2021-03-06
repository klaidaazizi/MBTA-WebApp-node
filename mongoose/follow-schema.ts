/**
 * @file Create Follow Schema
 */
import mongoose, { Schema } from "mongoose";
import Follow from "../models/Follow";

const FollowSchema = new mongoose.Schema<Follow>({
    follower: {type: Schema.Types.ObjectId, ref: "UserModel"},
    user: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "follows"});
FollowSchema.index({user: 1, follower: 1}, { unique: true});
export default FollowSchema;