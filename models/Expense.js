const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Food",
                "Travel",
                "Accommodation",
                "Shopping",
                "Fuel",
                "Entertainment",
                "Medical",
                "Groceries",
                "Bills",
                "Other"
            ]
        },

        paymentMode: {
            type: String,
            required: true,
            enum: [
                "Cash",
                "UPI",
                "Debit Card",
                "Credit Card",
                "Net Banking"
            ]
        },

        expenseDate: {
            type: Date,
            required: true
        },

        location: {
            type: String,
            default: ""
        },

        notes: {
            type: String,
            default: ""
        },

        receiptImage: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Expense", expenseSchema);