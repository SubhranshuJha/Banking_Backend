import e from "express";
import mongoose from "mongoose";
import accountModel from "./account.model.js";

const transactionSchema = new mongoose.Schema({
    
    fromAccount : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true,
        index:true
    },
    toAccount : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    status : {
        type:String,
        enum : ['pending', 'completed', 'failed'],
        default:'pending'
    },
    amount : {
        type:Number,
        required:true,
    },
    idempotencyKey : {
        type:String,
        required:true,
        unique:true,
        index:true
    }
} , {timestamps:true});     

transactionSchema.index({ fromAccount: 1, toAccount: 1, createdAt: 1 });

const transactionModel = mongoose.model('Transaction', transactionSchema);      
export default transactionModel;