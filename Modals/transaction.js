import mongoose from "mongoose";
import { type } from "node:os";
import { ref } from "node:process";

const transactionSchema = mongoose.Schema({
    type: {type:String,enum: ["deposit","send","receive"]},
    amount: {type:Number,required:true},
    to: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    from: {type:mongoose.Schema.Types.ObjectId,ref:"User"},
    date: {type:Date,default:Date.now}
},{ timestamps: true })

const Transaction = mongoose.model("Transaction", transactionSchema)

export default Transaction