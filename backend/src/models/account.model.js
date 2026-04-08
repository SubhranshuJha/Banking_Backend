import mongoose from "mongoose";
import ledgerModel from "./ledger.model.js";

const accountSchema = new mongoose.Schema({

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
        index:true
    } ,
    status : {
        enum : ['active', 'inactive', 'closed'],
        type:String,
        default:'active'
    },
    currency : {
        type:String,
        required:true,
        default:'INR'
    }
} , {timestamps:true});

accountSchema.index({ user: 1 , status: 1 });

accountSchema.methods.getBalance = async function(options = {}){

    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        { $group: {
            _id: null,
            totalDebit: { $sum: { $cond: [ { $eq: [ "$type", "debit" ] }, "$amount", 0 ] } },
            totalCredit: { $sum: { $cond: [ { $eq: [ "$type", "credit" ] }, "$amount", 0 ] } }
            }
        },
        {
            $project: {
                _id: 0,
                balance: { $subtract: [ "$totalCredit", "$totalDebit" ] }
            }
        }
        
        
    ]).session(options.session || null);

    if ( balanceData.length ==0 ) return 0;
    return balanceData[0].balance;
}

const accountModel = mongoose.model('Account', accountSchema);  
export default accountModel;
    