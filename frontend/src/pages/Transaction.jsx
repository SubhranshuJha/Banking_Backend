import React, { useState } from "react";
import axios from "axios";

const TransactionPage = () => {

    const [formData, setFormData] = useState({
        fromAccount: "",
        toAccount: "",
        amount: "",
        idempotencyKey: ""
    });

    // handle input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/transactions",
                formData
            );

            alert("Transaction Successful");
            console.log(res.data);

        } catch (err) {
            console.error(err);
            alert("Transaction Failed");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Make Transaction</h2>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>From Account:</label><br />
                    <input
                        type="text"
                        name="fromAccount"
                        value={formData.fromAccount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>To Account:</label><br />
                    <input
                        type="text"
                        name="toAccount"
                        value={formData.toAccount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Amount:</label><br />
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Idempotency Key:</label><br />
                    <input
                        type="text"
                        name="idempotencyKey"
                        value={formData.idempotencyKey}
                        onChange={handleChange}
                        required
                    />
                </div>

                <br />
                <button type="submit">Send Money</button>

            </form>
        </div>
    );
};

export default TransactionPage;
