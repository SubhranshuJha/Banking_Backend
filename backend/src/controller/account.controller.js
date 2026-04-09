import accountModel from "../models/account.model.js";
import mongoose from "mongoose";

const createAccount = async (req, res) => {
    try {
        const user = req.user;
        
        const account = await accountModel.create({
            user: user._id
        });
        return res.status(201).json({ success: true, account });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getUserAccount = async (req, res) => {
    try {
        const user = req.user;
        const account = await accountModel.find({ user: user._id });
        if(!account || account.length === 0){
            return res.status(404).json({ success: false, message: "Account not found" });
        }
        return res.status(200).json({ success: true, account });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

const getAccountBalance = async (req, res) => {
    try {
        const user = req.user;
        const { accountId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({ success: false, message: "Invalid account id" });
        }

        const account = await accountModel.findOne({ _id: accountId, user: user._id });
        if(!account){
            return res.status(404).json({ success: false, message: "Account not found" });
        }

        const balance = await account.getBalance();
        return res.status(200).json({ success: true, balance });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export { createAccount, getUserAccount , getAccountBalance };
