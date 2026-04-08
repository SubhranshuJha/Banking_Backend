import mongoose from "mongoose";

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
    type : {
        type: String,
        enum: ['transfer', 'system_funding'],
        default: 'transfer'
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