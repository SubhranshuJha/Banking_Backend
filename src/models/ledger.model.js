import mongoose from "mongoose";


const ledgerSchema = new mongoose.Schema({
    account : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required:true,
        index:true,
        immutable:true
    },
    amount : {
        type:Number,
        min:0,
        required:true,
        immutable:true
    },
    transaction : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required:true,
        index:true,
        immutable:true
    },  
    type : {
        type:String,
        enum : ['debit', 'credit'],
        required:true,
        immutable:true
    }

} , {timestamps:true});

ledgerSchema.index({ account: 1, createdAt: 1 });


const preventLedgerModification = function(){
    throw new Error("Ledger entries cannot be modified or deleted");
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification);
ledgerSchema.pre('updateOne', preventLedgerModification);
ledgerSchema.pre('deleteOne', preventLedgerModification);
ledgerSchema.pre('deleteMany', preventLedgerModification);
ledgerSchema.pre('findOneAndDelete', preventLedgerModification);
ledgerSchema.pre('findOneAndRemove', preventLedgerModification);
ledgerSchema.pre('deleteOne', { document: true, query: false }, preventLedgerModification);
ledgerSchema.pre('updateMany', preventLedgerModification);


const ledgerModel = mongoose.model('Ledger', ledgerSchema);  
export default ledgerModel;