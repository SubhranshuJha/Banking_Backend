import accountModel from "../models/account.model.js";

const createAccount = async (req, res) => {

    const user = req.user; 
    
    const account = await accountModel.create({
        user: user._id
    });
    res.status(201).json({ success: true, account });
}

const getUserAccount = async (req, res) => {
    const user = req.user;
    const account = await accountModel.find({ user: user._id });
    if(!account || account.length === 0){
        return res.status(404).json({ success: false, message: "Account not found" });
    }
    return res.status(200).json({ success: true, account });
}

const getAccountBalance = async (req, res) => {
    const user = req.user;
    const { accountId } = req.params;

    const account = await accountModel.findOne({ _id: accountId, user: user._id });
    if(!account){
        return res.status(404).json({ success: false, message: "Account not found" });
    }

    const balance = await account.getBalance();
    return res.status(200).json({ success: true, balance });



}

export { createAccount, getUserAccount , getAccountBalance };