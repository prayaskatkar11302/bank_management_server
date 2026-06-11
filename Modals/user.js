import mongoose from "mongoose";
import { type } from "node:os";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    },

    profileImage: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        required: true
    },
    transactionPin: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
})

const User = mongoose.model("User", userSchema)

export default User